import { Test, TestingModule } from '@nestjs/testing';
import { VaBriController } from './va-bri.controller';
import { VaBriService } from './va-bri.service';

describe('VaBriController', () => {
  let controller: VaBriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaBriController],
      providers: [VaBriService],
    }).compile();

    controller = module.get<VaBriController>(VaBriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
