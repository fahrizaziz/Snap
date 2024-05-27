import { LogCore } from './log_core';
export class PaymentSettlement {
  payor_name: string;
  collected_by = 'AUTO_SYS';
  location = 'FINAN';
  statement_date: string;
  bank_statement_sequence_number: string;
  remarks: string;
  receive_mode: string;
  collection_bank: string;
  currency: string;
  product_category: string;
  bank_account_number: string;
  payee_bank: string;
  cheque_or_cc_no: string;
  cheque_date: string;
  approval_code: string;
  receive_amount: string;
  proposal_no: string;
  policy_no: string;
  allocation: string;
  allocation_remark: string;
  plan_code: string;
  reference_type: string;
  policy_holder_reference_no: string;
  policy_holder_name: string;
  address_1: string;
  address_2: string;
  address_3: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  fax_no: string;
  branch_code: string;
  services_unit: string;
}

export class PaymentSettlementWrapper {
  data: PaymentSettlement;
}

export class LogCoreT {
  data: LogCore;
}
