import { Test, TestingModule } from '@nestjs/testing';
import { LogCoreService } from './log_core.service';

describe('LogCoreService', () => {
  let service: LogCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogCoreService],
    }).compile();

    service = module.get<LogCoreService>(LogCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
