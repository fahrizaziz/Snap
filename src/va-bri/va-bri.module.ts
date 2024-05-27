import { Module } from '@nestjs/common';
import { VaBriService } from './va-bri.service';
import { VaBriController } from './va-bri.controller';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { VaBankService } from 'src/va-bank/va-bank.service';
import { BillService } from 'src/bill/bill.service';
import { SpajService } from 'src/spaj/spaj.service';
import { BillPaymentService } from 'src/bill-payment/bill-payment.service';
import { BankService } from 'src/bank/bank.service';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { BankChannelService } from 'src/bank-channel/bank-channel.service';
import { LogCoreService } from 'src/log_core/log_core.service';
import { PaymentSettlementWrapper } from 'src/dto/payment_settlement_wrapper';
import { BillPayment } from 'src/dto/bill_payment';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';
import { LogInquiryBillService } from 'src/log-inquiry-bill/log-inquiry-bill.service';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckServer } from 'src/health-check/health-check-server.service';
import { DBHealthIndicator } from 'src/health-check/health-check.db.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '900s',
        },
      }),
    }),
    TerminusModule,
    HttpModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [VaBriController],
  providers: [
    VaBriService,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders,
    ...databaseProviders2,
    VaBankService,
    BillService,
    SpajService,
    BillPaymentService,
    BankService,
    BankChannelService,
    LogCoreService,
    PaymentSettlementWrapper,
    LogInquiryBillService,
    LoginquirybilltransactionrepositoryService,
    BillPayment,
    JwtStrategy,
    LoggerService,
    HealthCheckServer,
    DBHealthIndicator,
  ],
})
export class VaBriModule {}
