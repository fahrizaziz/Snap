import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { ConnectionService } from 'src/connection/connection.service';
import { Inquery } from 'src/dto/inquery';
import { LogInquiry } from 'src/dto/log-inquiry';
import { Payment } from 'src/dto/payment';
import { PaymentBCA } from 'src/dto/payment_bca';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';

@Injectable()
export class LogInquiryBillService {
  constructor(
    private repoLogInquiry: LoginquirybilltransactionrepositoryService,
    private connectionService: ConnectionService,
  ) {}

  async checkIsExistRequestID(logInquiry: LogInquiry) {
    const logInquiryBillTransaction =
      this.repoLogInquiry.findByRequestId(logInquiry);
    if (logInquiryBillTransaction != null) {
      return logInquiryBillTransaction[0];
    }
    return;
    // if ((await logInquiryBillTransaction).length > 0) {
    //   return true;
    // }

    // return false;
  }

  async getUnpaidLogInquiryBillByInquiry(
    companyCode: string,
    customerNumber: string,
    requestID: string,
  ) {
    const query = `
    SELECT * FROM t_log_inquiry_bill_transaction t 
    JOIN t_spaj s ON s.spaj_no = t.customer_number 
    WHERE t.company_code = '${companyCode.replace(/\s/g, '')}' 
    AND t.customer_number = '${customerNumber}' 
    AND t.request_id = '${requestID.replace(/\s/g, '')}'
    AND (t.payment_status <> '00' OR t.payment_status IS null) 
    AND t.inquiry_status = '00' AND s.status = '01'
    `;

    const logInquiryBillTransaction = await this.connectionService.query(query);
    return logInquiryBillTransaction[0];
  }

  async saveLogInquiryBillByRequest(inquiry: Inquery) {
    const logInquiryBillTransaction = new LogInquiry();
    const parsedDate = new Date(inquiry.trxDateInit);

    logInquiryBillTransaction.company_code = inquiry.partnerServiceId
      .padStart(8, ' ')
      .replace(/\s/g, '');
    logInquiryBillTransaction.customer_number = inquiry.customerNo;
    logInquiryBillTransaction.request_id = inquiry.inquiryRequestId;
    logInquiryBillTransaction.channel_type = inquiry.channelCode;
    logInquiryBillTransaction.additional_data = inquiry.additionalInfo.value;
    logInquiryBillTransaction.transaction_date = format(
      parsedDate,
      'yyyy-MM-dd HH:mm:ss',
    );
    logInquiryBillTransaction.created_by = 'SYS';
    logInquiryBillTransaction.modified_by = 'SYS';
    logInquiryBillTransaction.is_active = '1';
    logInquiryBillTransaction.eksternalId = inquiry.eksternalId;

    try {
      const result = this.repoLogInquiry.saveLogInquiry(
        logInquiryBillTransaction,
      );
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveorUpdateLogInquiryBillByRequest(payment: PaymentBCA) {
    const logInquiryBillTransaction = new LogInquiry();
    const parsedDate = new Date(payment.trxDateTime);

    logInquiryBillTransaction.company_code = payment.partnerServiceId
      .padStart(8, ' ')
      .replace(/\s/g, '');
    logInquiryBillTransaction.customer_number = payment.customerNo;
    logInquiryBillTransaction.request_id = payment.paymentRequestId;
    logInquiryBillTransaction.channel_type = payment.channelCode;
    logInquiryBillTransaction.additional_data = payment.additionalInfo.value;
    logInquiryBillTransaction.transaction_date = format(
      parsedDate,
      'yyyy-MM-dd HH:mm:ss',
    );
    logInquiryBillTransaction.created_by = 'SYS';
    logInquiryBillTransaction.modified_by = 'SYS';
    logInquiryBillTransaction.is_active = '1';
    logInquiryBillTransaction.retry_attempt = 1;
    logInquiryBillTransaction.eksternalId = payment.eksternalId;
    try {
      const result = await this.repoLogInquiry.saveOrUpdateLogInquiry(
        logInquiryBillTransaction,
      );
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveorUpdateLogInquiryBillByRequestBRI(payment: Payment) {
    const logInquiryBillTransaction = new LogInquiry();
    const parsedDate = new Date(payment.trxDateTime);

    logInquiryBillTransaction.company_code = payment.partnerServiceId
      .padStart(8, ' ')
      .replace(/\s/g, '');
    logInquiryBillTransaction.customer_number = payment.customerNo;
    logInquiryBillTransaction.request_id = payment.paymentRequestId;
    logInquiryBillTransaction.channel_type = payment.channelCode;
    logInquiryBillTransaction.additional_data = payment.additionalInfo.value;
    logInquiryBillTransaction.transaction_date = format(
      parsedDate,
      'yyyy-MM-dd HH:mm:ss',
    );
    logInquiryBillTransaction.created_by = 'SYS';
    logInquiryBillTransaction.modified_by = 'SYS';
    logInquiryBillTransaction.is_active = '1';
    logInquiryBillTransaction.retry_attempt = 1;
    logInquiryBillTransaction.eksternalId = payment.ekternalId;
    try {
      const result = await this.repoLogInquiry.saveOrUpdateLogInquiry(
        logInquiryBillTransaction,
      );
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getPendingInquiry() {
    return this.repoLogInquiry.findPendingInquiry();
  }

  async updateLogInquiryBill(logInquiry: LogInquiry) {
    return await this.repoLogInquiry.updatLog(logInquiry);
  }

  async updateUnpaidLog(payment_status: string, request_id: string) {
    return await this.repoLogInquiry.updateLog(payment_status, request_id);
  }

  async updateRetryLog(request_id: string, retry: number) {
    return await this.repoLogInquiry.updateRetryAttemptLog(request_id, retry);
  }

  async updateIsPaymentPaid(request_id: string, status: string) {
    return await this.repoLogInquiry.updateIsPaymentPaid(request_id, status);
  }

  async getRetryLog(request_id: string) {
    return await this.repoLogInquiry.getRetryAttemptLog(request_id);
  }

  async lastInsert() {
    return await this.repoLogInquiry.latestInsert();
  }
}
