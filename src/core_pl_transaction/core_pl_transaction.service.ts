import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BankService } from 'src/bank/bank.service';
import { ConnectionService } from 'src/connection/connection.service';
import { LogCoreService } from 'src/log_core/log_core.service';
import axios from 'axios';
import { format } from 'date-fns';
import { PaymentSettlementWrapper } from 'src/dto/payment_settlement_wrapper';
import { BillPayment } from 'src/dto/bill_payment';
import { ProductCategory } from 'src/dto/product_category';
import { DataNotFoundException } from 'src/dto/data_not_found_exception';
import { StringUtilsService } from 'src/string_util/string_utils';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class CorePlTransactionService {
  constructor(
    private logCoreService: LogCoreService,
    private connectionService: ConnectionService,
    private bankService: BankService,
    private stringUtilsService: StringUtilsService,
    private logger: LoggerService,
  ) {}

  async batchSendPaymentToPL() {
    // Read log_core_transaction with condition core_receive_status = 01 AND 02 ,  is_active = 1 , retry_attempt <=5
    const query = `
      select * from t_log_core_transaction
      where core_receive_status in ('01', '02', '04')
      and is_active = '1'
      and retry_attempt <= 5
    `;
    const result = await this.connectionService.query(query);
    // Loop Pending And Failed Transaction
    this.logger.log(
      `[Found '${result.length}' pending,failed core transaction]`,
    );
    for (const logCoreTransaction of result) {
      try {
        // Parse Request JSON String to Object
        const paymentSettlementWrapper = JSON.parse(
          logCoreTransaction.request,
        ) as PaymentSettlementWrapper;
        this.logger.log('[JSON Payment Settle]', paymentSettlementWrapper);
        // Get t_bill_payment
        const query = `
          select * from t_bill_payment
          where bill_payment_id = '${logCoreTransaction.bill_payment_id}'
        `;
        const resultBillPayment = await this.connectionService.query(query);
        const finallResult =
          resultBillPayment.length > 0 ? resultBillPayment[0] : null;

        // Send To PL
        await this.sendReceivedPaymentToPL(
          paymentSettlementWrapper,
          finallResult,
        );
      } catch (error) {
        this.logger.error(
          '[Error Parsing String Request into Object Payment Settlement] : ',
          error.message,
        );
      }
    }
  }

  async sendReceivedPaymentToPL(
    paymentSettlementWrapper: PaymentSettlementWrapper,
    billPayment: BillPayment,
  ) {
    const logCoreTransaction = await this.logCoreService.findByBillPaymentId(
      billPayment,
    );
    const eventStart = new Date();
    const formatEventStart = format(eventStart, 'yyyy-MM-dd HH:mm:ss');
    logCoreTransaction.event_start = formatEventStart;

    try {
      if (!logCoreTransaction) {
        throw new Error('Log Core Transaction Not Found');
      }
      this.logger.log(
        '=============================  ASYNC CALL BEGIN ========================================',
      );
      this.logger.log('[ Bill Payment To Process] : ', billPayment);

      // initialized default status sendPL to fail (02)
      let coreReceivedStatus = '02';

      // Get Settlement Data
      const paymentSettlement = paymentSettlementWrapper.data;

      // Get & Set Product Category & Allocation [TL , ILP , HB || TLSD , STU_TSLD]
      const productCategoryAllocation =
        await this.bankService.getExistProposalOnPL(
          billPayment.customer_number,
        );
      this.logger.log(
        '[ Product Category Allocation ] : ',
        productCategoryAllocation,
      );

      // Check If Proposal no Not Found on PL
      let undefinedProduct;
      if (productCategoryAllocation) {
        // Set To Default TL
        undefinedProduct = new ProductCategory();
        undefinedProduct.proposal_no = '';
        undefinedProduct.product_category_code = 'TL';
        undefinedProduct.product_category = 'TRADISIONAL';
        undefinedProduct.allocation = 'TLSD';
      }

      // Set Product Category[TL, ILP , HB] & Allocation into Settlement Object
      paymentSettlement.product_category =
        undefinedProduct.product_category_code;
      paymentSettlement.allocation = undefinedProduct.allocation;

      // Get Bank Account Received
      const bankAccountReceived =
        await this.bankService.findBankAccountReceived(
          billPayment.bank_core_code,
          billPayment.received_mode_PL,
          billPayment.currency,
          paymentSettlement.product_category,
        );

      // Check If bankAccountReceived is not null
      if (bankAccountReceived == null) {
        this.logger.log(`[ Updating t_bill_payment status to '04']`);
      }

      // Set Bank_account_received into Settlement Object
      paymentSettlement.bank_account_number = bankAccountReceived.account_no;

      // Put on wrapper
      paymentSettlementWrapper.data = paymentSettlement;

      // Generate request from Java objects to JSON string for saving to DB
      const requestBodyJson = JSON.stringify(paymentSettlementWrapper);

      // Update t_log_core_transaction (Updating to json field : bank_account_received, Product Category, Allocation )
      logCoreTransaction.request = requestBodyJson;

      this.logger.log(
        '[ Update bank_account_received, product_category, allocatin ] : ',
        logCoreTransaction.request,
      );
      const updateQuery = `
          UPDATE t_log_core_transaction
          SET request = '${requestBodyJson}'
          WHERE bill_payment_id = '${billPayment.bill_payment_id}'
      `;
      await this.connectionService.query(updateQuery);

      // Check Is the transaction exist in PL by[] to prevent duplicate on PL
      const isExistPremiumOnPL = await this.bankService.isExistPremiumOnPL(
        billPayment.customer_number,
        billPayment.bank_state_seq_no,
      );
      this.logger.log('[ isExistPremiumOnPL] : ', isExistPremiumOnPL);

      // If not exist on PL Data then Send To PL
      if (!isExistPremiumOnPL) {
        this.logger.log('[ Premium On PL is Not Exist]');
        this.logger.log('[ Continue Send To API PL]');

        // Submit to PL
        const dataPL = paymentSettlementWrapper;
        const baseurl = process.env.PL_URL;
        const path = `${baseurl}${process.env.PL_PATH}`;
        const url = path;
        const token = process.env.PL_AUTH_HEADER;
        const headers = {
          Authorization: `Basic ${token}`,
        };

        let responsePL;
        if (!token) {
          throw new UnauthorizedException('Token tidak valid');
        }
        const eventEnd = new Date();
        const formatEventEnd = format(eventEnd, 'yyyy-MM-dd HH:mm:ss');
        responsePL = await axios.post(url, dataPL, { headers });

        // If Failed
        if (!responsePL || responsePL.errorDataDetail) {
          // Update log_core_transaction [status => 02 ]
          logCoreTransaction.response = responsePL == null ?? responsePL;
          this.logger.error('[ Update bill_payment status to 02]');
        } else if (responsePL.data) {
          // If Success
          // Update log_core_transaction [status => 03]
          const date = new Date();
          coreReceivedStatus = '03';

          // Update t_bill_payment [status => 03, account_bank_received => xxx]
          billPayment.status = '03';
          billPayment.recorded_date_PL = format(date, 'yyyy-MM-dd HH:mm:ss');
          billPayment.account_bank_received = bankAccountReceived.account_no;
          const query = `
            update t_bill_payment set status = '${billPayment.status}', recorded_date_PL = '${billPayment.recorded_date_PL}'
            where bill_payment_id = '${billPayment.bill_payment_id}'
          `;
          await this.connectionService.query(query);
          this.logger.log(
            '[ Update bill_payment status to 03] : ',
            billPayment,
          );
        } else {
          // Handling another error
          // Update log_core_transaction [status => 02 ]
          logCoreTransaction.response = responsePL;
          this.logger.error('[ Update bill_payment status to 02]');
        }

        // Update log_core_transaction [retry => +1 , event_start , event_end]
        logCoreTransaction.core_receive_status = coreReceivedStatus;
        logCoreTransaction.response = responsePL;
        logCoreTransaction.event_start = formatEventStart;
        logCoreTransaction.event_end = formatEventEnd;
        logCoreTransaction.retry_attempt = logCoreTransaction.retry_attempt + 1;
        const queryUpdate = `
          UPDATE t_log_core_transaction
          SET retry_attempt = '${logCoreTransaction.retry_attempt}',
          event_start = '${logCoreTransaction.event_start}',
          event_end = '${logCoreTransaction.event_end}',
          core_receive_status = '${logCoreTransaction.core_receive_status}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(queryUpdate);
        this.logger.log(
          '[ Update log_core_transaction] : ',
          logCoreTransaction,
        );
      } else {
        // If exist on PL Data just update current log and t_bill_payment
        this.logger.error('[ Premium PL already Exist]');
        const eventEnd = new Date();

        // Update log_core_transaction [status => 03]
        const formatEventEnd = format(eventEnd, 'yyyy-MM-dd HH:mm:ss');
        logCoreTransaction.core_receive_status = '03';
        logCoreTransaction.event_end = formatEventEnd;
        logCoreTransaction.retry_attempt = logCoreTransaction.retry_attempt + 1;
        const queryUpdate = `
          UPDATE t_log_core_transaction
          SET retry_attempt = '${logCoreTransaction.retry_attempt}',
          event_end = '${logCoreTransaction.event_end}',
          core_receive_status = '${logCoreTransaction.core_receive_status}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(queryUpdate);
        this.logger.log(
          '[ Direct Update log_core_transaction] : ',
          logCoreTransaction,
        );

        // Update t_bill_payment [status => 03, account_bank_received => xxx]
        billPayment.status = '03';
        billPayment.notes = 'E05';
        billPayment.account_bank_received = bankAccountReceived.account_no;
        const queryBilPaymentUpdate = `
          UPDATE t_bill_payment
          SET status = '${billPayment.status}',
          notes = '${billPayment.notes}',
          account_bank_received = '${billPayment.account_bank_received}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(queryBilPaymentUpdate);
        this.logger.log(
          '[ Direct Update bill_payment status to 03] : ',
          billPayment,
        );
      }
      this.logger.log(
        `=============================  ASYNC CALL END ========================================\n\n\n`,
      );
    } catch (error) {
      this.logger.error('[ Error On PL Transaction]');
      this.logger.error('[ Cause] : ', error.message);
      if (error instanceof DataNotFoundException) {
        billPayment.status = '04';
        billPayment.notes = 'Data account bank received tidak ditemukan';
        const query = `
          UPDATE t_bill_payment
          set status = '${billPayment.status}',
          notes = '${billPayment.notes}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(query);

        const eventEnd = new Date();
        const formatEventEnd = format(eventEnd, 'yyyy-MM-dd HH:mm:ss');
        logCoreTransaction.core_receive_status = '04';
        logCoreTransaction.event_end = formatEventEnd;
        logCoreTransaction.exception = error.message;
        logCoreTransaction.retry_attempt = logCoreTransaction.retry_attempt + 1;
        const queryUpdate = `
          UPDATE t_log_core_transaction
          SET retry_attempt = '${logCoreTransaction.retry_attempt}',
          event_end = '${logCoreTransaction.event_end}',
          exception = '${logCoreTransaction.exception}',
          core_receive_status = '${logCoreTransaction.core_receive_status}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(queryUpdate);
      } else {
        billPayment.status = '02';
        const query = `
          UPDATE t_bill_payment
          set status = '${billPayment.status}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(query);

        const eventEnd = new Date();
        const formatEventEnd = format(eventEnd, 'yyyy-MM-dd HH:mm:ss');
        const stackTrace = error.stack || '';
        logCoreTransaction.core_receive_status = '02';
        logCoreTransaction.event_end = formatEventEnd;
        logCoreTransaction.exception =
          error.message +
          ':' +
          this.stringUtilsService.substring(stackTrace, 0, 100);
        logCoreTransaction.retry_attempt = logCoreTransaction.retry_attempt + 1;

        const queryUpdate = `
          UPDATE t_log_core_transaction
          SET retry_attempt = '${logCoreTransaction.retry_attempt}',
          event_end = '${logCoreTransaction.event_end}',
          exception = '${logCoreTransaction.exception}',
          core_receive_status = '${logCoreTransaction.core_receive_status}'
          where bill_payment_id = '${billPayment.bill_payment_id}'
        `;
        await this.connectionService.query(queryUpdate);
      }
      this.logger.log(
        `=============================  ASYNC CALL END ========================================\n\n\n`,
      );
    }
  }
}
