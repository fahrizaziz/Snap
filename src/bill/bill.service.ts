import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { ConnectionService } from 'src/connection/connection.service';
import { Bill } from 'src/dto/bill';

@Injectable()
export class BillService {
  constructor(private connectionService: ConnectionService) {}
  async findDueDate(bill: Bill) {
    const query = `
            SELECT top 1 due_date FROM t_bill
            WHERE customer_no = '${bill.customer_number}'
            AND due_date > (SELECT CONVERT(char(10), GetDate(),126))
            ORDER BY due_date ASC
        `;

    const result = await this.connectionService.query(query);

    return result[0];
  }
  async findDueDateBRI(bill: Bill) {
    const query = `
            SELECT top 1 due_date FROM t_bill
            WHERE REPLACE(policy_no, '.', '') = '${bill.customer_number}'
            AND due_date > (SELECT CONVERT(char(10), GetDate(),126))
            ORDER BY due_date ASC
        `;
    const result = await this.connectionService.query(query);

    return result[0];
  }
  async currentDate() {
    const query = `
        SELECT CONVERT(char(10), GetDate(), 126) AS due_date
    `;

    const result = await this.connectionService.query(query);
    return result[0];
  }
  async billDetail(bill: Bill) {
    const query = `
        SELECT * FROM v_detail_bill_status 
        WHERE due_date <= '${bill.due_date}' 
        AND bill_status_code = 'STAT000001' 
        AND customer_no = '${bill.customer_number}' 
        AND product_category IN ${bill.product_category}
        ORDER BY due_date ASC
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }
  async billAlready(bill: Bill) {
    // const query = `
    //     SELECT * FROM v_detail_bill_status
    //     WHERE due_date <= '${bill.due_date}'
    //     AND bill_status_code = 'STAT000003'
    //     AND customer_no = '${bill.customer_number}'
    //     AND product_category IN ${bill.product_category}
    //     ORDER BY due_date ASC
    // `;
    const query = `
      SELECT * FROM t_bill
      where bill_status_code = 'STAT000002'
      and customer_no = '${bill.customer_number}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async billBRIAlready(bill: Bill) {
    // const query = `
    //   SELECT * FROM t_bill
    //   where bill_status_code = 'STAT000002'
    //   and customer_no = '${bill.customer_number}'
    // `;
    const query = `
    select * from t_bill where bill_status_code = 'STAT000002' and customer_no LIKE '%${bill.customer_number}%'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async billBRIAlready2(bill: Bill) {
    // const query = `
    //   SELECT * FROM t_bill
    //   where bill_status_code = 'STAT000002'
    //   and customer_no = '${bill.customer_number}'
    // `;
    const query = `
    select * from t_bill where bill_status_code = 'STAT000003' and customer_no LIKE '%${bill.customer_number}%'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async billAlready2(bill: Bill) {
    // const query = `
    //     SELECT * FROM v_detail_bill_status
    //     WHERE due_date <= '${bill.due_date}'
    //     AND bill_status_code = 'STAT000002'
    //     AND customer_no = '${bill.customer_number}'
    //     AND product_category IN ${bill.product_category}
    //     ORDER BY due_date ASC
    // `;
    const query = `
      SELECT * FROM t_bill
      where bill_status_code = 'STAT000003'
      and customer_no = '${bill.customer_number}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async billAlready3(bill: Bill) {
    // const query = `
    //     SELECT * FROM v_detail_bill_status
    //     WHERE due_date <= '${bill.due_date}'
    //     AND bill_status_code = 'STAT000002'
    //     AND customer_no = '${bill.customer_number}'
    //     AND product_category IN ${bill.product_category}
    //     ORDER BY due_date ASC
    // `;
    const query = `
      SELECT * FROM t_bill_payment
      where status = '03'
      and customer_number = '${bill.customer_number}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }
  async updateRequestID(bill: Bill) {
    const query = `
        UPDATE t_bill SET request_id = '${bill.request_id}', modified_date = GETDATE() WHERE bill_code = '${bill.bill_code}'
    `;
    return await this.connectionService.query(query);
  }

  async totalOutStanding(bill: Bill) {
    const parsedDate = new Date(bill.due_date);
    const parsedDue = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
    const query = `
        SELECT customer_no,SUM(nominal) AS total_outstanding FROM t_bill 
        WHERE customer_no = '${bill.customer_number}' 
        AND bill_status_code = 'STAT000001' 
        AND due_date <= '${parsedDue}'
        GROUP BY customer_no;
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async totalOutStandingBRI(bill: Bill) {
    const parsedDate = new Date(bill.due_date);
    const parsedDue = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
    // const query = `
    //     SELECT customer_no,nominal AS total_outstanding FROM t_bill
    //     WHERE REPLACE(policy_no, '.', '') = '${bill.customer_number}'
    //     AND bill_status_code = 'STAT000001'
    //     AND due_date <= '${parsedDue}'
    //     GROUP BY customer_no;
    // `;
    const query = `
    SELECT customer_no,nominal AS total_outstanding FROM t_bill 
        WHERE REPLACE(policy_no, '.', '') = '${bill.customer_number}' 
        AND bill_status_code = 'STAT000001' 
        AND due_date <= '${parsedDue}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async getBill(bill: Bill) {
    const query = `
      SELECT TOP 1 * FROM t_bill 
      WHERE bill_status_code = 'STAT000001'
      AND REPLACE(policy_no, '.', '') = '${bill.policy_no}'
      ORDER by due_date ASC
    `;
    //
    return await this.connectionService.query(query);
  }

  async getProductCategory(polisNo: string) {
    try {
      const query = `
        SELECT TOP 1 * FROM t_bill WHERE REPLACE(policy_no, '.', '') = '${polisNo}'
      `;
      const result = await this.connectionService.query(query);
      return result[0];
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateStatusBill(bill: Bill) {
    const query = `
    WITH CTE AS (
      SELECT TOP 1 * FROM t_bill
      WHERE bill_status_code = 'STAT000001'
      AND REPLACE(policy_no, '.', '') = '${bill.policy_no}'
      ORDER BY due_date ASC
    )
    UPDATE CTE
    SET bill_status_code = 'STAT000002',
        modified_date = CURRENT_TIMESTAMP
    `;

    await this.connectionService.query(query);
  }

  async updateStatusSettled(bill: Bill) {
    const query = `
      WITH CTE AS(
        SELECT TOP 1 * FROM t_bill 
        where bill_status_code='STAT000002' 
        AND REPLACE(policy_no, '.', '')= '${bill.policy_no}'
        ) UPDATE CTE 
        SET bill_status_code='STAT000003', 
        modified_date=CURRENT_TIMESTAMP
    `;

    return await this.connectionService.query(query);
  }

  async getDetailBillById(bill: string) {
    const query = `
      SELECT * FROM t_bill WHERE bill_code = '${bill}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async getPolisNo(bill: Bill) {
    const query = `
      SELECT * FROM t_bill WHERE request_id = '${bill.request_id}'
    `;

    return await this.connectionService.query(query);
  }

  async findBillPaymentByRequestID(bill: Bill) {
    const query = `
      SELECT TOP 1 customer_name AS policyHolder, policy_no AS policyNo 
      FROM v_detail_bill_policy 
      WHERE request_id = '${bill.request_id}'
    `;

    return await this.connectionService.query(query);
  }

  async getSettle(bill: Bill) {
    const query = `
      SELECT TOP 1 * FROM t_bill 
      WHERE bill_status_code = 'STAT000003' 
      AND REPLACE(policy_no, '.', '')= '${bill.policy_no}' 
      ORDER by due_date ASC
    `;
    return await this.connectionService.query(query);
  }
  async updateStatus(bill_code: string) {
    const query = `
      UPDATE t_bill SET bill_status_code = 'STAT000002'
      WHERE bill_code = '${bill_code}'
    `;
    return await this.connectionService.query(query);
  }

  async lastInsert() {
    const query = `
      SELECT bill_payment_id as lastInsertId from t_bill_payment order by bill_payment_id desc
    `;
    return await this.connectionService.query(query);
  }
}
