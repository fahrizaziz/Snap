import { Test, TestingModule } from '@nestjs/testing';
import { VaBankController } from './va-bank.controller';
import { VaBankService } from './va-bank.service';

describe('VaBankController', () => {
  let controller: VaBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaBankController],
      providers: [VaBankService],
    }).compile();

    controller = module.get<VaBankController>(VaBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
