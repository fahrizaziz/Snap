import { Test, TestingModule } from '@nestjs/testing';
import { DetailBillService } from './detail-bill.service';

describe('DetailBillService', () => {
  let service: DetailBillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailBillService],
    }).compile();

    service = module.get<DetailBillService>(DetailBillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
