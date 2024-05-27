import { Test, TestingModule } from '@nestjs/testing';
import { LogInquiryBillService } from './log-inquiry-bill.service';

describe('LogInquiryBillService', () => {
  let service: LogInquiryBillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogInquiryBillService],
    }).compile();

    service = module.get<LogInquiryBillService>(LogInquiryBillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
