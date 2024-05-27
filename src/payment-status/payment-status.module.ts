import { Module } from '@nestjs/common';
import { PaymentStatusService } from './payment-status.service';
import { PaymentStatusController } from './payment-status.controller';
import { PaymentStatusTask } from './payment-status.task';
import { AuthModule } from 'src/auth/auth.module';
import { CorePlTransactionModule } from 'src/core_pl_transaction/core_pl_transaction.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [AuthModule, CorePlTransactionModule],
  providers: [PaymentStatusService, PaymentStatusTask, LoggerService],
  controllers: [PaymentStatusController],
})
export class PaymentStatusModule {}
