import { Controller, Get } from '@nestjs/common';
import { CorePlTransactionService } from './core_pl_transaction.service';

@Controller('core-pl-transaction')
export class CorePlTransactionController {
  constructor(
    private readonly corePlTransactionService: CorePlTransactionService,
  ) {}

  @Get()
  async corePL() {
    await this.corePlTransactionService.batchSendPaymentToPL();
    return 'OK, Processed!';
  }
}
