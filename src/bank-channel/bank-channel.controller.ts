import { Controller } from '@nestjs/common';
import { BankChannelService } from './bank-channel.service';

@Controller('bank-channel')
export class BankChannelController {
  constructor(private readonly bankChannelService: BankChannelService) {}
}
