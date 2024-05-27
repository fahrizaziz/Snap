import { Test, TestingModule } from '@nestjs/testing';
import { VaBcaController } from './va-bca.controller';
import { VaBcaService } from './va-bca.service';

describe('VaBcaController', () => {
  let controller: VaBcaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaBcaController],
      providers: [VaBcaService],
    }).compile();

    controller = module.get<VaBcaController>(VaBcaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
