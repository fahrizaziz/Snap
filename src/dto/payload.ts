export class PayloadDto {
  parterServiceId: string;
  customerNo: string;
  virtualAccountNo: string;
  inquiryRequestId: string;
  paymentRequestId?: string;
  additionalInfo?: string;
}
