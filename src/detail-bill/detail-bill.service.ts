import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { DetailBill } from 'src/dto/detail_bill';

@Injectable()
export class DetailBillService {
  constructor(private connectionService: ConnectionService) {}

  async availableBillData(detailBill: DetailBill) {
    const query = `
    SELECT * FROM v_detail_bill_status 
    WHERE request_id = '${detailBill.request_id}'
            AND customer_no = '${detailBill.customer_no}'
            AND bill_status_code = 'STAT000001'
            AND bank_va_code = '${detailBill.bank_va_code.replace(/\s/g, '')}'
    ORDER BY due_date ASC
    `;
    return await this.connectionService.query(query);
  }

  async detailBank(detailBill: DetailBill) {
    const query = `
      SELECT * FROM v_detail_bank
      WHERE bank_va_code = '${detailBill.bank_va_code.replace(/\s/g, '')}'
      AND is_active = 1
    `;

    const result = await this.connectionService.query(query);
    return result[0];
  }
}
