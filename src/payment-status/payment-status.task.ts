import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaymentStatusService } from './payment-status.service';
import { Timestamp } from 'typeorm';
import axios from 'axios';
import { CorePlTransactionService } from 'src/core_pl_transaction/core_pl_transaction.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class PaymentStatusTask {
  constructor(
    private readonly paymentStatusService: PaymentStatusService,
    private readonly corePlTransactionService: CorePlTransactionService,
    private readonly logger: LoggerService,
  ) {}
  async schedulerPaymentToPL() {
    try {
      await this.corePlTransactionService.batchSendPaymentToPL();
    } catch (error) {
      console.log(error);
    }
  }

  @Cron('00 13 * * *', { name: 'PAYMENT-STATUS-1' })
  async runTask1() {
    this.logger.log(
      '====================== Start Running Batch Scheduler Submit Core ======================',
    );
    this.logger.log('Batch I  At : ', new Date());
    await this.schedulerPaymentToPL();
    this.logger.log('Batch I End  At : ', new Date());
    this.logger.log(
      `===================== End Running Batch Scheduler Submit Core ====================\n\n\n`,
    );
  }

  @Cron('30 21 * * *', { name: 'PAYMENT-STATUS-2' })
  async runTask2() {
    this.logger.log(
      '====================== Start Running Batch II Scheduler Submit Core ======================',
    );
    this.logger.log('Batch II  At : ', new Date());
    await this.schedulerPaymentToPL();
    this.logger.log('Batch II End  At : ', new Date());
    this.logger.log(
      `===================== End Running Batch II Scheduler Submit Core ====================\n\n\n`,
    );
  }
}
