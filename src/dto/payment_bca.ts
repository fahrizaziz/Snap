// import { MaxLength } from "class-validator";

export class PaidAmount {
  value: string;
  currency: string;
}

export class PaymentBCA {
  partnerServiceId: string;
  eksternalId?: string;
  customerNo: string;
  virtualAccountNo: string;
  virtualAccountName: string;
  virtualAccountEmail?: string;
  virtualAccountPhone?: string;
  trxId: string;
  paymentRequestId: string;
  channelCode?: string;
  hashedSourceAccountNo: string;
  sourceBankCode: string;
  paidAmount: PaidAmount;
  cumulativePaymentAmount?: number;
  paidBills?: string;
  totalAmount?: PaidAmount;
  trxDateTime: string;

  // @MaxLength(16)
  referenceNo?: string;


  journalNum?: string;
  paymentType?: string;
  flagAdvise?: string;
  subCompany?: string;
  billDetails: any[];
  freeTexts: any[];
  additionalInfo: any;
}
