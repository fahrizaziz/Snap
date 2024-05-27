export class LogInquiry {
  company_code?: string;
  customer_number?: string;
  request_id?: string;
  channel_type?: string;
  additional_data?: string;
  transaction_date?: string;
  created_by?: string;
  modified_by?: string;
  is_active?: string;
  retry_attempt?: number = 0;
  inquiry_status?: string = null;
  payment_status?: string = null;
  eksternalId?: string;
}
