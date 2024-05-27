import { Module } from '@nestjs/common';
import { BillPaymentService } from './bill-payment.service';
import { BillPaymentController } from './bill-payment.controller';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';
import { BankService } from 'src/bank/bank.service';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { BillService } from 'src/bill/bill.service';

@Module({
  controllers: [BillPaymentController],
  providers: [
    BillPaymentService,
    BillService,
    BankService,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders,
    ...databaseProviders2,
  ],
})
export class BillPaymentModule {}
