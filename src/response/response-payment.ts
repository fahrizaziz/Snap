/* eslint-disable prettier/prettier */
export class AdditionalInfo {
    idApp?: string;
    passApp?: string;
    info1?: string;
}

export class FreeTexts {
    english: string;
    indonesia: string;
}

export class Reason {
    english: string;
    indonesia: string;
}

export class BillAmount {
    value: string;
    currency: string;
}

export class BillDescription {
    english: string;
    indonesia: string;
}

export class BillDetails {
    billerReferenceId?: string;
    billCode?: string;
    billNo?: string;
    billName?: string;
    billShortName?: string;
    billDescription?: BillDescription;
    billSubCompany?: string;
    billAmount?: BillAmount;
    additionalInfo?: NonNullable<unknown>;
    status?: string;
    reason?: Reason;
} 

export class TotalAmount {
    value: string;
    currency: string;
}

export class PaidAmount {
    value: string;
    currency: string;
}

export class PaymentFlagReason {
    english: string;
    indonesia: string;
}

export class VirtualAccountData {
    paymentFlagReason?: PaymentFlagReason;
    partnerServiceId?: string;
    customerNo?: string;
    virtualAccountNo?: string;
    virtualAccountName?: string;
    virtualAccountEmail?: string;
    virtualAccountPhone?: string;
    trxId?: string;
    paymentRequestId?: string;
    paidAmount?: PaidAmount;
    paidBills?: string;
    totalAmount?: TotalAmount;
    subCompany?: string;
    trxDateTime?: string;
    referenceNo?: string;
    journalNum?: string;
    paymentType?: string;
    flagAdvise?: string;
    paymentFlagStatus?: string;
    feeAmount?: any;
    virtualAccountTrxType?: string;
    billDetails?: BillDetails[];
    freeTexts?: FreeTexts[];
    additionalInfo?: AdditionalInfo;
}

export class ResponsePayment {
  responseCode: string;
  responseMessage: string;
  virtualAccountData?: VirtualAccountData;
  additionalInfo?: any;
}
