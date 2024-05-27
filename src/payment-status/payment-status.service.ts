import { Injectable } from '@nestjs/common';
import { PayloadDto } from 'src/dto/payload';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymentStatusService {
  constructor(private readonly authService: AuthService) {}

  async sendPaymentStatusRequest(
    token: string,
    payload: PayloadDto,
    timestamp: string,
    payment_url: string,
  ) {
    const url = payment_url;
    const relative_url = '/payment-status/bca';
    const stringToSign = this.authService.generateSymmetricStringToSign(
      'POST',
      relative_url,
      token,
      payload,
      timestamp,
    );
    const signature = await this.authService.generateSymmetricSignature(
      stringToSign,
    );
    const headers = {
      'CHANNEL-ID': '95231',
      'X-PARTNER-ID': '12345',
      'Content-Type': 'application/json',
      'X-TIMESTAMP': `${timestamp}`,
    };
    const timeout = 5000; // 5 seconds
    if (token) {
      headers['Authorization'] = token;
      headers['X-SIGNATURE'] = signature;
    }

    try {
      const response = await axios.post(url, payload, { headers, timeout });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
