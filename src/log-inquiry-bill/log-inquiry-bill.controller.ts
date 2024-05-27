import { Body, Controller, Post } from '@nestjs/common';
import { LogInquiryBillService } from './log-inquiry-bill.service';
import { Inquery } from 'src/dto/inquery';
import { LogInquiry } from 'src/dto/log-inquiry';

@Controller('t-log-bill')
export class LogInquiryBillController {
  constructor(private readonly logInquiryBillService: LogInquiryBillService) {}

  @Post('/save')
  async saveLog(@Body() inquiry: Inquery) {
    return this.logInquiryBillService.saveLogInquiryBillByRequest(inquiry);
  }

  @Post('/cek')
  async cekLog(@Body() logInquiry: LogInquiry) {
    return await this.logInquiryBillService.checkIsExistRequestID(logInquiry);
  }

  // @Post('/unpaid')
  // async getUnpaidLogInquiryBillByInquiry(@Body() logInquiry: LogInquiry) {
  //   return await this.logInquiryBillService.getUnpaidLogInquiryBillByInquiry(
  //     logInquiryBill.company_code,
  //       logInquiryBill.customer_number,
  //       logInquiryBill.request_id,,
  //   );
  // }

  // @Post('/update')
  // async updateLogInquiryBill(@Body() logInquiry: LogInquiry) {
  //   return await this.logInquiryBillService.updateLogInquiryBill(logInquiry);
  // }
}
