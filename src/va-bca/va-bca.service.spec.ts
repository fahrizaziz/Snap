import { Test, TestingModule } from '@nestjs/testing';
import { VaBcaService } from './va-bca.service';

describe('VaBcaService', () => {
  let service: VaBcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaBcaService],
    }).compile();

    service = module.get<VaBcaService>(VaBcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
