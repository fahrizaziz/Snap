import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/env';
import config2 from 'src/config/env2';
import { SpajModule } from './spaj/spaj.module';
import { VaBankModule } from './va-bank/va-bank.module';
import { LoginquirybilltransactionrepositoryModule } from './loginquirybilltransactionrepository/loginquirybilltransactionrepository.module';
import { BankModule } from './bank/bank.module';
import { BillPaymentModule } from './bill-payment/bill-payment.module';
import { ConnectionDbLinkService } from './connection-db-link/connection-db-link.service';
import { ConnectionService } from './connection/connection.service';
import { databaseProviders } from './db/databaseProviders';
import { databaseProviders2 } from './db/databaseProviders2';
import { LogInquiryBillModule } from './log-inquiry-bill/log-inquiry-bill.module';
import { LogCoreModule } from './log_core/log_core.module';
import { VaBcaModule } from './va-bca/va-bca.module';
import { VaBriModule } from './va-bri/va-bri.module';
import { AuthModule } from './auth/auth.module';
import { BillModule } from './bill/bill.module';
import { BankChannelModule } from './bank-channel/bank-channel.module';
import { DetailBillModule } from './detail-bill/detail-bill.module';
import { PaymentSettlementWrapper } from './dto/payment_settlement_wrapper';
import { BillPayment } from './dto/bill_payment';
import { PaymentStatusModule } from './payment-status/payment-status.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CorePlTransactionModule } from './core_pl_transaction/core_pl_transaction.module';
import { LoggerService } from './logger/logger.service';
import { HealthCheckModule } from './health-check/health-check.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config, config2], isGlobal: true }),
    SpajModule,
    VaBankModule,
    LoginquirybilltransactionrepositoryModule,
    LogInquiryBillModule,
    BankModule,
    BillPaymentModule,
    LogCoreModule,
    BillModule,
    VaBriModule,
    BankChannelModule,
    VaBcaModule,
    DetailBillModule,
    AuthModule,
    PaymentStatusModule,
    ScheduleModule.forRoot(),
    CorePlTransactionModule,
    HealthCheckModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConnectionService,
    ...databaseProviders,
    ...databaseProviders2,
    ConnectionDbLinkService,
    PaymentSettlementWrapper,
    BillPayment,
    LoggerService,
  ],
})
export class AppModule {}
