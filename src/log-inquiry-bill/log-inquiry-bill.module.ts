import { Module } from '@nestjs/common';
import { LogInquiryBillService } from './log-inquiry-bill.service';
import { LogInquiryBillController } from './log-inquiry-bill.controller';
import { LoginquirybilltransactionrepositoryModule } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.module';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  imports: [LoginquirybilltransactionrepositoryModule],
  controllers: [LogInquiryBillController],
  providers: [
    LogInquiryBillService,
    LoginquirybilltransactionrepositoryService,
    ConnectionService,
    ...databaseProviders,
  ],
})
export class LogInquiryBillModule {}
