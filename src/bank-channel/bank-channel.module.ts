import { Module } from '@nestjs/common';
import { BankChannelService } from './bank-channel.service';
import { BankChannelController } from './bank-channel.controller';
import { databaseProviders } from 'src/db/databaseProviders';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  controllers: [BankChannelController],
  providers: [BankChannelService, ConnectionService, ...databaseProviders],
})
export class BankChannelModule {}
