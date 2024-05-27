import { Test, TestingModule } from '@nestjs/testing';
import { BankChannelController } from './bank-channel.controller';
import { BankChannelService } from './bank-channel.service';

describe('BankChannelController', () => {
  let controller: BankChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankChannelController],
      providers: [BankChannelService],
    }).compile();

    controller = module.get<BankChannelController>(BankChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
