import { Test, TestingModule } from '@nestjs/testing';
import { BankChannelService } from './bank-channel.service';

describe('BankChannelService', () => {
  let service: BankChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankChannelService],
    }).compile();

    service = module.get<BankChannelService>(BankChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
