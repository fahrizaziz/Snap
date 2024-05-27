import { Test, TestingModule } from '@nestjs/testing';
import { LogCoreController } from './log_core.controller';
import { LogCoreService } from './log_core.service';

describe('LogCoreController', () => {
  let controller: LogCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogCoreController],
      providers: [LogCoreService],
    }).compile();

    controller = module.get<LogCoreController>(LogCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
