import { Controller } from '@nestjs/common';
import { DetailBillService } from './detail-bill.service';

@Controller('detail-bill')
export class DetailBillController {
  constructor(private readonly detailBillService: DetailBillService) {}
}
