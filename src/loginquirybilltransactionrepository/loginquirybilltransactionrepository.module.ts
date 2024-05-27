import { Module } from '@nestjs/common';
import { LoginquirybilltransactionrepositoryService } from './loginquirybilltransactionrepository.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  providers: [
    LoginquirybilltransactionrepositoryService,
    ConnectionService,
    ...databaseProviders,
  ],
})
export class LoginquirybilltransactionrepositoryModule {}
