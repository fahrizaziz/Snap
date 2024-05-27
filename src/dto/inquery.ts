/* eslint-disable prettier/prettier */
export interface AdditionInfo {
    value?: string;
    idApp?: string;
}

export interface Amount {
  value?: string;
  currency?: string;
}

export interface Inquery {
  partnerServiceId: string;
  customerNo: string;
  virtualAccountNo: string;
  trxDateInit: string;
  channelCode: string;
  language?: string;
  amount?: Amount;
  hashedSourceAccountNo?: string;
  sourceBankCode: string;
  additionalInfo: AdditionInfo;
  passApp?: string;
  inquiryRequestId: string;
  eksternalId?: string;
}
