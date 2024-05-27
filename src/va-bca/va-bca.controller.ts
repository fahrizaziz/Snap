import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Headers,
  Get,
} from '@nestjs/common';
import { VaBcaService } from './va-bca.service';
import { Inquery } from 'src/dto/inquery';
import { Payment } from 'src/dto/payment';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuardBcaPayment } from 'src/auth/jwt-auth-payment.bca.guards';
import { PaymentBCA } from 'src/dto/payment_bca';
import { InquiryReason } from 'src/response/response-inquiry';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckServer } from 'src/health-check/health-check-server.service';
import { DBHealthIndicator } from 'src/health-check/health-check.db.service';

@Controller('openapi/v1.0')
export class VaBcaController {
  constructor(
    private readonly vaBcaService: VaBcaService,
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
  @UseGuards(JwtAuthGuard)
  async inquiryBill(
    @Headers('CHANNEL-ID') channelid: string,
    @Headers('X-PARTNER-ID') partnerid: string,
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('X-EXTERNAL-ID') external_ID: string,
    @Headers('Authorization') authHeader: string,
    @Body() inquiry: Inquery,
    @Res() res: Response,
  ) {
    const relative_url = process.env.RELATIVE_URL_INQUIRY;
    const regexCheckStringContent = /^[0-9]{1,10}$/;
    const verifySignature = await this.authService.verifySymmetricSignature(
      timestamp,
      signature,
      authHeader,
      relative_url,
      inquiry,
    );
    if (!inquiry.hasOwnProperty('partnerServiceId')) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Missing Mandatory Field { Partner Service Id }',
      //   '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Missing Mandatory Field { Partner Service Id }';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Partner Service Id tidak boleh kosong';
      inquiryReason.english = 'Missing Mandatory Field { Partner Service Id }';
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
    const partnerID = inquiry.partnerServiceId.replace(/\s/g, '');

    const channel = process.env.CHANNELID;

    if (!regexCheckStringContent.test(channelid)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002501',
        'Invalid Field Format { Channel ID }',
      );
    }

    if (channelid !== channel) {
      return this.sendErrorResponse(
        res,
        401,
        '4012400',
        'Unauthorized. [Unknown client]',
      );
    }
    if (!regexCheckStringContent.test(partnerid)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002501',
        'Invalid Field Format { Partner ID }',
      );
    }
    if (partnerid !== partnerID) {
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
        401,
        '4017300',
        'Unauthorized. [External ID cannot be empty]',
      );
    }
    if (verifySignature.isValid == false) {
      return this.sendErrorResponse(
        res,
        401,
        '4012400',
        'Unauthorized. [Signature]',
      );
    }
    const isValid = await this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4002400',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    inquiry.eksternalId = external_ID;
    return this.vaBcaService.inquiryBill(inquiry, res);
  }

  @Post('/transfer-va/payment')
  @UseGuards(JwtAuthGuardBcaPayment)
  async paymentBCA(
    @Headers('CHANNEL-ID') channelid: string,
    @Headers('X-PARTNER-ID') partnerid: string,
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('X-EXTERNAL-ID') external_ID: string,
    @Headers('Authorization') authHeader: string,
    @Body() payment: PaymentBCA,
    @Res() res: Response,
  ) {
    const relative_url = process.env.RELATIVE_URL_PAYMENT;
    const regexCheckStringContent = /^[0-9]{1,10}$/;
    const verifySignature = await this.authService.verifySymmetricSignature(
      timestamp,
      signature,
      authHeader,
      relative_url,
      payment,
    );

    if (!payment.hasOwnProperty('partnerServiceId')) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Partner Service Id',
      //   '01',
      // );
      const responseCode = '4002502';
      const inquiryStatus = '01';
      const responseMessage = 'Missing Mandatory Field { Partner Service Id }';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Partner Service Id tidak boleh kosong';
      inquiryReason.english = 'Missing Mandatory Field { Partner Service Id }';
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

    const channel = process.env.CHANNELID;

    if (channelid !== channel) {
      return this.sendErrorResponse(
        res,
        401,
        '4012500',
        'Unauthorized. [Unknown client]',
      );
    }

    if (!regexCheckStringContent.test(channelid)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002501',
        'Invalid Field Format { Partner ID }',
      );
    }

    if (!regexCheckStringContent.test(partnerid)) {
      return this.sendErrorResponse(
        res,
        400,
        '4002501',
        'Invalid Field Format { Partner ID }',
      );
    }

    const partnerID = payment.partnerServiceId.replace(/\s/g, '');
    if (partnerid !== partnerID) {
      return this.sendErrorResponse(
        res,
        401,
        '4012500',
        'Unauthorized. [Unknown client]',
      );
    }
    if (external_ID.trim() === '') {
      return this.sendErrorResponse(
        res,
        401,
        '4017300',
        'Unauthorized. [External ID cannot be empty]',
      );
    }
    if (verifySignature.isValid == false) {
      return this.sendErrorResponse(
        res,
        401,
        '4012500',
        'Unauthorized. [Signature]',
      );
    }
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        401,
        '4002400',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    payment.eksternalId = external_ID;
    return this.vaBcaService.paymentBCA(payment, res);
  }
}
