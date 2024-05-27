import { Module } from '@nestjs/common';
import { LogCoreService } from './log_core.service';
import { LogCoreController } from './log_core.controller';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  controllers: [LogCoreController],
  providers: [LogCoreService, ConnectionService, ...databaseProviders],
})
export class LogCoreModule {}
