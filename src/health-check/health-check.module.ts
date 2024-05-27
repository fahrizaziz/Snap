import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckServer } from './health-check-server.service';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { DBHealthIndicator } from './health-check.db.service';
import { databaseProviders2 } from 'src/db/databaseProviders2';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthCheckController],
  providers: [
    HealthCheckServer,
    ConnectionService,
    ConnectionDbLinkService,
    ...databaseProviders2,
    ...databaseProviders,
    DBHealthIndicator,
  ],
})
export class HealthCheckModule {}
