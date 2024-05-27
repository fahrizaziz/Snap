import { Body, Controller, Post } from '@nestjs/common';
import { SpajService } from './spaj.service';
import { SPAJ } from 'src/dto/spaj';

@Controller('spaj')
export class SpajController {
  constructor(private readonly spajService: SpajService) {}

  @Post()
  async getSpajNo(@Body() spaj: SPAJ) {
    return await this.spajService.spajNo(spaj);
  }
}
