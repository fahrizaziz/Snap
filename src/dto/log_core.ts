export class LogCore {
  id: number;
  customerNumber: string;
  request: string;
  response: string;
  retryAttempt: number = 0;
  eventStart: Date;
  eventEnd: string;
  coreReceiveStatus: string = '01';
  billPaymentId: number;
  requestId: string;
  exception: string;
  created_by: string = 'SYS';
  modified_by: string = 'SYS';
  modified_date: string;
  created_date: string;
  is_active: string = '1';
}
