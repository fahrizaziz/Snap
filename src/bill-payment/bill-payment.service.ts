import { ConsoleLogger, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ConnectionService } from 'src/connection/connection.service';
// import { BankDetail } from 'src/dto/bank_detail';
import { BankStatementSeqNo } from 'src/dto/bank_statement_seq_no';
import { BillPayment } from 'src/dto/bill_payment';
import { Payment } from 'src/dto/payment';
import BigDecimal from 'big.js';
import { format } from 'date-fns';
import { BankService } from 'src/bank/bank.service';
import { BillService } from 'src/bill/bill.service';
import { Bill } from 'src/dto/bill';
import { escapedCustomerName } from 'src/utils/utils';

@Injectable()
export class BillPaymentService {
  constructor(
    private connectionService: ConnectionService,
    private bankService: BankService,
    private billService: BillService,
  ) {}

  async findByBillPaymentId(billPayment: BillPayment) {
    const query = `
        SELECT TOP 1 bill_payment_id FROM t_bill_payment
        WHERE request_id = '${billPayment.request_id}'
    `;

    const result = await this.connectionService.query(query);
    return result[0];
  }

  async getCustomer(customerNo: string) {
    const query = `
        SELECT TOP 1 * FROM t_bill
        WHERE customer_no = '${customerNo}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async findByRequestId(billPayment: BillPayment) {
    const query = `
      SELECT TOP 1 * FROM t_bill_payment
      WHERE request_id = '${billPayment.request_id}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async findByEksternalId(billPayment: BillPayment) {
    const query = `
      SELECT TOP 1 * FROM t_bill_payment
      WHERE external_id = '${billPayment.ekternal_id}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async generateBankStatementNo(bankStatement: BankStatementSeqNo) {
    return await this.bankService.generateBankStatementSeqNo(bankStatement);
  }

  async saveBillPayment(billPayment: BillPayment) {
    const createdDate = new Date();
    const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
    const modifiedDate = new Date();
    const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
    // const originalString = billPayment.customer_name;
    // const formattedString = `\\"${originalString}\\"`;
    const query = `
      INSERT INTO t_bill_payment
      (
        bill_payment_code, 
        bank_partner,
        bank_va_code,
        bank_core_code,
        received_mode_PL,
        bank_state_seq_no,
        status,
        account_bank_received,
        customer_number,
        request_id,
        bank_channel_code,
        notes,
        customer_name,
        currency,
        paid_amount,
        total_amount,
        sub_company,
        transaction_date,
        reference_bill_code,
        reference_bank,
        is_advice,
        additional_data,
        created_by,
        created_date,
        modified_by,
        modified_date,
        is_active,
        seq_number,
        recorded_date_PL,
        external_id
      )
      VALUES 
      (
        '${billPayment.bill_payment_code}',
        '${billPayment.bank_partner}',
        '${billPayment.bank_va_code}',
         ${billPayment.bank_core_code},
        '${billPayment.received_mode_PL}',
        '${billPayment.bank_state_seq_no}',
        '${billPayment.status}',
        '${billPayment.account_bank_received}',
        '${billPayment.customer_number}',
        '${billPayment.request_id}',
        '${billPayment.bank_channel_code}',
        '${billPayment.notes}',
        '${escapedCustomerName(billPayment.customer_name)}',
        '${billPayment.currency}',
        '${billPayment.paid_amount}',
        '${billPayment.total_amount}',
        '${billPayment.sub_company}',
        '${billPayment.transaction_date}',
        '${billPayment.reference_bill_code}',
        '${billPayment.reference_bank}',
        '${billPayment.is_advice}',
        '${billPayment.additional_data}',
        '${billPayment.created_by}',
        '${formatCreatedDate}',
        '${billPayment.modified_by}',
        '${formatmodifiedDate}',
        '${billPayment.is_active}',
        '${billPayment.seq_number}',
         ${billPayment.recorded_date_PL},
        '${billPayment.ekternal_id}'
      )
    `;
    const result = this.connectionService.query(query);
    const respons = {
      data: result,
    };
    return respons;
  }

  async saldoBill(billPayment: BillPayment) {
    const query = `
      SELECT sum(nominal) as saldo from t_bill 
      where bill_status_code='STAT000001' 
      AND REPLACE(policy_no,'.','')= '${billPayment.policy_no}'
    `;

    return this.connectionService.query(query);
  }

  async saveBillBRI(payment: Payment) {
    const logBillPayment = new BillPayment();
    // const bankDetail = new BankDetail();
    const bankStatementNo = new BankStatementSeqNo();
    bankStatementNo.bankVaCode = payment.partnerServiceId;
    const resultSeqno = await this.generateBankStatementNo(bankStatementNo);
    const stringValue = String(resultSeqno.seqNumber);

    const bankVaCode = payment.partnerServiceId;

    const resultBankPartner = await this.bankService.findBankDetailByVaCode(
      bankVaCode,
    );

    const parsedDate = new Date(payment.trxDateTime);
    const randomValue = randomBytes(4).readUint32BE(0);
    const randomString = String(randomValue % 900000);
    const createdDate = new Date();
    const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
    const modifiedDate = new Date();
    const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
    const currentDate = new Date();
    const recordedDatePL = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    logBillPayment.bank_va_code = payment.partnerServiceId.replace(/\s/g, '');
    logBillPayment.bank_core_code = resultBankPartner.bankCoreCode;
    logBillPayment.received_mode_PL = resultBankPartner.receivedModePL;
    logBillPayment.bank_state_seq_no = resultSeqno.bankStatementSeqNo;
    logBillPayment.seq_number = stringValue;
    logBillPayment.status = '01';
    logBillPayment.account_bank_received = '';
    logBillPayment.customer_number = payment.customerNo;
    logBillPayment.request_id = payment.paymentRequestId;
    logBillPayment.bank_channel_code = payment.channelCode;
    logBillPayment.notes = '';
    logBillPayment.bill_payment_code = randomString;
    logBillPayment.bank_partner = resultBankPartner.bankCode;
    logBillPayment.customer_name = 'PT Equity Life Indonesia';
    logBillPayment.currency = payment.paidAmount.currency;
    logBillPayment.paid_amount = new BigDecimal(payment.paidAmount.value);
    logBillPayment.total_amount = new BigDecimal(payment.paidAmount.value);
    logBillPayment.sub_company = '00000';
    logBillPayment.reference_bill_code = null;
    logBillPayment.reference_bank = null;
    logBillPayment.is_advice = 'N';
    logBillPayment.additional_data = null;
    logBillPayment.transaction_date = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
    logBillPayment.ekternal_id = payment.ekternalId;
    const query = `
      INSERT INTO t_bill_payment
      (
        bill_payment_code,
        bank_partner,
        bank_va_code,
        bank_core_code,
        received_mode_PL,
        bank_state_seq_no,
        status,
        account_bank_received,
        customer_number,
        request_id,
        bank_channel_code,
        notes,
        customer_name,
        currency,
        paid_amount,
        total_amount,
        sub_company,
        transaction_date,
        reference_bill_code,
        reference_bank,
        is_advice,
        additional_data,
        created_by,
        created_date,
        modified_by,
        modified_date,
        is_active,
        seq_number,
        recorded_date_PL,
        external_id
      )
      VALUES
      (
        '${logBillPayment.bill_payment_code}',
        '${logBillPayment.bank_partner}',
        '${logBillPayment.bank_va_code}',
        '${logBillPayment.bank_core_code}',
        '${logBillPayment.received_mode_PL}',
        '${logBillPayment.bank_state_seq_no}',
        '${logBillPayment.status}',
        '${logBillPayment.account_bank_received}',
        '${logBillPayment.customer_number}',
        '${logBillPayment.request_id}',
        '${logBillPayment.bank_channel_code}',
        '${logBillPayment.notes}',
        '${escapedCustomerName(logBillPayment.customer_name)}',
        '${logBillPayment.currency}',
        '${logBillPayment.paid_amount}',
        '${logBillPayment.total_amount}',
        '${logBillPayment.sub_company}',
        '${logBillPayment.transaction_date}',
        '${logBillPayment.reference_bill_code}',
        '${logBillPayment.reference_bank}',
        '${logBillPayment.is_advice}',
        '${logBillPayment.additional_data}',
        '${logBillPayment.created_by}',
        '${formatCreatedDate}',
        '${logBillPayment.modified_by}',
        '${formatmodifiedDate}',
        '${logBillPayment.is_active}',
        '${logBillPayment.seq_number}',
        '${recordedDatePL}',
        '${logBillPayment.ekternal_id}'
      )
    `;
    const result = this.connectionService.query(query);
    const respons = {
      data: result,
    };
    return respons;
  }

  async saveBillBRIRe(payment: Payment) {
    const logBillPayment = new BillPayment();
    // const bankDetail = new BankDetail();
    const bankStatementNo = new BankStatementSeqNo();
    bankStatementNo.bankVaCode = payment.partnerServiceId;
    const billC = new Bill();
    billC.policy_no = payment.customerNo;
    const resultSeqno = await this.generateBankStatementNo(bankStatementNo);
    const stringValue = String(resultSeqno.seqNumber);

    const checkBill = await this.billService.getBill(billC);

    const bankVaCode = payment.partnerServiceId;

    const resultBankPartner = await this.bankService.findBankDetailByVaCode(
      bankVaCode,
    );

    const parsedDate = new Date(payment.trxDateTime);
    const randomValue = randomBytes(4).readUint32BE(0);
    const randomString = String(randomValue % 900000);
    const createdDate = new Date();
    const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
    const modifiedDate = new Date();
    const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
    const currentDate = new Date();
    const recordedDatePL = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    logBillPayment.bank_va_code = payment.partnerServiceId.replace(/\s/g, '');
    logBillPayment.bank_core_code = resultBankPartner.bankCoreCode;
    logBillPayment.received_mode_PL = resultBankPartner.receivedModePL;
    logBillPayment.bank_state_seq_no = resultSeqno.bankStatementSeqNo;
    logBillPayment.seq_number = stringValue;
    logBillPayment.status = '02';
    logBillPayment.account_bank_received = '';
    logBillPayment.customer_number = payment.customerNo;
    logBillPayment.request_id = payment.paymentRequestId;
    logBillPayment.bank_channel_code = payment.channelCode;
    logBillPayment.notes = '';
    logBillPayment.bill_payment_code = randomString;
    logBillPayment.bank_partner = resultBankPartner.bankCode;
    logBillPayment.customer_name = payment.virtualAccountName;
    logBillPayment.currency = payment.paidAmount.currency;
    logBillPayment.paid_amount = new BigDecimal(payment.paidAmount.value);
    logBillPayment.total_amount = new BigDecimal(payment.paidAmount.value);
    logBillPayment.sub_company = '00000';
    logBillPayment.reference_bill_code = checkBill[0].bill_code;
    logBillPayment.reference_bank = null;
    logBillPayment.is_advice = 'N';
    logBillPayment.additional_data = null;
    logBillPayment.transaction_date = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
    const query = `
    INSERT INTO t_bill_payment
    (
      bill_payment_code, 
      bank_partner,
      bank_va_code,
      bank_core_code,
      received_mode_PL,
      bank_state_seq_no,
      status,
      account_bank_received,
      customer_number,
      request_id,
      bank_channel_code,
      notes,
      customer_name,
      currency,
      paid_amount,
      total_amount,
      sub_company,
      transaction_date,
      reference_bill_code,
      reference_bank,
      is_advice,
      additional_data,
      created_by,
      created_date,
      modified_by,
      modified_date,
      is_active,
      seq_number,
      recorded_date_PL,
      external_id
    )
    VALUES 
    (
      '${logBillPayment.bill_payment_code}',
      '${logBillPayment.bank_partner}',
      '${logBillPayment.bank_va_code}',
      '${logBillPayment.bank_core_code}',
      '${logBillPayment.received_mode_PL}',
      '${logBillPayment.bank_state_seq_no}',
      '${logBillPayment.status}',
      '${logBillPayment.account_bank_received}',
      '${logBillPayment.customer_number}',
      '${logBillPayment.request_id}',
      '${logBillPayment.bank_channel_code}',
      '${logBillPayment.notes}',
      '${escapedCustomerName(logBillPayment.customer_name)}',
      '${logBillPayment.currency}',
      '${logBillPayment.paid_amount}',
      '${logBillPayment.total_amount}',
      '${logBillPayment.sub_company}',
      '${logBillPayment.transaction_date}',
      '${logBillPayment.reference_bill_code}',
      '${logBillPayment.reference_bank}',
      '${logBillPayment.is_advice}',
      '${logBillPayment.additional_data}',
      '${logBillPayment.created_by}',
      '${formatCreatedDate}',
      '${logBillPayment.modified_by}',
      '${formatmodifiedDate}',
      '${logBillPayment.is_active}',
      '${logBillPayment.seq_number}',
      '${recordedDatePL}',
      '${logBillPayment.ekternal_id}'
    )
  `;

    const result = this.connectionService.query(query);
    const respons = {
      data: result,
    };
    return respons;
  }

  async statusUpdateBillPayment(billPaymentId: string, accpuntNo: string) {
    const query = `
      UPDATE t_bill_payment
      SET account_bank_received = '${accpuntNo}'
      WHERE bill_payment_id = ${billPaymentId}
    `;
    return await this.connectionService.query(query);
  }

  async statusUpdateBillPaymentErrorPL(billPaymentId: string) {
    const query = `
      UPDATE t_bill_payment
      SET status = '02'
      WHERE bill_payment_id = ${billPaymentId}
    `;

    return await this.connectionService.query(query);
  }

  async statusUpdateBillPaymentSuccessPL(billPaymentId: string) {
    const query = `
      UPDATE t_bill_payment
      SET status = '03'
      WHERE bill_payment_id = ${billPaymentId}
    `;

    return await this.connectionService.query(query);
  }

  async statusUpdateBillPaymentReceivedNotFound(billPaymentId: string) {
    const query = `
      UPDATE t_bill_payment
      SET status = '04', notes = 'Data account bank received tidak ditemukan'
      WHERE bill_payment_id = ${billPaymentId}
    `;

    return await this.connectionService.query(query);
  }
}
