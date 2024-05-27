import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(SchedulerRegistry) private scheduleRegistry: SchedulerRegistry,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/getCron')
  async getCron() {
    const allJobs = this.scheduleRegistry.getCronJobs();
    const allCrons = [];

    allJobs.forEach((job, key) => {
      const nextExecutions = job.nextDates();
      const nextExecutionTime = nextExecutions.toString();

      allCrons.push({
        key,
        status: job.running,
        nextExecutionTime: nextExecutionTime,
      });
    });

    return allCrons;
  }

  // @Get('secret')
  // generateSecret() {
  //   const secretLength = 32; // or any desired length
  //   return crypto.randomBytes(secretLength).toString('base64');
  // }
}
