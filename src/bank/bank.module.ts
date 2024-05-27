import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';

@Module({
  controllers: [BankController],
  providers: [
    BankService,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders,
    ...databaseProviders2,
  ],
})
export class BankModule {}
