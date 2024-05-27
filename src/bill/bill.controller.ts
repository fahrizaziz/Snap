import { Body, Controller, Post } from '@nestjs/common';
import { BillService } from './bill.service';
import { Bill } from 'src/dto/bill';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async findByBillPaymentId(@Body() bill: Bill) {
    return this.billService.updateStatusBill(bill);
  }
}
