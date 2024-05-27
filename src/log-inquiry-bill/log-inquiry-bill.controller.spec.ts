import { Test, TestingModule } from '@nestjs/testing';
import { LogInquiryBillController } from './log-inquiry-bill.controller';
import { LogInquiryBillService } from './log-inquiry-bill.service';

describe('LogInquiryBillController', () => {
  let controller: LogInquiryBillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogInquiryBillController],
      providers: [LogInquiryBillService],
    }).compile();

    controller = module.get<LogInquiryBillController>(LogInquiryBillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
