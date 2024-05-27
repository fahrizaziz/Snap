import { Test, TestingModule } from '@nestjs/testing';
import { VaBankService } from './va-bank.service';

describe('VaBankService', () => {
  let service: VaBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaBankService],
    }).compile();

    service = module.get<VaBankService>(VaBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
