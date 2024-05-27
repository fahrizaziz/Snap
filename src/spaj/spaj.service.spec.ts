import { Test, TestingModule } from '@nestjs/testing';
import { SpajService } from './spaj.service';

describe('SpajService', () => {
  let service: SpajService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpajService],
    }).compile();

    service = module.get<SpajService>(SpajService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
