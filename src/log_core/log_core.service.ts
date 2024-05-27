import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { BillPayment } from 'src/dto/bill_payment';
import { LogCore } from 'src/dto/log_core';
import { format } from 'date-fns';

@Injectable()
export class LogCoreService {
  constructor(private connectionService: ConnectionService) {}

  async findFailedLogCoreTransaction() {
    const query = `
        SELECT * FROM t_log_core_transaction
        WHERE core_receive_status IN ('01', '02', '04')
        AND is_active <= 5
    `;

    
    return await this.connectionService.query(query);
  }

  async findByBillPaymentId(billPaymet: BillPayment) {
    const query = `
        SELECT * FROM t_log_core_transaction
        WHERE bill_payment_id = '${billPaymet.bill_payment_id}'
        AND is_active = '1'
    `;
    const result = await this.connectionService.query(query);
    return result.length > 0 ? result[0] : null;
  }

  async saveLogCore(logCore: LogCore) {
    const createdDate = new Date();
    const formatCreatedDate = format(createdDate, 'yyyy-MM-dd HH:mm:ss');
    const modifiedDate = new Date();
    const formatmodifiedDate = format(modifiedDate, 'yyyy-MM-dd HH:mm:ss');
    const eventStart = new Date();
    const formatEventStart = format(eventStart, 'yyyy-MM-dd HH:mm:ss');
    const eventEnd = new Date();
    const formatEventEnd = format(eventEnd, 'yyyy-MM-dd HH:mm:ss');
    const query = `
      INSERT INTO t_log_core_transaction
      (
        request, 
        response,
        retry_attempt,
        event_start,
        event_end,
        request_id,
        core_receive_status,
        customer_number,
        bill_payment_id,
        created_by,
        created_date,
        modified_by,
        exception,
        modified_date,
        is_active
      )
      VALUES 
      (
        '${logCore.request}',
        '${logCore.response}',
        '${logCore.retryAttempt}',
        '${formatEventStart}',
        '${formatEventEnd}',
        '${logCore.requestId}',
        '${logCore.coreReceiveStatus}',
        '${logCore.customerNumber}',
        '${logCore.billPaymentId}',
        '${logCore.created_by}',
        '${formatCreatedDate}',
        '${logCore.modified_by}',
        NULL,
        '${formatmodifiedDate}',
        '${logCore.is_active}'
      )
    `;
    const result = this.connectionService.query(query);
    const respons = {
      data: result,
    };
    return respons;
  }
}
