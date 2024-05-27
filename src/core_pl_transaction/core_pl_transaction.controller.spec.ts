import { Test, TestingModule } from '@nestjs/testing';
import { CorePlTransactionController } from './core_pl_transaction.controller';
import { CorePlTransactionService } from './core_pl_transaction.service';

describe('CorePlTransactionController', () => {
  let controller: CorePlTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorePlTransactionController],
      providers: [CorePlTransactionService],
    }).compile();

    controller = module.get<CorePlTransactionController>(CorePlTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
