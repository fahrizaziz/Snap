import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Headers,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { VaBriService } from './va-bri.service';
import { Inquery } from 'src/dto/inquery';
import { Payment } from 'src/dto/payment';
import { JwtAuthGuardBri } from 'src/auth/jwt-auth-bri.guard';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuardBriPayment } from 'src/auth/jwt-auth-payment-bri.guard';
import { InquiryReason } from 'src/response/response-inquiry';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckServer } from 'src/health-check/health-check-server.service';
import { DBHealthIndicator } from 'src/health-check/health-check.db.service';

@Controller('snap/v1.0')
export class VaBriController {
  constructor(
    private readonly vaBriService: VaBriService,
    private readonly authService: AuthService,
    private readonly connection: HealthCheckService,
    private readonly plHealthIndicator: HealthCheckServer,
    private readonly dbHealthIndicator: DBHealthIndicator,
  ) {}
  private sendErrorResponse(
    res: Response,
    statusCode: number,
    responseCode: string,
    responseMessage: string,
  ) {
    return res.status(statusCode).json({ responseCode, responseMessage });
  }
  private sendErrorProperty(
    res: Response,
    statusCode: number,
    responseCode: string,
    inquiryStatus: string,
    responseMessage: string,
  ) {
    return res
      .status(statusCode)
      .json({ responseCode, responseMessage, inquiryStatus });
  }

  @Get('/health-check')
  @HealthCheck()
  check() {
    const baseUrl = process.env.PL_URL;
    const originalUrl = process.env.PL_PATH;
    const modifiedUrl = originalUrl.replace(
      'api/proposal/premiumcollection',
      '',
    );
    return this.connection.check([
      async () => await this.dbHealthIndicator.isHealthy(),
      async () => await this.dbHealthIndicator.isHealthyDBLink(),
      async () => await this.plHealthIndicator.isHealthy(baseUrl + modifiedUrl),
    ]);
  }

  @Post('/transfer-va/inquiry')
  @UseGuards(JwtAuthGuardBri)
  async inquiryBRI(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-PARTNER-ID') partner_ID: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('CHANNEL-ID') channel_ID: string,
    @Headers('X-EXTERNAL-ID') external_ID: string,
    @Headers('Authorization') authHeader: string,
    @Body() inquiry: Inquery,
    @Res() res: Response,
  ) {
    const regexCheckStringContent = /^[0-9]{1,10}$/;
    const relative_url = process.env.RELATIVE_URL_INQUIRY_BRI;
    const verifySignature = await this.authService.verifySymmetricSignature(
      timestamp,
      signature,
      authHeader,
      relative_url,
      inquiry,
    );
    const paddeValue = '0000' + inquiry.channelCode;
    const channelID = paddeValue;

    const valueXPartnerID = partner_ID.length;
    const lengthValue = 36;

    if (!inquiry.hasOwnProperty('partnerServiceId')) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field',
      //   '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Partner Service Id';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Partner Service Id tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Partner Service Id';
      const response = {
        responseCode,
        responseMessage,
        virtualAccountData: {
          inquiryStatus,
          inquiryReason,
          partnerServiceId: inquiry.partnerServiceId,
          customerNo: inquiry.customerNo,
          virtualAccountNo: inquiry.virtualAccountNo,
          virtualAccountName: '',
          virtualAccountEmail: '',
          virtualAccountPhone: '',
          inquiryRequestId: inquiry.inquiryRequestId,
          totalAmount: {
            currency: '',
            value: '',
          },
          subCompany: '',
          billDetails: [],
          freeTexts: [],
          virtualAccountTrxType: '',
          feeAmount: null,
          additionalInfo: {},
        },
      };
      return res.status(400).send(response);
    }

    // const partnerID = inquiry.partnerServiceId.replace(/\s/g, '');

    const channel = process.env.CHANNELID;

