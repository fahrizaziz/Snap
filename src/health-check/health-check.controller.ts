import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckServer } from './health-check-server.service';
import { DBHealthIndicator } from './health-check.db.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly connection: HealthCheckService,
    private readonly plHealthIndicator: HealthCheckServer,
    private readonly dbHealthIndicator: DBHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const originalUrl = process.env.PL_PATH;
    const modifiedUrl = originalUrl.replace(
      'api/proposal/premiumcollection',
      '',
    );
    return this.connection.check([
      async () => await this.dbHealthIndicator.isHealthy(),
      async () => await this.dbHealthIndicator.isHealthyDBLink(),
      async () =>
        await this.plHealthIndicator.isHealthy(
          process.env.PL_URL + modifiedUrl,
        ),
    ]);
  }
}
