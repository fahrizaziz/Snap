import { Body, Controller, Post } from '@nestjs/common';
import { BillPaymentService } from './bill-payment.service';
import { BillPayment } from 'src/dto/bill_payment';
import { Payment } from 'src/dto/payment';

@Controller('bill-payment')
export class BillPaymentController {
  constructor(private readonly billPaymentService: BillPaymentService) {}

  @Post()
  async findByBillPaymentId(@Body() billPayment: BillPayment) {
    return this.billPaymentService.findByBillPaymentId(billPayment);
  }

  // @Post('/save')
  // async saveBillPayment(@Body() payment: Payment) {
  //   return this.billPaymentService.saveBillPayment(payment);
  // }

  @Post('/saveBRI')
  async saveBillBRI(@Body() payment: Payment) {
    return this.billPaymentService.saveBillBRI(payment);
  }

  @Post('/saveBRIRe')
  async saveBillBRIRe(@Body() payment: Payment) {
    return this.billPaymentService.saveBillBRIRe(payment);
  }
}
