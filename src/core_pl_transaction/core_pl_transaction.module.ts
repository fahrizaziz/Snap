import { Module } from '@nestjs/common';
import { CorePlTransactionService } from './core_pl_transaction.service';
import { CorePlTransactionController } from './core_pl_transaction.controller';
import { BankService } from 'src/bank/bank.service';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { LogCoreService } from 'src/log_core/log_core.service';
import { StringUtilsService } from 'src/string_util/string_utils';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [
    LogCoreService,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders,
    ...databaseProviders2,
    CorePlTransactionService,
    BankService,
    StringUtilsService,
    LoggerService,
  ],
  controllers: [CorePlTransactionController],
  exports: [CorePlTransactionService],
})
export class CorePlTransactionModule {}
