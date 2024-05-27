import { Test, TestingModule } from '@nestjs/testing';
import { DetailBillController } from './detail-bill.controller';
import { DetailBillService } from './detail-bill.service';

describe('DetailBillController', () => {
  let controller: DetailBillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailBillController],
      providers: [DetailBillService],
    }).compile();

    controller = module.get<DetailBillController>(DetailBillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