    if (!regexCheckStringContent.test(channel_ID)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002401',
        'Invalid Field Format { Channel ID }',
      );
    }

    if (channel_ID !== channelID) {
      return this.sendErrorResponse(
        res,
        401,
        '4012400',
        'Unauthorized. [Unknown client]',
      );
    }

    if (valueXPartnerID != lengthValue) {
      return this.sendErrorResponse(
        res,
        400,
        '4002401',
        'Length/format value tidak sesuai',
      );
    }

    const isClientKeyExist = await this.authService.validateClientKey(
      partner_ID,
    );
    if (!isClientKeyExist) {
      return this.sendErrorResponse(
        res,
        401,
        '4012400',
        'Unauthorized. [Unknown client]',
      );
    }

    // if (partner_ID !== partnerID) {
    //   console.log('ooh');
    //   return this.sendErrorResponse(
    //     res,
    //     400,
    //     '4012400',
    //     'Unauthorized. [Unknown client]',
    //   );
    // }
    if (external_ID.trim() === '') {
      return this.sendErrorResponse(
        res,
        400,
        '4017300',
        'Unauthorized. [External ID cannot be empty]',
      );
    }

    if (verifySignature.isValid == false) {
      return this.sendErrorResponse(
        res,
        400,
        '4012400',
        'Unauthorized stringToSign',
      );
    }
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4002400',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    inquiry.eksternalId = external_ID;
    return this.vaBriService.inquiryBRI(inquiry, res);
  }

  @Post('/transfer-va/payment')
  @UseGuards(JwtAuthGuardBriPayment)
  async paymentBRI(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-PARTNER-ID') partner_ID: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('CHANNEL-ID') channel_ID: string,
    @Headers('X-EXTERNAL-ID') external_ID: string,
    @Headers('Authorization') authHeader: string,
    @Body() payment: Payment,
    @Res() res: Response,
  ) {
    const relative_url = process.env.RELATIVE_URL_PAYMENT_BRI;
    const regexCheckStringContent = /^[0-9]{1,10}$/;
    const verifySignature = await this.authService.verifySymmetricSignature(
      timestamp,
      signature,
      authHeader,
      relative_url,
      payment,
    );
    const paddeValue = '0000' + payment.channelCode;
    const channelID = paddeValue;
    // const channelID = payment.channelCode;
    if (!payment.hasOwnProperty('partnerServiceId')) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field',
      //   '01',
      // );
      const responseCode = '4002502';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Partner Service Id';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Partner Service Id tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Partner Service Id';
      const response = {
        responseCode,
        responseMessage,
        virtualAccountData: {
          inquiryStatus,
          inquiryReason,
          partnerServiceId: payment.partnerServiceId,
          customerNo: payment.customerNo,
          virtualAccountNo: payment.virtualAccountNo,
          virtualAccountName: '',
          virtualAccountEmail: '',
          virtualAccountPhone: '',
          inquiryRequestId: payment.paymentRequestId,
          totalAmount: {
            currency: '',
            value: '',
          },
          subCompany: '',
          billDetails: [],
          freeTexts: [],
          virtualAccountTrxType: '',
          feeAmount: null,
          additionalInfo: {},
        },
      };
      return res.status(400).send(response);
    }
    if (!regexCheckStringContent.test(channel_ID)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002501',
        'Invalid Field Format { Partner ID }',
      );
    }
    if (channel_ID !== channelID) {
      console.log('Disini nih');
      return this.sendErrorResponse(
        res,
        400,
        '4012500',
        'Unauthorized. [Unknown client]',
      );
    }

    const valueXPartnerID = partner_ID.length;
    const lengthValue = 36;

    if (valueXPartnerID != lengthValue) {
      return this.sendErrorResponse(
        res,
        400,
        '4002401',
        'Length/format value tidak sesuai',
      );
    }

    const isClientKeyExist = await this.authService.validateClientKey(
      partner_ID,
    );
    if (!isClientKeyExist) {
      return this.sendErrorResponse(
        res,
        401,
        '4012400',
        'Unauthorized. [Unknown client]',
      );
    }

    if (external_ID.trim() === '') {
      return this.sendErrorResponse(
        res,
        400,
        '4017300',
        'Unauthorized. [External ID cannot be empty]',
      );
    }

    // Ganti Response Message
    if (verifySignature.isValid == false) {
      return this.sendErrorResponse(
        res,
        400,
        '4012500',
        'Unauthorized stringToSign',
      );
    }
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4002400',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    payment.ekternalId = external_ID;
    return this.vaBriService.paymentBRI(payment, res);
  }
}
