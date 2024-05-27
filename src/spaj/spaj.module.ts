import { Module } from '@nestjs/common';
import { SpajService } from './spaj.service';
import { SpajController } from './spaj.controller';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';

@Module({
  controllers: [SpajController],
  providers: [SpajService, ConnectionService, ...databaseProviders],
})
export class SpajModule {}
