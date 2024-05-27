import { Test, TestingModule } from '@nestjs/testing';
import { SpajController } from './spaj.controller';
import { SpajService } from './spaj.service';

describe('SpajController', () => {
  let controller: SpajController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpajController],
      providers: [SpajService],
    }).compile();

    controller = module.get<SpajController>(SpajController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
