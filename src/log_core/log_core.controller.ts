import { Body, Controller, Post } from '@nestjs/common';
import { LogCoreService } from './log_core.service';
import { BillPayment } from 'src/dto/bill_payment';

@Controller('log-core')
export class LogCoreController {
  constructor(private readonly logCoreService: LogCoreService) {}

  @Post()
  async findFailedLogCoreTransaction() {
    return this.logCoreService.findFailedLogCoreTransaction();
  }

  @Post('/log')
  async findByBillPaymentId(@Body() billPayment: BillPayment) {
    return this.logCoreService.findByBillPaymentId(billPayment);
  }
}
