import { Test, TestingModule } from '@nestjs/testing';
import { VaBriService } from './va-bri.service';

describe('VaBriService', () => {
  let service: VaBriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaBriService],
    }).compile();

    service = module.get<VaBriService>(VaBriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
