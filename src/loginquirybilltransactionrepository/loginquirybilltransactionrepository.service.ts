import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { LogInquiry } from 'src/dto/log-inquiry';
import { format } from 'date-fns';

@Injectable()
export class LoginquirybilltransactionrepositoryService {
  constructor(private connectionService: ConnectionService) {}

  async findUnpaidByInquiryPayment(
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
    // return this.connectionService.query(query);
    const result = await this.connectionService.query(query);
    if (result.length > 0) {
      return true;
    }

    return false;
  }

  async findAmountData(
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
    // return this.connectionService.query(query);
    const result = await this.connectionService.query(query);
  }

  async findByRequestId(logInquiry: LogInquiry) {
    const query = `
    SELECT TOP 1 * FROM t_log_inquiry_bill_transaction t WHERE t.request_id = '${logInquiry.request_id}';
    `;
    try {
      const result = await this.connectionService.query(query);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findByEkternalId(logInquiry: LogInquiry) {
    const query = `
    SELECT TOP 1 * FROM t_log_inquiry_bill_transaction t WHERE t.external_id = '${logInquiry.eksternalId}';
    `;
    console.log(`Query eksternal Id : ${query}`);
    try {
      const result = await this.connectionService.query(query);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findByEkternalIdSame(logInquiry: LogInquiry) {
    const query = `
    SELECT TOP 1 * FROM t_log_inquiry_bill_transaction t WHERE t.external_id = '${logInquiry.eksternalId}';
    `;
    console.log(`Query eksternal Id : ${query}`);
    try {
      const result = await this.connectionService.query(query);
      return result[0];
    } catch (error) {
      console.log(error.message);
    }
  }

  async findPendingInquiry() {
    const query = `
    SELECT * FROM t_log_inquiry_bill_transaction t 
    WHERE t.inquiry_status = '00' AND t.payment_status IS NULL 
    AND t.created_date > CAST(CONVERT(VARCHAR(20), GETDATE()-1, 112) + ' 21:30:00' AS DATETIME) 
    AND t.created_date < CAST((CONVERT(VARCHAR(20), DATEADD(HOUR, -1, GETDATE()), 20)) AS DATETIME)
    `;
    return this.connectionService.query(query);
  }

  async saveLogInquiry(logInquiry: LogInquiry) {
    const createdDate = new Date();
    const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
    const modifiedDate = new Date();
    const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
    const query = `
      INSERT INTO t_log_inquiry_bill_transaction
      (
        customer_number, 
        company_code,
        request_id,
        payment_status,
        inquiry_status,
        channel_type,
        additional_data,
        retry_attempt,
        transaction_date,
        created_by,
        created_date,
        modified_by,
        modified_date,
        is_active,
        external_id
      )
      VALUES 
      (
        '${logInquiry.customer_number}',
        '${logInquiry.company_code}',
        '${logInquiry.request_id}',
        ${logInquiry.payment_status},
         ${logInquiry.inquiry_status},
        '${logInquiry.channel_type}',
        '${logInquiry.additional_data}',
        '${logInquiry.retry_attempt}',
        '${logInquiry.transaction_date}',
        '${logInquiry.created_by}',
        '${formatCreatedDate}',
        '${logInquiry.modified_by}',
        '${formatmodifiedDate}',
        '${logInquiry.is_active}',
        '${logInquiry.eksternalId}'
      )
    `;
    const result = this.connectionService.query(query);
    console.log(query);
    const respons = {
      data: result,
    };
    return respons;
  }

  async saveOrUpdateLogInquiry(logInquiry: LogInquiry) {
    const querySelect = `
      SELECT TOP 1 * FROM t_log_inquiry_bill_transaction
      WHERE request_id = '${logInquiry.request_id}'
    `;
    const resultSelect = await this.connectionService.query(querySelect);
    if (resultSelect.length >= 1) {
      const retryAttempt = resultSelect[0].retry_attempt + 1;
      const queryUpdate = `
          UPDATE t_log_inquiry_bill_transaction set retry_attempt = ${retryAttempt}
          WHERE request_id = '${logInquiry.request_id}'
        `;
      await this.connectionService.query(queryUpdate);
      return resultSelect[0];
    } else {
      const createdDate = new Date();
      const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
      const modifiedDate = new Date();
      const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
      const query = `
        INSERT INTO t_log_inquiry_bill_transaction
        (
          customer_number,
          company_code,
          request_id,
          payment_status,
          inquiry_status,
          channel_type,
          additional_data,
          retry_attempt,
          transaction_date,
          created_by,
          created_date,
          modified_by,
          modified_date,
          is_active,
          external_id
        )
        VALUES
        (
          '${logInquiry.customer_number}',
          '${logInquiry.company_code}',
          '${logInquiry.request_id}',
          ${logInquiry.payment_status},
           ${logInquiry.inquiry_status},
          '${logInquiry.channel_type}',
          '${logInquiry.additional_data}',
          '${logInquiry.retry_attempt}',
          '${logInquiry.transaction_date}',
          '${logInquiry.created_by}',
          '${formatCreatedDate}',
          '${logInquiry.modified_by}',
          '${formatmodifiedDate}',
          '${logInquiry.is_active}',
          '${logInquiry.eksternalId}'
        )
      `;
      const result = await this.connectionService.query(query);
      const respons = {
        data: result,
      };
      return respons;
    }
  }

  async updatLog(logInquiry: LogInquiry) {
    const query = `
     UPDATE t_log_inquiry_bill_transaction set inquiry_status = '${logInquiry.inquiry_status}'
     WHERE request_id = '${logInquiry.request_id}'
      `;
    try {
      return this.connectionService.query(query);
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateLog(payment_status: string, request_id: string) {
    const query = `
     UPDATE t_log_inquiry_bill_transaction set payment_status = '${payment_status}'
     WHERE request_id = '${request_id}'
      `;
    return this.connectionService.query(query);
  }

  async updateRetryAttemptLog(request_id: string, retry: number) {
    const query = `
     UPDATE t_log_inquiry_bill_transaction set retry_attempt = '${retry}'
     WHERE request_id = '${request_id}'
      `;
    return this.connectionService.query(query);
  }

  async updateIsPaymentPaid(request_id: string, status: string) {
    const query = `
     UPDATE t_log_inquiry_bill_transaction set payment_already_paid = '${status}'
     WHERE request_id = '${request_id}'
      `;
    return this.connectionService.query(query);
  }

  async getRetryAttemptLog(request_id: string) {
    const query = `
     SELECT retry_attempt, request_id, payment_already_paid FROM t_log_inquiry_bill_transaction
     WHERE request_id = '${request_id}'
      `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async latestInsert() {
    const query = `
     SELECT TOP 1 * FROM t_log_inquiry_bill_transaction
     order by created_date desc
      `;
    const result = await this.connectionService.query(query);
    return result[0];
  }
}
