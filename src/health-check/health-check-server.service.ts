/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthCheckServer extends HealthIndicator {
  private readonly http: HttpHealthIndicator;

  constructor(http: HttpHealthIndicator) {
    super();
    this.http = http;
  }

  async isHealthy(url: string): Promise<HealthIndicatorResult> {
    try {
      await this.http.pingCheck('PL', `${url}`);
      return this.getStatus('PL', true);
    } catch (error) {
      return this.getStatus('PL', false, { message: error.message });
    }
  }
}
