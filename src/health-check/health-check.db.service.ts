/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { ConnectionService } from 'src/connection/connection.service';

@Injectable()
export class DBHealthIndicator extends HealthIndicator {
    constructor(
        private connectionService: ConnectionService,
        private connectionDbLinkService: ConnectionDbLinkService,
    ) {
        super();
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            const query = 'SELECT TOP 1 * FROM m_oauth_key';
            const result = await this.connectionService.query(query);
            if (result.length !== 0) {
                return this.getStatus('db', true);
              } else {
                throw new Error('Down')
              }
           
        } catch (error) {
            return this.getStatus('db', false, { message: error.message });
        }
    }

    async isHealthyDBLink(): Promise<HealthIndicatorResult> {
        try {
            const query = 'SELECT TOP 1 * FROM PAYMENT.view_account_received_bank_individu';
            const result = await this.connectionDbLinkService.queryDbLink(query);
            if (result.length !== 0) {
                return this.getStatus('db Link', true);
              } else {
                throw new Error('Down')
              }
           
        } catch (error) {
            return this.getStatus('db Link', false, { message: error.message });
        }
    }
}