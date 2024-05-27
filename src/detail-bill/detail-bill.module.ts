import { Module } from '@nestjs/common';
import { DetailBillService } from './detail-bill.service';
import { DetailBillController } from './detail-bill.controller';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';

@Module({
  controllers: [DetailBillController],
  providers: [DetailBillService, ConnectionService, ...databaseProviders],
})
export class DetailBillModule {}
