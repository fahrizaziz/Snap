import { Module } from '@nestjs/common';
import { VaBankService } from './va-bank.service';
import { VaBankController } from './va-bank.controller';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  controllers: [VaBankController],
  providers: [VaBankService, ConnectionService, ...databaseProviders],
})
export class VaBankModule {}
