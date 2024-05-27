import { Test, TestingModule } from '@nestjs/testing';
import { CorePlTransactionService } from './core_pl_transaction.service';

describe('CorePlTransactionService', () => {
  let service: CorePlTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorePlTransactionService],
    }).compile();

    service = module.get<CorePlTransactionService>(CorePlTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
