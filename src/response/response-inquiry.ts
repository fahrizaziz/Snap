/* eslint-disable prettier/prettier */
export class InquiryReason {
    english: string;
    indonesia: string;
    constructor(engslish: string, indonesia: string) {
        this.english = engslish;
        this.indonesia = indonesia;
    }
}

export class BillDescription {
    english: string;
    indonesia: string;
}

export class TotalAmount {
    value: string;
    currency: string;
}

export class BillDetails {
    billCode: string;
    billNo: string;
    billName: string;
    billShortName: string;
    billDescription: BillDescription;
    billSubCompany: string;
    billAmount: BillAmount;
    billAmountLabel: string;
    billAmountValue: string;
    additionalInfo: NonNullable<unknown>;
}

export class BillAmount {
    value: string;
    currency: string;
}

export class FreeTexts {
    english: string;
    indonesia: string;
}

export class FeeAmount {
    value: string;
    currency: string;
}

export class AdditionalInfo {
    idApp?: string;
    info1?: string;
    deviceId?: string;
    channel?: string;
}

export class VirtualAccountData {
    inquiryStatus?: string;
    inquiryReason?: InquiryReason;
    partnerServiceId?: string;
    customerNo?: string;
    virtualAccountNo?: string;
    virtualAccountName?: string;
    virtualAccountEmail?: string;
    virtualAccountPhone?: string;
    inquiryRequestId?: string;
    totalAmount?: TotalAmount;
    subCompany?: string;
    billDetails?: BillDetails[];
    freeTexts?: FreeTexts[];
    virtualAccountTrxType?: string;
    feeAmount?: FeeAmount;
    additionalInfo?: AdditionalInfo;
}

export class ResponseInquirySuccess {
  responseCode: string;
  responseMessage: string;
  virtualAccountData?: VirtualAccountData;
}
