import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';

@Module({
  controllers: [BillController],
  providers: [BillService, ConnectionService, ...databaseProviders],
})
export class BillModule {}
