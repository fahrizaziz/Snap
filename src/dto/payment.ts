/* eslint-disable prettier/prettier */
export class PaidAmount {
  value: string;
  currency: string;
}

export class BillDetails {
    billCode: string;
    billNo: string;
    billName: string;
    billShortName: string;
    billDescription : BillDescription;
    billSubCompany : string;
    billAmount : PaidAmount;
    additionalInfo : AdditionalInfo;
    billReferenceNo : string; 
}

export class BillDescription {
    english: string;
    indonesia: string;
}

export class AdditionalInfo {
    value?: string;
    idApp?: string;
    passApp?: string;
}

export class Payment {
  partnerServiceId: string;
  ekternalId: string;
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
  referenceNo?: string;
  journalNum?: string;
  paymentType?: string;
  flagAdvise?: string;
  subCompany?: string;
  billDetails?: BillDetails[];
  freeTexts?: string[];
  additionalInfo: AdditionalInfo;
}
