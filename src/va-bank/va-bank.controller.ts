import { Body, Controller, Post } from '@nestjs/common';
import { VaBankService } from './va-bank.service';
import { BankVa } from 'src/dto/va-bank';

@Controller('va-bank')
export class VaBankController {
  constructor(private readonly vaBankService: VaBankService) {}

  @Post()
  async getBankVa(@Body() vaBank: BankVa) {
    return this.vaBankService.getBankVa(vaBank);
  }

  @Post('/prod')
  async getBankVaProd(@Body() vaBank: BankVa) {
    return this.vaBankService.getBankVaProd(vaBank);
  }

  @Post('/re')
  async getBankVaRe(@Body() vaBank: BankVa) {
    return this.vaBankService.getBankVaRe(vaBank);
  }
}
