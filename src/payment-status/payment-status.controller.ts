import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Res,
} from '@nestjs/common';
import { PaymentStatusService } from './payment-status.service';
import { PayloadDto } from 'src/dto/payload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { timestamp } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';

@Controller('payment-status')
export class PaymentStatusController {
  constructor(
    private readonly paymentStatusService: PaymentStatusService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  async getPaymentStatus(
    @Headers('ACCESS-TOKEN-URL') access_token_url: string,
    @Headers('PAYMENT-URL') payment_url: string,
    @Headers('CLIENT_ID') client_id: string,
    @Body() body: PayloadDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      // const token = access_token.split(' ')[1];
      const timestamp = new Date().toISOString();
      const url = access_token_url;
      const timeout = 5000; // 5 seconds
      const signature = await this.authService.generateSignature(
        client_id,
        timestamp,
      );
      const payload = {
        grantType: 'client_credentials',
      };
      const headers = {
        'Content-Type': 'application/json',
        'X-TIMESTAMP': `${timestamp}`,
        'X-SIGNATURE': `${signature}`,
        'X-CLIENT-KEY': `${client_id}`,
      };

      const generateToken = await axios.post(url, payload, {
        headers,
        timeout,
      });

      const access_token = 'Bearer ' + generateToken.data.accessToken;
      const status = await this.paymentStatusService.sendPaymentStatusRequest(
        access_token,
        body,
        timestamp,
        payment_url,
      );
      return res.status(200).send(status);
    } catch (error) {
      return res.status(400).send({
        message: 'Error',
      });
    }
  }

  @Post('/bca')
  @UseGuards(JwtAuthGuard)
  async paymentStatus(
    @Headers('CHANNEL-ID') channel_id: string,
    @Headers('X-PARTNER-ID') partner_id: string,
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('X-EXTERNAL-ID') external_id: string,
    @Headers('Authorization') access_token: string,
    @Body() payload: PayloadDto,
    @Res() res: Response,
  ) {
    try {
      const relative_url = '/payment-status/bca';
      const receivedSignature = signature;
      const stringToSign = this.authService.generateSymmetricStringToSign(
        'POST',
        relative_url,
        access_token,
        payload,
        timestamp,
      );
      const generatedSignature =
        await this.authService.generateSymmetricSignature(stringToSign);

      if (generatedSignature !== receivedSignature) {
        return res.status(401).json({
          responseCode: '4017300',
          responseMessage: 'Unauthorized. [Signature]',
        });
      }

      const response = {
        responseCode: '2002600',
        responseMessage: 'Success',
        virtualAccountData: {
          paymentFlagStatus: '00',
          paymentFlagReaspon: {
            indonesia: 'BERHASIL',
            english: 'SUCCESS',
          },
          partnerServiceId: payload.parterServiceId,
          customerNo: payload.customerNo,
          virtualAccountNo: payload.virtualAccountNo,
          inquiryRequestID: payload.inquiryRequestId,
          PaymentRequestID: payload.paymentRequestId,
          paidAmmount: {
            value: '100000.00',
            currency: 'IDR',
          },
          paidBills: '',
          totalAmount: {
            value: '100000.00',
            currenct: 'IDR',
          },
          trxDateTime: '2023-09-27T17:29:57+07:00',
          transactionDate: '2023-92-27=6T17:29:57+07:00',
          referenceNo: '0011123301',
          paymentType: '',
          flagAdvise: '',
          billDetails: [
            {
              billCode: '',
              billNo: '1234568998123',
              billName: '',
              billShortName: '',
              billDesripction: {
                english: 'Maintenance',
                indonesia: 'Pemeliharaan',
              },
              billSubCompany: '99999',
              billAmount: {
                value: '100000.00',
                currency: 'IDR',
              },
              additionalInfo: {
                value: '',
              },
              billReferenceNo: '0011412389',
              status: '00',
              reason: {
                english: 'SUCCESS',
                indonesia: 'SUKSES',
              },
            },
          ],
          freeTexts: [
            {
              english: 'Free text',
              indonesia: 'Tulisan bebas',
            },
          ],
        },
        additionalInfo: {},
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
