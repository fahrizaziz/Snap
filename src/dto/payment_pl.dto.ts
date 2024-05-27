// export class DataPaymentPLDto {
//   data: PaymentPLDto;
// }

// export class PaymentPLDto {
//   data: {
//     payor_name: string;
//     collected_by: string;
//     location: string;
//     statement_date: string;
//     bank_statement_sequence_number: string;
//     remarks: string;
//     receive_mode: string;
//     collection_bank: string;
//     currency: string;
//     product_category: string;
//     bank_account_number: string;
//     payee_bank: string;
//     cheque_or_cc_no: string;
//     cheque_date: string;
//     approval_code: string;
//     receive_amount: string;
//     proposal_no: string;
//     policy_no: string;
//     allocation: string;
//     allocation_remark: string;
//     plan_code: string;
//     reference_type: string;
//     policy_holder_reference_no: string;
//     policy_holder_name: string;
//     address_1: string;
//     address_2: string;
//     address_3: string;
//     city: string;
//     postcode: string;
//     state: string;
//     country: string;
//     fax_no: string;
//     branch_code: string;
//     services_unit: string;
//   };

//   constructor() {
//     // Initialize the data object
//     this.data = {
//       payor_name: '',
//       collected_by: '',
//       location: '',
//       statement_date: '',
//       bank_statement_sequence_number: '',
//       remarks: '',
//       receive_mode: '',
//       collection_bank: '',
//       currency: '',
//       product_category: '',
//       bank_account_number: '',
//       payee_bank: '',
//       cheque_or_cc_no: '',
//       cheque_date: '',
//       approval_code: '',
//       receive_amount: '',
//       proposal_no: '',
//       policy_no: '',
//       allocation: '',
//       allocation_remark: '',
//       plan_code: '',
//       reference_type: '',
//       policy_holder_reference_no: '',
//       policy_holder_name: '',
//       address_1: '',
//       address_2: '',
//       address_3: '',
//       city: '',
//       postcode: '',
//       state: '',
//       country: '',
//       fax_no: '',
//       branch_code: '',
//       services_unit: ''
//     };
//   }
// }

interface PaymentRequestData {
  payor_name: string;
  collected_by: string;
  location: string;
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

interface PaymentRequestBody {
  data: PaymentRequestData;
}