import { Module } from '@nestjs/common';
import { VaBcaService } from './va-bca.service';
import { VaBcaController } from './va-bca.controller';
import { BankService } from 'src/bank/bank.service';
import { BillPaymentService } from 'src/bill-payment/bill-payment.service';
import { BillService } from 'src/bill/bill.service';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { LogInquiryBillService } from 'src/log-inquiry-bill/log-inquiry-bill.service';
import { LogCoreService } from 'src/log_core/log_core.service';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';
import { SpajService } from 'src/spaj/spaj.service';
import { VaBankService } from 'src/va-bank/va-bank.service';
import { DetailBillService } from 'src/detail-bill/detail-bill.service';
import { BankChannelService } from 'src/bank-channel/bank-channel.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LoggerService } from 'src/logger/logger.service';
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
  controllers: [VaBcaController],
  providers: [
    VaBcaService,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders,
    ...databaseProviders2,
    SpajService,
    VaBankService,
    LogInquiryBillService,
    LoginquirybilltransactionrepositoryService,
    BankService,
    BillPaymentService,
    LogCoreService,
    BillService,
    DetailBillService,
    BankChannelService,
    JwtStrategy,
    LoggerService,
    HealthCheckServer,
    DBHealthIndicator,
  ],
})
export class VaBcaModule {}
