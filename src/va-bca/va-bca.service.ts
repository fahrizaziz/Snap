import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { BankService } from 'src/bank/bank.service';
import { BillPaymentService } from 'src/bill-payment/bill-payment.service';
import { BillService } from 'src/bill/bill.service';
import { DetailBillService } from 'src/detail-bill/detail-bill.service';
import { BankDetail } from 'src/dto/bank_detail';
import { BankStatementSeqNo } from 'src/dto/bank_statement_seq_no';
import { Bill } from 'src/dto/bill';
import { BillPayment } from 'src/dto/bill_payment';
import { DetailBill } from 'src/dto/detail_bill';
import { Inquery } from 'src/dto/inquery';
import { LogInquiry } from 'src/dto/log-inquiry';
import { LogCore } from 'src/dto/log_core';
import { Payment } from 'src/dto/payment';
import { PaymentSettlement } from 'src/dto/payment_settlement';
import BigDecimal from 'big.js';
import { SPAJ } from 'src/dto/spaj';
import { BankVa } from 'src/dto/va-bank';
import { LogInquiryBillService } from 'src/log-inquiry-bill/log-inquiry-bill.service';
import { LogCoreService } from 'src/log_core/log_core.service';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';
import {
  BillDetails,
  FreeTexts,
  InquiryReason,
  ResponseInquirySuccess,
} from 'src/response/response-inquiry';
import {
  PaymentFlagReason,
  ResponsePayment,
} from 'src/response/response-payment';
import { SpajService } from 'src/spaj/spaj.service';
import { VaBankService } from 'src/va-bank/va-bank.service';
import { Response } from 'express';
import { BankChannelService } from 'src/bank-channel/bank-channel.service';
import { BankChannel } from 'src/dto/bank_channel';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { format } from 'date-fns';
import { randomBytes } from 'crypto';
import { LoggerService } from 'src/logger/logger.service';
import * as moment from 'moment';
import { AuthService } from 'src/auth/auth.service';
import { PaymentBCA } from 'src/dto/payment_bca';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VaBcaService {
  constructor(
    private spajService: SpajService,
    private vaBankService: VaBankService,
    private logService: LogInquiryBillService,
    private bankService: BankService,
    private logCoreService: LogCoreService,
    private billPaymentService: BillPaymentService,
    private logRepo: LoginquirybilltransactionrepositoryService,
    private billS: BillService,
    private detail: DetailBillService,
    private bankChannelService: BankChannelService,
    private logger: LoggerService,
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  async inquiryBill(inquiry: Inquery, @Res() res: Response) {
    if (
      !inquiry.hasOwnProperty('inquiryRequestId') ||
      inquiry.inquiryRequestId == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field Inquiry Request Id',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Inquiry Request Id';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Request Id tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Inquiry Request Id';
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

    if (!inquiry.hasOwnProperty('customerNo') || inquiry.customerNo == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field Customer No',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Customer No';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Customer No tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Customer No';
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

    if (
      !inquiry.hasOwnProperty('virtualAccountNo') ||
      inquiry.virtualAccountNo == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field Virtual Account No',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Virtual Account No';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Virtual Account No tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Virtual Account No';
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

    if (!inquiry.hasOwnProperty('trxDateInit') || inquiry.trxDateInit == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field trx Date Init Amount',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field trx Date Init';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'trx Date Init tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field trx Date Init';
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

    if (!inquiry.hasOwnProperty('channelCode') || inquiry.channelCode == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002402',
      //   'Invalid Mandatory Field Channel Code',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Channel Code';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Channel Code tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Channel Code';
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

    try {
      type MyValue = string;
      const logInquiryBill = new LogInquiry();
      logInquiryBill.request_id = inquiry.inquiryRequestId;
      logInquiryBill.eksternalId = inquiry.eksternalId;
      const bankVa = new BankVa();
      bankVa.bank_va_code = inquiry.partnerServiceId.replace(/\s/g, '');
      const spaj = new SPAJ();
      spaj.customer_no = inquiry.customerNo;
      const bill = new Bill();
      bill.customer_number = inquiry.customerNo;
      const channelBank = new BankChannel();
      channelBank.bank_channel_code = inquiry.channelCode;

      this.logger.log('[ Start Bank Channel ]');
      let resultBankChannel;
      try {
        resultBankChannel = await this.bankChannelService.getBankChannel(
          channelBank,
        );
        this.logger.log(
          '[ Bank Channel ]',
          JSON.stringify(resultBankChannel, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // Check Exist Request ID
      this.logger.log('[ Start Check Exist Request ID ]');
      let isExistRequestId;
      try {
        isExistRequestId = await this.logRepo.findByRequestId(logInquiryBill);
        this.logger.log(
          '[ Check Exist Request ID ]',
          JSON.stringify(isExistRequestId, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // Check Exist Eksternal ID
      this.logger.log('[ Start Check Eksternal ID ]');
      let isExistEksternalId;
      try {
        isExistEksternalId = await this.logRepo.findByEkternalId(
          logInquiryBill,
        );
        this.logger.log(
          '[ Check Exist Eksternal ID ]',
          JSON.stringify(isExistEksternalId, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };

      function formatValue(value: MyValue) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
          throw new Error('Nilai tidak valid');
        }
        return numericValue.toFixed(2);
      }

      let inquiryStatus = '';

      let responseCode = '';

      let responseMessage = '';

      const billResponse = new ResponseInquirySuccess();

      const inquiryNew = inquiry.partnerServiceId.trim();
      const virt = inquiry.virtualAccountNo.trim();
      const regexCheckStringContent = /^\+?\d*$/;
      const isValid = await this.authService.isTimestampValid(
        inquiry.trxDateInit,
      );

      if (!isValid) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Trx Date Init }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Trx Date Init }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Trx Date Init } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Trx Date Init }';
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

      if (!regexCheckStringContent.test(inquiryNew)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Partner Service ID }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Partner Service ID }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Partner Service ID } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Partner Service ID }';
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

      if (!regexCheckStringContent.test(inquiry.customerNo)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Customer Number }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Customer Number }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Customer Number } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Customer Number }';
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

      if (!regexCheckStringContent.test(virt)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Virtual Account No }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Virtual Account No }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Virtual Account No } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Virtual Account No }';
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

      if (!regexCheckStringContent.test(inquiry.channelCode)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Channel Code }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Channel Code }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Channel Code } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Channel Code }';
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

      if (!regexCheckStringContent.test(inquiry.inquiryRequestId)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002401',
        //   'Invalid Field Format { Inquiry Request ID }',
        // );
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Inquiry Request ID }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Inquiry Request ID } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Inquiry Request ID }';
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

      if (isExistEksternalId.length > 0) {
        responseCode = '4092400';
        responseMessage = 'Conflict';
        inquiryStatus = '01';
        inquiryReason.indonesia =
          'Tidak bisa menggunakan X-EXTERNAL-ID yang sama';
        inquiryReason.english = 'Cannot use the same X-EXTERNAL-ID';
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
        return res.status(404).send(response);
      }

      if (isExistRequestId.length > 0) {
        responseCode = '4042412';
        responseMessage = 'RequestID already registered';
        inquiryStatus = '01';
        inquiryReason.indonesia = 'RequestID sudah terdaftar';
        inquiryReason.english = 'RequestID already registered';
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
        return res.status(404).send(response);
      }

      // Pengecekan VA Nomor
      const company = inquiry.virtualAccountNo.replace(/\s/g, '');
      const companyVa = company.substring(0, 5);
      const custono = company.substring(5);
      const companycustomerNo = await this.billPaymentService.getCustomer(
        custono,
      );

      this.logger.log('[ Start Company SPAJ ]');
      let companySpaj;
      try {
        companySpaj = await this.spajService.getSpajCust(custono);
        this.logger.log(
          '[ Company SPAJ ] : ',
          JSON.stringify(companySpaj, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (
        companyVa !== inquiryNew ||
        (companycustomerNo == undefined && companySpaj == undefined)
      ) {
        responseCode = '4042412';
        responseMessage = 'Invalid Bill/Virtual Account [Not Found]';
        inquiryStatus = '01';
        inquiryReason.english = 'Bill not found';
        inquiryReason.indonesia = 'Tagihan tidak ditemukan';
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
            paidAmount: {
              value: '',
              currency: '',
            },
            subCompany: '',
            billDetails: [],
            freeTexts: [],
            virtualAccountTrxType: '',
            feeAmount: '',
            additionalInfo: {},
          },
        };
        return res.status(404).send(response);
        // responseCode = '4042412';
        // responseMessage = 'Invalid Bill/Virtual Account [Not Found]';
        // inquiryStatus = '01';
        // inquiryReason.english = 'Bill not found';
        // inquiryReason.indonesia = 'Tagihan tidak ditemukan';
        // const response = {
        //   responseCode,
        //   responseMessage,
        //   virtualAccountData: {
        //     inquiryStatus,
        //     inquiryReason,
        //     partnerServiceId: inquiry.partnerServiceId,
        //     customerNo: inquiry.customerNo,
        //     virtualAccountNo: inquiry.virtualAccountNo,
        //     virtualAccountName: '',
        //     virtualAccountEmail: '',
        //     virtualAccountPhone: '',
        //     inquiryRequestId: inquiry.inquiryRequestId,
        //     totalAmount: {
        //       currency: '',
        //       value: '',
        //     },
        //     subCompany: '',
        //     billDetails: [],
        //     freeTexts: [],
        //     virtualAccountTrxType: '',
        //     feeAmount: null,
        //     additionalInfo: {},
        //   },
        // };
        // return this.sendErrorResponse2(res, 404, '4042412', response);
      }

      // Insert into log_inquiry_bill
      this.logger.log('[ Save Bill transaction]');
      await this.logService.saveLogInquiryBillByRequest(inquiry);

      const newBusinessBCA = process.env.NEWBUSINESSBCA;
      const renewalBCAUL = process.env.RENEWALBCAUL;
      const renewalBCA = process.env.RENEWALBCA;

      if (inquiryNew.trim() === newBusinessBCA) {
        this.logger.log('[ Start Request Inquiry New Business ]');

        // Get bank_va_code by company_code (3106 , OPENAMOUNT)
        this.logger.log('[ Start Bank Va Code by Company Code ]');
        let isExistCompanyCode = false;
        try {
          isExistCompanyCode = await this.vaBankService.getBankVa(bankVa);
          this.logger.log(
            '[ Bank Va Code by Company Code ] : ',
            JSON.stringify(isExistCompanyCode, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        this.logger.log('[ Company Code has found ]');
        if (isExistCompanyCode) {
          this.logger.log('[ Start Company Code has found ]');

          // GET BANK VA REF TO PRODUCT CATEGORY (00316, 00313 , TL , ILP)
          this.logger.log('[ Start Bank Va Ref To Product Category ]');
          let isExistBankVaProdCat = false;
          try {
            isExistBankVaProdCat = await this.vaBankService.getBankVaProd(
              bankVa,
            );
            this.logger.log(
              '[ Bank Va Ref To Product Category ] : ',
              JSON.stringify(isExistBankVaProdCat, null, 2),
            );
          } catch (error) {
            throw new NotFoundException(error.message);
          }

          if (isExistBankVaProdCat) {
            //Check t_bill By customer_code is exist
            this.logger.log('[ Start Check t_bill By customer_code is exist ]');
            let isExistBill = true;
            try {
              isExistBill = await this.spajService.spajNo(spaj);
              this.logger.log(
                '[ Hasil Check t_bill ] : ',
                JSON.stringify(isExistBill, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            let isBillHavePaid = true;
            try {
              isBillHavePaid = await this.spajService.spajAlready(spaj);
              this.logger.log(
                '[ Hasil Check t_bill ] : ',
                JSON.stringify(isBillHavePaid, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            // If Exist Bill Continue Insert To Log Inquiry
            if (isExistBill) {
              this.logger.log('[ SPAJ number has found]');
              responseCode = '2002400';
              responseMessage = 'Success';
              inquiryStatus = '00';
              inquiryReason.indonesia = 'Sukses';
              inquiryReason.english = 'Success';
              logInquiryBill.inquiry_status = inquiryStatus;
              // UPDATE inquiry_status [00/01]
              await this.logService.updateLogInquiryBill(logInquiryBill);
              this.logger.log(
                '[ Update Status Inquiry log_bill_inquiry] : ',
                inquiryStatus,
              );
              billResponse.virtualAccountData = {};
              billResponse.virtualAccountData.virtualAccountName =
                'PT EQUITY LIFE INDONESIA';
              billResponse.virtualAccountData.subCompany = '00000';
              billResponse.virtualAccountData.totalAmount = {
                currency: 'IDR',
                value: '0.00',
              };
              billResponse.virtualAccountData.partnerServiceId =
                inquiry.partnerServiceId;
              billResponse.virtualAccountData.customerNo = inquiry.customerNo;
              billResponse.virtualAccountData.virtualAccountNo =
                inquiry.virtualAccountNo;
              billResponse.virtualAccountData.inquiryStatus = inquiryStatus;
              billResponse.virtualAccountData.inquiryReason = inquiryReason;
              const billDetails: BillDetails[] = [];
              const freeTexts: FreeTexts[] = [];
              billResponse.virtualAccountData.billDetails = billDetails;
              billResponse.virtualAccountData.freeTexts = freeTexts;
              billResponse.virtualAccountData.virtualAccountTrxType = 'O';
              billResponse.virtualAccountData.feeAmount = null;
              billResponse.virtualAccountData.additionalInfo = {};
              const response = {
                responseCode,
                responseMessage,
                virtualAccountData: {
                  inquiryStatus,
                  inquiryReason,
                  partnerServiceId:
                    billResponse.virtualAccountData.partnerServiceId,
                  customerNo: inquiry.customerNo,
                  virtualAccountNo: inquiry.virtualAccountNo,
                  virtualAccountName:
                    billResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail: '',
                  virtualAccountPhone: '',
                  inquiryRequestId: inquiry.inquiryRequestId,
                  totalAmount: billResponse.virtualAccountData.totalAmount,
                  subCompany: billResponse.virtualAccountData.subCompany,
                  billDetails: billDetails,
                  freeTexts: freeTexts,
                  virtualAccountTrxType:
                    billResponse.virtualAccountData.virtualAccountTrxType,
                  feeAmount: billResponse.virtualAccountData.feeAmount,
                  additionalInfo:
                    billResponse.virtualAccountData.additionalInfo,
                },
              };
              return res.status(200).send(response);
            } else if (isBillHavePaid != null) {
              this.logger.error('Bill Expired');
              inquiryStatus = '01';
              responseMessage = 'Bill expired';
              inquiryReason.indonesia = 'tagihan sudah habis masa berlakunya';
              inquiryReason.english = 'already expired';
              const subCompany = '';
              const billDetails: BillDetails[] = [];
              const freeTexts: FreeTexts[] = [];
              billResponse.virtualAccountData = {};
              billResponse.virtualAccountData.virtualAccountName =
                'PT EQUITY LIFE INDONESIA';
              billResponse.virtualAccountData.subCompany = '00000';
              billResponse.virtualAccountData.totalAmount = {
                currency: 'IDR',
                value: '0.00',
              };
              billResponse.virtualAccountData.billDetails = billDetails;
              billResponse.virtualAccountData.freeTexts = freeTexts;
              billResponse.virtualAccountData.subCompany = subCompany;
              billResponse.virtualAccountData.virtualAccountTrxType = 'C';
              billResponse.virtualAccountData.feeAmount = null;
              billResponse.virtualAccountData.additionalInfo = {};
              responseCode = '4042419';
              const response = {
                responseCode,
                responseMessage,
                virtualAccountData: {
                  inquiryStatus,
                  inquiryReason,
                  partnerServiceId: inquiry.partnerServiceId,
                  customerNo: inquiry.customerNo,
                  virtualAccountNo: inquiry.virtualAccountNo,
                  virtualAccountName:
                    billResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail: '',
                  virtualAccountPhone: '',
                  inquiryRequestId: inquiry.inquiryRequestId,
                  totalAmount: billResponse.virtualAccountData.totalAmount,
                  subCompany: billResponse.virtualAccountData.subCompany,
                  billDetails: billResponse.virtualAccountData.billDetails,
                  freeTexts: billResponse.virtualAccountData.freeTexts,
                  virtualAccountTrxType:
                    billResponse.virtualAccountData.virtualAccountTrxType,
                  feeAmount: null,
                  additionalInfo: {},
                },
              };
              return res.status(404).send(response);
            } else {
              // If not exist bill customer no / SPAJ no
              this.logger.error('[ SPAJ number not found]');
              billResponse.virtualAccountData.totalAmount = {
                currency: '',
                value: '',
              };
              billResponse.virtualAccountData.feeAmount = {
                value: '',
                currency: '',
              };
              billResponse.virtualAccountData.additionalInfo = {
                channel: '',
                deviceId: '',
              };
              responseCode = '4042412';
              responseMessage = 'SPAJ number not found';
              inquiryStatus = '01';
              inquiryReason.indonesia = 'Nomor SPAJ tidak ditemukan';
              inquiryReason.english = 'SPAJ number not found';
              logInquiryBill.inquiry_status = inquiryStatus;
              // UPDATE inquiry_status [00/01]
              await this.logService.updateLogInquiryBill(logInquiryBill);
              this.logger.error(
                '[ Update Status Inquiry log_bill_inquiry] : ',
                inquiryStatus,
              );
              billResponse.virtualAccountData.partnerServiceId =
                inquiry.partnerServiceId;
              billResponse.virtualAccountData.customerNo = inquiry.customerNo;
              billResponse.virtualAccountData.virtualAccountNo =
                inquiry.virtualAccountNo;
              billResponse.virtualAccountData.inquiryStatus = inquiryStatus;
              billResponse.virtualAccountData.inquiryReason = inquiryReason;
              const billDetails: BillDetails[] = [];
              const freeTexts: FreeTexts[] = [
                {
                  indonesia: 'Free text',
                  english: 'Tulisan bebas',
                },
              ];
              const response = {
                responseCode,
                responseMessage,
                virtualAccountData: {
                  inquiryStatus,
                  inquiryReason,
                  partnerServiceId:
                    billResponse.virtualAccountData.partnerServiceId,
                  customerNo: inquiry.customerNo,
                  virtualAccountNo: inquiry.virtualAccountNo,
                  virtualAccountName:
                    billResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail: '',
                  virtualAccountPhone: '',
                  inquiryRequestId: inquiry.inquiryRequestId,
                  totalAmount: billResponse.virtualAccountData.totalAmount,
                  subCompany: '',
                  billDetails: billDetails,
                  freeTexts: freeTexts,
                  virtualAccountTrxType: '',
                  feeAmount: billResponse.virtualAccountData.feeAmount,
                  additionalInfo:
                    billResponse.virtualAccountData.additionalInfo,
                },
              };
              return res.status(400).send(response);
            }
          } else {
            // If not exist bank va product cat
            this.logger.error('Bank Prod Cat Not Found');
            billResponse.virtualAccountData.totalAmount = {
              currency: '',
              value: '',
            };
            billResponse.virtualAccountData.feeAmount = {
              value: '',
              currency: '',
            };
            billResponse.virtualAccountData.additionalInfo = {
              channel: '',
              deviceId: '',
            };
            responseCode = '4042412';
            responseMessage =
              'Company code and product category combination not found';
            inquiryReason.indonesia =
              'Kombinasi kode perusahaan dan produk kategori tidak ditemukan';
            inquiryReason.english =
              'Company code and product category combination not found';
            logInquiryBill.inquiry_status = inquiryStatus;
            // UPDATE inquiry_status [00/01]
            await this.logService.updateLogInquiryBill(logInquiryBill);
            this.logger.error(
              '[ Update Status Inquiry log_bill_inquiry] : ',
              inquiryStatus,
            );
            billResponse.virtualAccountData.partnerServiceId =
              inquiry.partnerServiceId;
            billResponse.virtualAccountData.customerNo = inquiry.customerNo;
            billResponse.virtualAccountData.virtualAccountNo =
              inquiry.virtualAccountNo;
            billResponse.virtualAccountData.inquiryStatus = inquiryStatus;
            billResponse.virtualAccountData.inquiryReason = inquiryReason;
            const billDetails: BillDetails[] = [];
            const freeTexts: FreeTexts[] = [
              {
                indonesia: 'Free text',
                english: 'Tulisan bebas',
              },
            ];
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                inquiryStatus,
                inquiryReason,
                partnerServiceId:
                  billResponse.virtualAccountData.partnerServiceId,
                customerNo: inquiry.customerNo,
                virtualAccountNo: inquiry.virtualAccountNo,
                virtualAccountName:
                  billResponse.virtualAccountData.virtualAccountName,
                virtualAccountEmail: '',
                virtualAccountPhone: '',
                inquiryRequestId: inquiry.inquiryRequestId,
                totalAmount: billResponse.virtualAccountData.totalAmount,
                subCompany: '',
                billDetails: billDetails,
                freeTexts: freeTexts,
                virtualAccountTrxType: '',
                feeAmount: billResponse.virtualAccountData.feeAmount,
                additionalInfo: billResponse.virtualAccountData.additionalInfo,
              },
            };
            return res.status(404).send(response);
          }
        } else {
          // If not exist kode perusahaan
          this.logger.error('Bank Va Not Found');
          billResponse.virtualAccountData.totalAmount = {
            currency: '',
            value: '',
          };
          billResponse.virtualAccountData.feeAmount = {
            value: '',
            currency: '',
          };
          billResponse.virtualAccountData.additionalInfo = {
            channel: '',
            deviceId: '',
          };
          responseCode = '4042412';
          responseMessage = 'Wrong Company code or not found';
          inquiryStatus = '01';
          inquiryReason.indonesia =
            'Kode Perusahaan Salah atau Tidak Ditemukan';
          inquiryReason.english = 'Wrong Company code or not found';
          logInquiryBill.inquiry_status = inquiryStatus;
          logInquiryBill.inquiry_status = inquiryStatus;
          // UPDATE inquiry_status [00/01]
          await this.logService.updateLogInquiryBill(logInquiryBill);
          this.logger.error(
            '[Update Status Inquiry log_bill_inquiry] : ',
            inquiryStatus,
          );
          billResponse.virtualAccountData.partnerServiceId =
            inquiry.partnerServiceId;
          billResponse.virtualAccountData.customerNo = inquiry.customerNo;
          billResponse.virtualAccountData.virtualAccountNo =
            inquiry.virtualAccountNo;
          billResponse.virtualAccountData.inquiryStatus = inquiryStatus;
          billResponse.virtualAccountData.inquiryReason = inquiryReason;
          const billDetails: BillDetails[] = [];
          const freeTexts: FreeTexts[] = [];
          const response = {
            responseCode,
            responseMessage,
            virtualAccountData: {
              inquiryStatus,
              inquiryReason,
              partnerServiceId:
                billResponse.virtualAccountData.partnerServiceId,
              customerNo: inquiry.customerNo,
              virtualAccountNo: inquiry.virtualAccountNo,
              virtualAccountName:
                billResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail: '',
              virtualAccountPhone: '',
              inquiryRequestId: inquiry.inquiryRequestId,
              totalAmount: billResponse.virtualAccountData.totalAmount,
              subCompany: '',
              billDetails: billDetails,
              freeTexts: freeTexts,
              virtualAccountTrxType: '',
              feeAmount: billResponse.virtualAccountData.feeAmount,
              additionalInfo: billResponse.virtualAccountData.additionalInfo,
            },
          };
          return res.status(404).send(response);
        }
      } else if (
        inquiryNew.trim() === renewalBCAUL ||
        inquiryNew.trim() === renewalBCA
      ) {
        this.logger.log('[ Start Request Inquiry Renewal ]');

        this.logger.log('[ Start Bank Va ]');
        let resultVaBank;
        try {
          resultVaBank = await this.vaBankService.getBankVaRe(bankVa);
          this.logger.log(
            '[ Bank Va ] : ',
            JSON.stringify(resultVaBank, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        if (resultVaBank.total_row > 0) {
          //GET BANK VA REF TO PRODUCT CATEGORY
          this.logger.log('[ Start Bank Va Ref To Product Category ]');
          let resulVaProd;
          try {
            resulVaProd = await this.vaBankService.getBankVaProdRe(bankVa);
            this.logger.log(
              '[ Bank Va Ref To Product Category ] : ',
              JSON.stringify(resulVaProd, null, 2),
            );
          } catch (error) {
            throw new NotFoundException(error.message);
          }

          this.logger.log('[ Bank Va ref to product category has found ]');
          if (resulVaProd.length > 0) {
            const arrProdCatVA: string[] = [];
            resulVaProd.forEach((row) => {
              arrProdCatVA.push(row.product_category);
            });
            const strInProdCatVa = `('${arrProdCatVA.join("','")}')`;

            this.logger.log('[ Check Result Bill ]');
            let resultBill;
            try {
              resultBill = await this.billS.findDueDate(bill);
              this.logger.log(
                '[ Result Bill ] : ',
                JSON.stringify(resultBill, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            let due_date;
            let formattedDueDate;
            billResponse.virtualAccountData = {};
            if (resultBill != null) {
              due_date = resultBill.due_date;
              formattedDueDate = format(due_date, 'yyyy-MM-dd');
              this.logger.error(
                '[ Result Bill In ] : ',
                JSON.stringify(formattedDueDate, null, 2),
              );
            } else {
              const resultBillCurrentDate = await this.billS.currentDate();
              due_date = resultBillCurrentDate.due_date;
              formattedDueDate = due_date;
              this.logger.error('[ Result Bill Not In Today ]');
            }
            bill.product_category = strInProdCatVa;
            bill.due_date = formattedDueDate;

            //GET BILL PAYMENT WITH STATUS AVAIABLE
            this.logger.log('[ Check Bill Payment With Status Available ]');
            let resultBillDetail;
            try {
              resultBillDetail = await this.billS.billDetail(bill);
              this.logger.log(
                '[ Bill Payment With Status Available ] : ',
                JSON.stringify(resultBillDetail, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log(
              '[ Check Bill Payment With Status Already Pay 002 ]',
            );
            let resultBillAlready;
            try {
              resultBillAlready = await this.billS.billAlready(bill);
              this.logger.log(
                '[ Bill Payment With Status Already Pay 002 ] : ',
                JSON.stringify(resultBillAlready, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log(
              '[ Check Bill Payment With Status Already Pay 003 ]',
            );
            let resultBillAlready2;
            try {
              resultBillAlready2 = await this.billS.billAlready2(bill);
              this.logger.log(
                '[ Bill Payment With Status Already Pay 003 ] : ',
                JSON.stringify(resultBillAlready2, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            //IF HAVE BILL
            if (resultBillDetail != null) {
              this.logger.log('[ Have Bill]');
              const oldestBill = resultBillDetail;
              const billCode = oldestBill.bill_code;
              bill.bill_code = billCode;
              bill.request_id = inquiry.inquiryRequestId;

              //UPDATE REQUEST ID
              this.logger.log('[ Start Update Request ID ]');
              let updateStatus;
              try {
                updateStatus = await this.billS.updateRequestID(bill);
                this.logger.log(
                  '[ Update Request ID ] : ',
                  JSON.stringify(updateStatus, null, 2),
                );
              } catch (error) {
                throw new NotFoundException(error.message);
              }

              this.logger.log('[ Start Check Total Standing ]');
              let totalStanding;
              try {
                totalStanding = await this.billS.totalOutStanding(bill);
                this.logger.log(
                  '[ Total Standing ] : ',
                  JSON.stringify(totalStanding, null, 2),
                );
              } catch (error) {
                throw new NotFoundException(error.message);
              }

              if (!updateStatus) {
                this.logger.log('[ Success Update Request ID]');
                const customerName = oldestBill.policy_holder;
                const currencyCode = oldestBill.currency;
                const amount: MyValue = oldestBill.nominal;
                const formatAmount: string = formatValue(amount);
                const totalAmount = formatAmount;
                const subCompany = '00000';
                const billDetails: BillDetails[] = [];
                const freeTexts: FreeTexts[] = [
                  {
                    indonesia: 'Tagihan Premi : ' + totalAmount,
                    english: 'Premium : ' + totalAmount,
                  },
                  {
                    indonesia:
                      'Saldo Tagihan Premi : ' +
                      totalStanding.total_outstanding,
                    english:
                      'Total Outstanding Balance : ' +
                      totalStanding.total_outstanding,
                  },
                ];
                billResponse.virtualAccountData.billDetails = billDetails;
                billResponse.virtualAccountData.freeTexts = freeTexts;
                billResponse.virtualAccountData.virtualAccountName =
                  customerName;
                billResponse.virtualAccountData.totalAmount = {
                  currency: currencyCode,
                  value: totalAmount,
                };
                billResponse.virtualAccountData.subCompany = subCompany;
                billResponse.virtualAccountData.virtualAccountTrxType = 'C';
                billResponse.virtualAccountData.feeAmount = null;
                billResponse.virtualAccountData.additionalInfo = {};
                responseCode = '2002400';
                responseMessage = 'Success';
                inquiryStatus = '00';
                inquiryReason.indonesia = 'Sukses';
                inquiryReason.english = 'Success';
              } else {
                this.logger.error('[ Failed Update Request ID]');
                inquiryStatus = '01';
                responseMessage = 'Bill not found';
                inquiryReason.indonesia = 'Tagihan tidak ditemukan';
                inquiryReason.english = 'Bill not found';
              }
            } else if (resultBillAlready != null) {
              // return this.sendErrorProperty(
              //   res,
              //   404,
              //   '4042414',
              //   'Bill has been paid',
              // );
              const customerName = resultBillAlready.policy_holder;
              const currencyCode = resultBillAlready.currency;
              const amount: MyValue = resultBillAlready.nominal;
              const formatAmount: string = formatValue(amount);
              const totalAmount = formatAmount;
              this.logger.error('Have No Bill');
              inquiryStatus = '01';
              responseMessage = 'Bill has been paid';
              inquiryReason.indonesia = 'tagihan sudah dibayar';
              inquiryReason.english = 'already paid';
              const subCompany = '';
              const billDetails: BillDetails[] = [];
              const freeTexts: FreeTexts[] = [];
              billResponse.virtualAccountData.billDetails = billDetails;
              billResponse.virtualAccountData.freeTexts = freeTexts;
              billResponse.virtualAccountData.virtualAccountName = customerName;
              billResponse.virtualAccountData.totalAmount = {
                currency: currencyCode,
                value: totalAmount,
              };
              billResponse.virtualAccountData.subCompany = subCompany;
              billResponse.virtualAccountData.virtualAccountTrxType = 'C';
              billResponse.virtualAccountData.feeAmount = null;
              billResponse.virtualAccountData.additionalInfo = {};
              responseCode = '4042414';
              const response = {
                responseCode,
                responseMessage,
                virtualAccountData: {
                  inquiryStatus,
                  inquiryReason,
                  partnerServiceId: inquiry.partnerServiceId,
                  customerNo: inquiry.customerNo,
                  virtualAccountNo: inquiry.virtualAccountNo,
                  virtualAccountName:
                    billResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail: '',
                  virtualAccountPhone: '',
                  inquiryRequestId: inquiry.inquiryRequestId,
                  totalAmount: billResponse.virtualAccountData.totalAmount,
                  subCompany: billResponse.virtualAccountData.subCompany,
                  billDetails: billResponse.virtualAccountData.billDetails,
                  freeTexts: billResponse.virtualAccountData.freeTexts,
                  virtualAccountTrxType:
                    billResponse.virtualAccountData.virtualAccountTrxType,
                  feeAmount: null,
                  additionalInfo: {},
                },
              };
              return res.status(404).send(response);
            } else if (resultBillAlready2 != null) {
              // return this.sendErrorProperty(
              //   res,
              //   404,
              //   '4042414',
              //   'Bill has been paid',
              // );
              const customerName = resultBillAlready2.policy_holder;
              const currencyCode = resultBillAlready2.currency;
              const amount: MyValue = resultBillAlready2.nominal;
              const formatAmount: string = formatValue(amount);
              const totalAmount = formatAmount;
              this.logger.error('Have No Bill');
              inquiryStatus = '01';
              responseMessage = 'Bill has been paid';
              inquiryReason.indonesia = 'tagihan sudah dibayar';
              inquiryReason.english = 'already paid';
              const subCompany = '';
              const billDetails: BillDetails[] = [];
              const freeTexts: FreeTexts[] = [];
              billResponse.virtualAccountData.billDetails = billDetails;
              billResponse.virtualAccountData.freeTexts = freeTexts;
              billResponse.virtualAccountData.virtualAccountName = customerName;
              billResponse.virtualAccountData.totalAmount = {
                currency: currencyCode,
                value: totalAmount,
              };
              billResponse.virtualAccountData.subCompany = subCompany;
              billResponse.virtualAccountData.virtualAccountTrxType = 'C';
              billResponse.virtualAccountData.feeAmount = null;
              billResponse.virtualAccountData.additionalInfo = {};
              responseCode = '4042414';
              const response = {
                responseCode,
                responseMessage,
                virtualAccountData: {
                  inquiryStatus,
                  inquiryReason,
                  partnerServiceId: inquiry.partnerServiceId,
                  customerNo: inquiry.customerNo,
                  virtualAccountNo: inquiry.virtualAccountNo,
                  virtualAccountName:
                    billResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail: '',
                  virtualAccountPhone: '',
                  inquiryRequestId: inquiry.inquiryRequestId,
                  totalAmount: billResponse.virtualAccountData.totalAmount,
                  subCompany: billResponse.virtualAccountData.subCompany,
                  billDetails: billResponse.virtualAccountData.billDetails,
                  freeTexts: billResponse.virtualAccountData.freeTexts,
                  virtualAccountTrxType:
                    billResponse.virtualAccountData.virtualAccountTrxType,
                  feeAmount: null,
                  additionalInfo: {},
                },
              };
              return res.status(404).send(response);
            } else {
              //ELSE DONT HAVE
              this.logger.error('Have No Bill');
              inquiryStatus = '01';
              responseMessage = 'You have no bills';
              inquiryReason.indonesia = 'Anda Tidak Memiliki Tagihan';
              inquiryReason.english = 'You have no bills';
            }
          } else {
            this.logger.error('Wrong Company Code and Product Category');
            inquiryStatus = '01';
            responseMessage =
              'Company code and product category combination not found';
            inquiryReason.indonesia =
              'Kombinasi kode perusahaan dan produk kategori tidak ditemukan';
            inquiryReason.english =
              'Company code and product category combination not found';
          }
        } else {
          this.logger.error('Wrong Company Code');
          inquiryStatus = '01';
          responseMessage = 'Wrong Company code or not found';
          inquiryReason.indonesia =
            'Kode Perusahaan salah atau tidak ditemukan';
          inquiryReason.english = 'Wrong Company code or not found';
        }
        if (inquiryStatus === '00') {
          const response = {
            responseCode,
            responseMessage,
            virtualAccountData: {
              inquiryStatus,
              inquiryReason,
              partnerServiceId: inquiry.partnerServiceId,
              customerNo: inquiry.customerNo,
              virtualAccountNo: inquiry.virtualAccountNo,
              virtualAccountName:
                billResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail: '',
              virtualAccountPhone: '',
              inquiryRequestId: inquiry.inquiryRequestId,
              totalAmount: billResponse.virtualAccountData.totalAmount,
              subCompany: billResponse.virtualAccountData.subCompany,
              billDetails: billResponse.virtualAccountData.billDetails,
              freeTexts: billResponse.virtualAccountData.freeTexts,
              virtualAccountTrxType:
                billResponse.virtualAccountData.virtualAccountTrxType,
              feeAmount: billResponse.virtualAccountData.feeAmount,
              additionalInfo: billResponse.virtualAccountData.additionalInfo,
            },
          };
          return res.status(200).send(response);
        } else if (inquiryStatus === '01') {
          const subCompany = '';
          const billDetails: BillDetails[] = [];
          const freeTexts: FreeTexts[] = [];
          billResponse.virtualAccountData.billDetails = billDetails;
          billResponse.virtualAccountData.freeTexts = freeTexts;
          billResponse.virtualAccountData.virtualAccountName = '';
          billResponse.virtualAccountData.totalAmount = {
            currency: '',
            value: '',
          };
          billResponse.virtualAccountData.subCompany = subCompany;
          responseCode = '4042412';
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
              totalAmount: billResponse.virtualAccountData.totalAmount,
              subCompany: billResponse.virtualAccountData.subCompany,
              billDetail: billResponse.virtualAccountData.billDetails,
              freeTexts: billResponse.virtualAccountData.freeTexts,
              virtualAccountTrxType: '',
              feeAmount: {
                value: '',
                currency: '',
              },
              additionalInfo: {
                deviceId: '',
                channel: '',
              },
            },
          };
          return res.status(404).send(response);
        }
      }
    } catch (error) {
      this.logger.error(
        '[ ERROR INQUIRY PROCCESS] : ',
        'error',
        JSON.stringify(error.message, null, 2),
      );
      const inquiryStatus = '';

      let responseCode = '';

      const responseMessage = 'General Error';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      responseCode = '5002400';
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
            value: '',
            currency: '',
          },
          subCompany: '',
          billDetail: [
            {
              billCode: '',
              billNo: '',
              billName: '',
              billShortName: '',
              billDescription: {
                english: '',
                indonesia: '',
              },
              billSubCompany: '',
              billAmount: {
                value: '',
                currency: '',
              },
              billAmountLabel: '',
              billAmountValue: '',
              additionalInfo: {},
            },
          ],
          freeTexts: [
            {
              indonesia: '',
              english: '',
            },
          ],
          virtualAccountTrxType: '',
          feeAmount: {
            value: '',
            currency: '',
          },
          additionalInfo: {
            deviceId: '',
            channel: '',
          },
        },
      };
      res.status(500).send(response);
    }
  }

  async paymentBCA(payment: PaymentBCA, @Res() res: Response) {
    if (!payment.hasOwnProperty('customerNo') || payment.customerNo == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Customer No',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Customer No';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Customer No tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Customer No';
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

    if (
      !payment.hasOwnProperty('virtualAccountNo') ||
      payment.virtualAccountNo == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Virtual Account No',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Virtual Account No';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Virtual Account No tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Virtual Account No';
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

    if (
      !payment.hasOwnProperty('virtualAccountName') ||
      payment.virtualAccountName == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Virtual Account Name',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Virtual Account Name';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Virtual Account Name tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Virtual Account Name';
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

    if (
      !payment.hasOwnProperty('paymentRequestId') ||
      payment.paymentRequestId == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Payment Request Id',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Payment Request Id';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Payment Request Id tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Payment Request Id';
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

    if (!payment.hasOwnProperty('channelCode') || payment.channelCode == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Channel Code',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Channel Code';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Channel Code tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Channel Code';
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

    if (
      !payment.paidAmount.hasOwnProperty('value') ||
      payment.paidAmount.value == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Value Amount',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Value Amount';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Value Amount tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Value Amount';
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

    if (
      !payment.paidAmount.hasOwnProperty('currency') ||
      payment.paidAmount.currency == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Currency Amount',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Currency Amount';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Currency Amount tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Currency Amount';
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

    if (
      !payment.totalAmount.hasOwnProperty('value') ||
      payment.totalAmount.value == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Value Total Amount',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Value Total Amount';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Value Total Amount tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Value Total Amount';
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

    if (
      !payment.totalAmount.hasOwnProperty('currency') ||
      payment.totalAmount.currency == ''
    ) {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Currency Total Amount',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Currency Total Amount';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Currency Total Amount tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Currency Total Amount';
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

    if (!payment.hasOwnProperty('flagAdvise') || payment.flagAdvise == '') {
      // return this.sendErrorProperty(
      //   res,
      //   400,
      //   '4002502',
      //   'Invalid Mandatory Field Flag Advise',
      //   // '01',
      // );
      const responseCode = '4002402';
      const inquiryStatus = '01';
      const responseMessage = 'Invalid Mandatory Field Flag Advise';
      const inquiryReason: InquiryReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };
      inquiryReason.indonesia = 'Flag Advise tidak boleh kosong';
      inquiryReason.english = 'Invalid Mandatory Field Flag Advise';
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

    try {
      const logInquiryBill = new LogInquiry();
      logInquiryBill.company_code = payment.partnerServiceId;
      logInquiryBill.customer_number = payment.customerNo;
      logInquiryBill.request_id = payment.paymentRequestId;
      logInquiryBill.eksternalId = payment.eksternalId;

      const bankStatement = new BankStatementSeqNo();
      bankStatement.bankVaCode = payment.partnerServiceId;

      const bankDetail = new BankDetail();
      bankDetail.bank_code = payment.partnerServiceId;

      const billPayment = new BillPayment();
      // billPayment.request_id = payment.virtualAccountNo.replace(/\s/g, '');
      billPayment.request_id = payment.paymentRequestId.replace(/\s/g, '');
      billPayment.ekternal_id = payment.eksternalId;

      const billDetail = new DetailBill();
      billDetail.request_id = payment.paymentRequestId;
      billDetail.customer_no = payment.customerNo;
      billDetail.bank_va_code = payment.partnerServiceId;

      const bill = new Bill();
      bill.customer_number = payment.customerNo;

      const spaj = new SPAJ();
      spaj.customer_no = payment.customerNo;

      const paymentResponse = new ResponsePayment();

      let paymentFlagStatus = '01';
      const paymentFlagReason: PaymentFlagReason = {
        english: 'English reason',
        indonesia: 'Indonesian reason',
      };

      const paymentNew = payment.partnerServiceId.replace(/\s/g, '');
      const newBusinessBCA = process.env.NEWBUSINESSBCA;
      const renewalBCAUL = process.env.RENEWALBCAUL;
      const renewalBCA = process.env.RENEWALBCA;

      const virt = payment.virtualAccountNo.replace(/\s/g, '');

      const count = await this.logService.getRetryLog(payment.paymentRequestId);
      const paymentAlreadyPaid = count?.payment_already_paid;
      const retryCount = count?.retry_attempt + 1 || false;
      const resultLatestLog = await this.logService.lastInsert();
      const regexCheckStringContent = /^\+?\d*$/;
      // const regexCheckStringAmountContent = /^rp\+?\d*$/;
      const regexCheckStringAmountContent = /^0\.00$|^\d+(\.\d{2})?$/;
      await this.logService.updateRetryLog(
        payment.paymentRequestId,
        retryCount,
      );
      const isValid = await this.authService.isTimestampValid(
        payment.trxDateTime,
      );
      if (!isValid) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002501',
        //   'Invalid Field Format { Trx Date Init }',
        // );
        const responseCode = '4002501';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Trx Date Init }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Trx Date Init } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Trx Date Init }';
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

      if (!regexCheckStringContent.test(payment.paymentRequestId)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002501',
        //   'Invalid Field Format { Payment Request ID }',
        // );
        const responseCode = '4002501';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Payment Request ID }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Payment Request ID } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Payment Request ID }';
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

      if (!regexCheckStringContent.test(paymentNew)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002501',
        //   'Invalid Field Format { Partner Service ID }',
        // );
        const responseCode = '4002501';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Partner Service ID }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Partner Service ID } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Partner Service ID }';
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

      if (!regexCheckStringContent.test(payment.customerNo)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002501',
        //   'Invalid Field Format { Customer No }',
        // );
        const responseCode = '4002501';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Customer No }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Customer No } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Customer No }';
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

      if (!regexCheckStringContent.test(virt)) {
        // return this.sendErrorResponse(
        //   res,
        //   400,
        //   '4002501',
        //   'Invalid Field Format { Virtual Account No }',
        // );
        const responseCode = '4002501';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Field Format { Virtual Account No }';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Format { Virtual Account No } tidak sesuai';
        inquiryReason.english = 'Invalid Field Format { Virtual Account No }';
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

      let responseCode = '';
      let responseMessage = '';

      // Pengecekan VA Nomor
      const company = payment.virtualAccountNo.replace(/\s/g, '');
      const companyVa = company.substring(0, 5);
      const custono = company.substring(5);

      this.logger.log('[ Start Customer Number ]');
      let companycustomerNo;
      try {
        companycustomerNo = await this.billPaymentService.getCustomer(custono);
        this.logger.log(
          '[ Customer Number ] : ',
          JSON.stringify(companycustomerNo, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      this.logger.log('[ Start Company SPAJ ]');
      let companySpaj;
      try {
        companySpaj = await this.spajService.getSpajCust(custono);
        this.logger.log(
          '[ Company SPAJ ] : ',
          JSON.stringify(companySpaj, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // Check Exist Eksternal ID
      this.logger.log('[ Start Check Eksternal ID ]');
      let isExistEksternalId;
      try {
        isExistEksternalId = await this.billPaymentService.findByEksternalId(
          billPayment,
        );
        this.logger.log(
          '[ Check Exist Eksternal ID ]',
          JSON.stringify(isExistEksternalId, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // Check Exist Request ID
      this.logger.log('[ Start Request Id ]');
      let isTRID;
      try {
        isTRID = await this.billPaymentService.findByRequestId(billPayment);
        this.logger.log('[ Request Id ] : ', JSON.stringify(isTRID, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (
        retryCount > 1 &&
        (companyVa !== paymentNew ||
          (companycustomerNo == undefined && companySpaj == undefined))
        // retryCount > 1
      ) {
        responseCode = '4042518';
        responseMessage = 'Inconsistent Request';
        paymentFlagStatus = '01';
        paymentFlagReason.english = 'Inconsistent Payment Request';
        paymentFlagReason.indonesia = 'Request Payment tidak konsisten';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: '',
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            paymentRequestId: payment.paymentRequestId,
            trxId: '',
            paidAmount: {
              value: '',
              currency: '',
            },
            paidBills: '',
            referenceNo: '',
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            totalAmount: {
              currency: '',
              value: '',
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }

      let resultBillAlready;
      try {
        resultBillAlready = await this.billS.billAlready3(bill);
        this.logger.log(
          '[ Bill Payment With Status Already Pay 002 ] : ',
          JSON.stringify(resultBillAlready, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (retryCount > 1 && paymentAlreadyPaid === '03') {
        await this.logService.updateIsPaymentPaid(
          payment.paymentRequestId,
          '04',
        );
        responseCode = '4042518';
        responseMessage = 'Inconsistent Request';
        paymentFlagStatus = '00';
        paymentFlagReason.indonesia = 'Sukses';
        paymentFlagReason.english = 'Success';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            trxId: '',
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            },
            paidBills: '',
            totalAmount: {
              currency: payment.totalAmount.currency,
              value: payment.totalAmount.value,
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            referenceNo: payment.referenceNo,
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }
      if (
        retryCount > 1 &&
        isExistEksternalId != null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
        // retryCount > 1 &&
        // resultBillAlready != null
      ) {
        responseCode = '4042518';
        responseMessage = 'Inconsistent Request';
        paymentFlagStatus = '01';
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            trxId: '',
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            },
            paidBills: '',
            totalAmount: {
              currency: payment.totalAmount.currency,
              value: payment.totalAmount.value,
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            referenceNo: payment.referenceNo,
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }

      if (
        // retryCount > 1 &&
        isExistEksternalId == null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
        // retryCount > 1 &&
        // resultBillAlready != null
      ) {
        responseCode = '4042518';
        responseMessage = 'Inconsistent Request';
        paymentFlagStatus = '01';
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            trxId: '',
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            },
            paidBills: '',
            totalAmount: {
              currency: payment.totalAmount.currency,
              value: payment.totalAmount.value,
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            referenceNo: payment.referenceNo,
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }

      if (
        // retryCount > 1 &&
        isExistEksternalId != null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
        // retryCount > 1 &&
        // resultBillAlready != null
      ) {
        responseCode = '4042518';
        responseMessage = 'Inconsistent Request';
        paymentFlagStatus = '01';
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            trxId: '',
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            },
            paidBills: '',
            totalAmount: {
              currency: payment.totalAmount.currency,
              value: payment.totalAmount.value,
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            referenceNo: payment.referenceNo,
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }

      if (
        resultLatestLog.retry_attempt == 1 &&
        resultLatestLog.request_id != payment.paymentRequestId
      ) {
        await this.logService.updateRetryLog(resultLatestLog.request_id, 0);
        responseCode = '4092500';
        responseMessage = 'Conflict';
        paymentFlagStatus = '01';
        paymentFlagReason.indonesia =
          'Tidak bisa menggunakan X-EXTERNAL-ID yang sama';
        paymentFlagReason.english = 'Cannot use the same X-EXTERNAL-ID';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            trxId: '',
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            },
            paidBills: '',
            totalAmount: {
              currency: payment.totalAmount.currency,
              value: payment.totalAmount.value,
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            referenceNo: payment.referenceNo,
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(409).send(response);
      }

      if (
        companyVa !== paymentNew ||
        (companycustomerNo == undefined && companySpaj == undefined)
      ) {
        //  tambahin instert ke table log
        await this.logService.saveorUpdateLogInquiryBillByRequest(payment);
        responseCode = '4042512';
        responseMessage = 'Invalid Bill/Virtual Account [Not Found]';
        paymentFlagStatus = '01';
        paymentFlagReason.english = 'Bill not found';
        paymentFlagReason.indonesia = 'Tagihan tidak ditemukan';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            paymentFlagStatus,
            paymentFlagReason,
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: '',
            virtualAccountEmail: '',
            virtualAccountPhone: '',
            paymentRequestId: payment.paymentRequestId,
            trxId: '',
            paidAmount: {
              value: '',
              currency: '',
            },
            paidBills: '',
            referenceNo: '',
            journalNum: '',
            paymentType: '',
            flagAdvise: 'N',
            totalAmount: {
              currency: '',
              value: '',
            },
            trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
            billDetails: [],
            freeTexts: [],
          },
          additionalInfo: {},
        };
        return res.status(404).send(response);
      }

      // if (!count) {
      //   responseCode = '4042514';
      //   responseMessage = 'Paid Bill';
      //   paymentFlagStatus = '01';
      //   paymentFlagReason.english = 'Bill has been paid';
      //   paymentFlagReason.indonesia = 'Tagihan telah dibayar';
      //   const response = {
      //     responseCode,
      //     responseMessage,
      //     virtualAccountData: {
      //       paymentFlagStatus,
      //       paymentFlagReason,
      //       partnerServiceId: payment.partnerServiceId,
      //       customerNo: payment.customerNo,
      //       virtualAccountNo: payment.virtualAccountNo,
      //       virtualAccountName: '',
      //       virtualAccountEmail: '',
      //       virtualAccountPhone: '',
      //       inquiryRequestId: payment.paymentRequestId,
      //       paidAmount: {
      //         value: '',
      //         currency: '',
      //       },
      //       paidBills: '',
      //       referenceNo: '',
      //       journalNum: '',
      //       paymentType: '',
      //       flagAdvise: 'N',
      //       totalAmount: {
      //         currency: '',
      //         value: '',
      //       },
      //       trxDateTime: payment.trxDateTime, //: “diisi sesuai dengan data yang direquest”
      //       billDetails: [],
      //       freeTexts: [],
      //     },
      //     additionalInfo: {},
      //   };
      //   return res.status(404).send(response);
      // }

      if (paymentNew.trim() == newBusinessBCA) {
        this.logger.log('[ Start Request Payment New Business ]');

        this.logger.log('[ Start Is Avalaible Bill ]');
        let isAvailableBill = true;
        try {
          isAvailableBill = await this.logRepo.findUnpaidByInquiryPayment(
            logInquiryBill.company_code,
            logInquiryBill.customer_number,
            logInquiryBill.request_id,
          );
          this.logger.log(
            '[ Is Avalaible Bill ] : ',
            JSON.stringify(isAvailableBill, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        // Check Status bill on t_log_inquiry_bill Field to check ['customer_number/spaj_no' , 'request_id' , 'company_code']
        this.logger.log('[ Start Check Status bill on t_log_inquiry_bill ]');
        let unpaidInquiryBill;
        try {
          unpaidInquiryBill =
            await this.logService.getUnpaidLogInquiryBillByInquiry(
              logInquiryBill.company_code,
              logInquiryBill.customer_number,
              logInquiryBill.request_id,
            );
          this.logger.log(
            '[ Status bill on t_log_inquiry_bill ] : ',
            JSON.stringify(unpaidInquiryBill, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        let isBillHavePaid = true;
        try {
          isBillHavePaid = await this.spajService.spajAlready(spaj);
          this.logger.log(
            '[ Hasil Check t_bill ] : ',
            JSON.stringify(isBillHavePaid, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        if (isAvailableBill) {
          const paid = payment.paidAmount.value;
          // const convertPaid = Number(paid);
          const total = payment.totalAmount.value;
          // const convertTotal = Number(total);

          const regexCheckStringContent = /^0\.00$|^\d+(\.\d{2})?$/;
          // const regexCheckStringAmountContent = /^rp\+?\d*$/;
          // console.log('Invalid : ', !regexCheckStringAmountContent.test(paid));
          // console.log(
          //   'Invalid 2 :',
          //   !regexCheckStringAmountContent.test(total),
          // );
          if (
            regexCheckStringContent.test(paid) &&
            regexCheckStringContent.test(total)
          ) {
            this.logger.error('[Invalid amount]');
            // responseCode = '4042513';
            // responseMessage = 'Invalid amount';
            await this.logService.updateIsPaymentPaid(
              payment.paymentRequestId,
              '03',
            );
            // If Exist Bill/SPAJ no on log_inquiry_bill
            this.logger.log(
              '[ Available bill/spaj has found in log_inquiry_bill]',
            );

            // Generate Bank_State_no
            this.logger.log('[ Start Generate Bank State no ]');
            let bankStatementNo;
            try {
              bankStatementNo =
                await this.bankService.generateBankStatementSeqNo(
                  bankStatement,
                );
              this.logger.log(
                '[ Generate Bank State no ] : ',
                JSON.stringify(bankStatementNo, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            // Get Bank Detail Properties [bank_core_code, received_mode_PL]
            this.logger.log('[ Start Get Bank Detail Properties ]');
            let bank;
            try {
              bank = await this.bankService.findBankDetailByVaCode(
                bankDetail.bank_code,
              );
              this.logger.log(
                '[ Bank Detail Properties ] : ',
                JSON.stringify(bank, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            // Insert t_bill_payment
            this.logger.log('[ Start Insert t_bill_payment ]');
            let resultSeqno;
            try {
              resultSeqno =
                await this.billPaymentService.generateBankStatementNo(
                  bankStatement,
                );
              this.logger.log(
                '[ Insert t_bill_payment ] : ',
                JSON.stringify(resultSeqno, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            const stringValue = String(resultSeqno.seqNumber);

            const bankVaCode = payment.partnerServiceId;

            this.logger.log('[ Start Result Bank Partner ]');
            let resultBankPartner;
            try {
              resultBankPartner = await this.bankService.findBankDetailByVaCode(
                bankVaCode,
              );
              this.logger.log(
                '[ Result Bank Partner ] : ',
                JSON.stringify(resultBankPartner, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            const parsedDate = new Date(payment.trxDateTime);
            const randomValue = randomBytes(4).readUint32BE(0);
            const randomString = String(randomValue % 900000);

            billPayment.bank_va_code = payment.partnerServiceId.replace(
              /\s/g,
              '',
            );
            billPayment.bank_core_code = resultBankPartner.bankCoreCode;
            billPayment.received_mode_PL = resultBankPartner.receivedModePL;
            billPayment.bank_state_seq_no = resultSeqno.bankStatementSeqNo;
            billPayment.seq_number = stringValue;
            billPayment.status = '01';
            billPayment.account_bank_received = '';
            billPayment.customer_number = payment.customerNo;
            billPayment.request_id = payment.paymentRequestId;
            billPayment.bank_channel_code = payment.channelCode;
            billPayment.notes = '';
            billPayment.bill_payment_code = randomString;
            billPayment.bank_partner = resultBankPartner.bankCode;
            billPayment.customer_name = payment.virtualAccountName.replace(
              /'/g,
              "''",
            );
            billPayment.currency = payment.paidAmount.currency;
            billPayment.paid_amount = new BigDecimal(payment.paidAmount.value);
            billPayment.total_amount = new BigDecimal(
              payment.totalAmount.value,
            );
            billPayment.sub_company = payment.subCompany;
            billPayment.reference_bill_code = payment.referenceNo;
            billPayment.reference_bank = payment.referenceNo;
            billPayment.is_advice = payment.flagAdvise;
            billPayment.transaction_date = format(
              parsedDate,
              'yyyy-MM-dd HH:mm:ss',
            );
            billPayment.additional_data = null;
            billPayment.ekternal_id = payment.eksternalId;
            await this.billPaymentService.saveBillPayment(billPayment);
            this.logger.log('[ Saving bill_payment ] : ', billPayment);

            const statement_date = formatISO(new Date(payment.trxDateTime), {
              representation: 'date',
            });

            const bankAccountReceived =
              await this.bankService.findBankAccountReceived(
                bank.bankCoreCode,
                bank.receivedModePL,
                'IDR',
                'TL',
              );
            let lastInsert;
            //UPDATE STATUS ON BILL
            this.logger.log('[ Start Last Insert ]');
            try {
              lastInsert = await this.billS.lastInsert();
              this.logger.log(
                '[ Last Insert ] : ',
                JSON.stringify(lastInsert, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }
            let billPaymentIds;
            const account = bankAccountReceived.account_no;
            billPaymentIds = lastInsert[0].lastInsertId;
            await this.billPaymentService.statusUpdateBillPayment(
              billPaymentIds,
              account,
            );

            // Generate JSON for sending PL transaction
            const paymentSettlement: PaymentSettlement = {
              data: {
                payor_name: 'PT EQUITY LIFE INDONESIA',
                collected_by: 'AUTO_SYS',
                location: 'FINAN',
                statement_date: statement_date,
                bank_statement_sequence_number:
                  bankStatementNo.bankStatementSeqNo,
                remarks: payment.customerNo,
                receive_mode: bank.receivedModePL,
                collection_bank: bank.bankCoreCode,
                currency: 'IDR',
                product_category: 'TL',
                bank_account_number: bankAccountReceived.account_no,
                payee_bank: '',
                cheque_or_cc_no: '',
                cheque_date: '',
                approval_code: '',
                receive_amount: payment.paidAmount.value,
                proposal_no: payment.customerNo,
                policy_no: '',
                allocation: 'TLSD',
                allocation_remark: '00',
                plan_code: '',
                reference_type: '',
                policy_holder_reference_no: '',
                policy_holder_name: '',
                address_1: '',
                address_2: '',
                address_3: '',
                city: '',
                postcode: '',
                state: '',
                country: '',
                fax_no: '',
                branch_code: '0056',
                services_unit: '',
              },
            };
            this.logger.log(
              '[ Created settlement PL obj ] : ',
              JSON.stringify(paymentSettlement, null, 2),
            );

            // Generate request from objects to JSON string for saving to DB
            let requestBodyJson: string | null = null;
            try {
              requestBodyJson = JSON.stringify(paymentSettlement);
              this.logger.log(
                '[ Request Body] : ',
                JSON.stringify(requestBodyJson, null, 2),
              );
            } catch (error) {
              this.logger.error(
                '[Error Parsing JSON Request PL to String]: ',
                'error',
                JSON.stringify(error.message),
              );
              throw error;
            }

            // Update status_payment log_inqury_bill to 'PAID'
            this.logger.log('[ Start Update log_bill_inquiry payment status ]');
            const inquiryStatus = '00';
            unpaidInquiryBill.payment_status = inquiryStatus;
            await this.logService.updateUnpaidLog(
              unpaidInquiryBill.payment_status,
              unpaidInquiryBill.request_id,
            );
            this.logger.log(
              '[ Update log_bill_inquiry payment status ] : ',
              inquiryStatus,
            );

            this.logger.log('[ Start Find Bill Payment ]');
            let billPaymentId;
            try {
              billPaymentId = await this.billPaymentService.findByBillPaymentId(
                billPayment,
              );
              this.logger.log(
                '[ Find Bill Payment ] : ',
                JSON.stringify(billPaymentId, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            paymentFlagStatus = '00';
            paymentFlagReason.english = 'Success';
            paymentFlagReason.indonesia = 'Sukses';

            // Opt 1 : Async Do Job Send To PL Using eventlistner

            const dataPL = paymentSettlement;
            const baseurl = process.env.PL_URL;
            const path = `${baseurl}${process.env.PL_PATH}`;
            const url = path;
            const token = process.env.PL_AUTH_HEADER;
            const headers = {
              Authorization: `Basic ${token}`,
            };
            let responsePL;
            if (!token) {
              throw new UnauthorizedException('Token tidak valid');
            }
            const payload = {
              url: url,
              dataPL: dataPL,
            };

            this.eventEmitter.emit(
              'send.pl',
              payload,
              headers,
              billPaymentIds,
              payment.customerNo,
              billPaymentIds,
              payment.paymentRequestId,
              requestBodyJson,
            );

            // responsePL = await axios.post(url, dataPL, { headers });
            // this.logger.log('[ Published event send to PL ] : ', responsePL);

            // console.log('PL Response sekarang : ', responsePL);

            // // Generate response from objects to JSON string for saving to DB
            // let responseBodyJson: string | null = null;
            // try {
            //   responseBodyJson = JSON.stringify(responsePL.data);
            //   this.logger.log(
            //     '[ Response Body] : ',
            //     JSON.stringify(responseBodyJson, null, 2),
            //   );
            // } catch (error) {
            //   this.logger.error(
            //     '[ Error Parsing JSON Request PL to String] : ',
            //     'error',
            //     JSON.stringify(error.message),
            //   );
            //   throw error;
            // }

            // // Insert t_log_core_transaction for logging transaction to PL
            // this.logger.log('[ Start saving log_core_transaction ]');
            // const logCoreTransactionDto = new LogCore();
            // logCoreTransactionDto.customerNumber = payment.customerNo;
            // logCoreTransactionDto.billPaymentId = billPaymentId.bill_payment_id;
            // logCoreTransactionDto.requestId = payment.paymentRequestId;
            // logCoreTransactionDto.response = responseBodyJson;
            // logCoreTransactionDto.request = requestBodyJson;
            // await this.logCoreService.saveLogCore(logCoreTransactionDto);
            // this.logger.log(
            //   '[ Saving log_core_transaction ]    : ',
            //   JSON.stringify(logCoreTransactionDto),
            // );

            responseCode = '2002500';
            responseMessage = 'Success';
            paymentResponse.virtualAccountData = {};
            paymentResponse.virtualAccountData.partnerServiceId =
              payment.partnerServiceId;
            paymentResponse.virtualAccountData.customerNo = payment.customerNo;
            paymentResponse.virtualAccountData.virtualAccountNo =
              payment.virtualAccountNo;
            paymentResponse.virtualAccountData.virtualAccountName =
              payment.virtualAccountName;
            paymentResponse.virtualAccountData.virtualAccountEmail =
              payment.virtualAccountEmail;
            paymentResponse.virtualAccountData.virtualAccountPhone =
              payment.virtualAccountPhone;
            paymentResponse.virtualAccountData.trxId = payment.trxId;
            paymentResponse.virtualAccountData.paidAmount = {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            };
            paymentResponse.virtualAccountData.totalAmount = {
              value: payment.totalAmount.value,
              currency: payment.totalAmount.currency,
            };
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                paymentFlagReason,
                partnerServiceId:
                  paymentResponse.virtualAccountData.partnerServiceId,
                customerNo: paymentResponse.virtualAccountData.customerNo,
                virtualAccountNo:
                  paymentResponse.virtualAccountData.virtualAccountNo,
                virtualAccountName:
                  paymentResponse.virtualAccountData.virtualAccountName,
                virtualAccountEmail:
                  paymentResponse.virtualAccountData.virtualAccountEmail,
                virtualAccountPhone:
                  paymentResponse.virtualAccountData.virtualAccountPhone,
                trxId: paymentResponse.virtualAccountData.trxId,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: paymentResponse.virtualAccountData.paidAmount,
                paidBills: payment.paidBills,
                totalAmount: paymentResponse.virtualAccountData.totalAmount,
                trxDateTime: payment.trxDateTime,
                referenceNo: payment.referenceNo,
                journalNum: payment.journalNum,
                paymentType: payment.paymentType,
                flagAdvise: payment.flagAdvise,
                paymentFlagStatus,
                billDetails: [],
                freeTexts: [],
              },
              additionalInfo: {},
            };
            return res.status(200).send(response);
          } else {
            paymentFlagStatus = '01';
            paymentFlagReason.english = 'Invalid amount';
            paymentFlagReason.indonesia = 'Jumlah tidak valid';
            paymentResponse.virtualAccountData = {};
            paymentResponse.virtualAccountData.partnerServiceId =
              payment.partnerServiceId;
            paymentResponse.virtualAccountData.customerNo = payment.customerNo;
            paymentResponse.virtualAccountData.virtualAccountNo =
              payment.virtualAccountNo;
            paymentResponse.virtualAccountData.virtualAccountName =
              payment.virtualAccountName;
            paymentResponse.virtualAccountData.virtualAccountEmail =
              payment.virtualAccountEmail;
            paymentResponse.virtualAccountData.virtualAccountPhone =
              payment.virtualAccountPhone;
            paymentResponse.virtualAccountData.trxId = payment.trxId;
            paymentResponse.virtualAccountData.paidAmount = {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            };
            paymentResponse.virtualAccountData.totalAmount = {
              value: payment.totalAmount.value,
              currency: payment.totalAmount.currency,
            };
            const response = {
              responseCode: '4042513',
              responseMessage: 'Invalid amount',
              virtualAccountData: {
                paymentFlagReason,
                partnerServiceId:
                  paymentResponse.virtualAccountData.partnerServiceId,
                customerNo: paymentResponse.virtualAccountData.customerNo,
                virtualAccountNo:
                  paymentResponse.virtualAccountData.virtualAccountNo,
                virtualAccountName:
                  paymentResponse.virtualAccountData.virtualAccountName,
                virtualAccountEmail:
                  paymentResponse.virtualAccountData.virtualAccountEmail,
                virtualAccountPhone:
                  paymentResponse.virtualAccountData.virtualAccountPhone,
                trxId: paymentResponse.virtualAccountData.trxId,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: paymentResponse.virtualAccountData.paidAmount,
                paidBills: payment.paidBills,
                totalAmount: paymentResponse.virtualAccountData.totalAmount,
                trxDateTime: payment.trxDateTime,
                referenceNo: payment.referenceNo,
                journalNum: payment.journalNum,
                paymentType: payment.paymentType,
                flagAdvise: payment.flagAdvise,
                paymentFlagStatus,
                billDetails: [],
                freeTexts: [],
              },
              additionalInfo: {},
            };
            return res.status(404).send(response);
          }
        } else if (isBillHavePaid != null) {
          // If not exist bill customer no / SPAJ no
          this.logger.error('[ Bill Expired]');
          paymentFlagStatus = '01';
          paymentFlagReason.english = 'already expired';
          paymentFlagReason.indonesia = 'tagihan sudah habis masa berlakunya';
          paymentResponse.virtualAccountData = {};
          paymentResponse.virtualAccountData.partnerServiceId =
            payment.partnerServiceId;
          paymentResponse.virtualAccountData.customerNo = payment.customerNo;
          paymentResponse.virtualAccountData.virtualAccountNo =
            payment.virtualAccountNo;
          paymentResponse.virtualAccountData.virtualAccountName =
            payment.virtualAccountName;
          paymentResponse.virtualAccountData.virtualAccountEmail =
            payment.virtualAccountEmail;
          paymentResponse.virtualAccountData.virtualAccountPhone =
            payment.virtualAccountPhone;
          paymentResponse.virtualAccountData.trxId = payment.trxId;
          paymentResponse.virtualAccountData.paidAmount = {
            value: payment.paidAmount.value,
            currency: payment.paidAmount.currency,
          };
          paymentResponse.virtualAccountData.totalAmount = {
            value: payment.totalAmount.value,
            currency: payment.totalAmount.currency,
          };
          const response = {
            responseCode: '4042519',
            responseMessage: 'Bill expired',
            virtualAccountData: {
              paymentFlagReason,
              partnerServiceId:
                paymentResponse.virtualAccountData.partnerServiceId,
              customerNo: paymentResponse.virtualAccountData.customerNo,
              virtualAccountNo:
                paymentResponse.virtualAccountData.virtualAccountNo,
              virtualAccountName:
                paymentResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail:
                paymentResponse.virtualAccountData.virtualAccountEmail,
              virtualAccountPhone:
                paymentResponse.virtualAccountData.virtualAccountPhone,
              trxId: paymentResponse.virtualAccountData.trxId,
              paymentRequestId: payment.paymentRequestId,
              paidAmount: paymentResponse.virtualAccountData.paidAmount,
              paidBills: payment.paidBills,
              totalAmount: paymentResponse.virtualAccountData.totalAmount,
              trxDateTime: payment.trxDateTime,
              referenceNo: payment.referenceNo,
              journalNum: payment.journalNum,
              paymentType: payment.paymentType,
              flagAdvise: payment.flagAdvise,
              paymentFlagStatus,
              billDetails: [],
              freeTexts: [],
            },
            additionalInfo: {},
          };
          return res.status(404).send(response);
        } else {
          await this.logService.updateIsPaymentPaid(
            payment.paymentRequestId,
            '04',
          );
          // If Not Exist Bill/SPAJ no
          this.logger.error(
            '[ Available Bill Is Not Found in log_inquiry_bill]',
          );
          paymentFlagStatus = '01';
          paymentFlagReason.english = 'Bill data not found';
          paymentFlagReason.indonesia = 'Data bill tidak ditemukan';
          paymentResponse.virtualAccountData = {};
          paymentResponse.virtualAccountData.partnerServiceId =
            payment.partnerServiceId;
          paymentResponse.virtualAccountData.customerNo = payment.customerNo;
          paymentResponse.virtualAccountData.virtualAccountNo =
            payment.virtualAccountNo;
          paymentResponse.virtualAccountData.virtualAccountName =
            payment.virtualAccountName;
          paymentResponse.virtualAccountData.virtualAccountEmail =
            payment.virtualAccountEmail;
          paymentResponse.virtualAccountData.virtualAccountPhone =
            payment.virtualAccountPhone;
          paymentResponse.virtualAccountData.trxId = payment.trxId;
          paymentResponse.virtualAccountData.paidAmount = {
            value: payment.paidAmount.value,
            currency: payment.paidAmount.currency,
          };
          paymentResponse.virtualAccountData.totalAmount = {
            value: payment.totalAmount.value,
            currency: payment.totalAmount.currency,
          };
          const response = {
            responseCode: '4042412',
            responseMessage: 'Bill data not found',
            virtualAccountData: {
              paymentFlagReason,
              partnerServiceId:
                paymentResponse.virtualAccountData.partnerServiceId,
              customerNo: paymentResponse.virtualAccountData.customerNo,
              virtualAccountNo:
                paymentResponse.virtualAccountData.virtualAccountNo,
              virtualAccountName:
                paymentResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail:
                paymentResponse.virtualAccountData.virtualAccountEmail,
              virtualAccountPhone:
                paymentResponse.virtualAccountData.virtualAccountPhone,
              trxId: paymentResponse.virtualAccountData.trxId,
              paymentRequestId: payment.paymentRequestId,
              paidAmount: paymentResponse.virtualAccountData.paidAmount,
              paidBills: payment.paidBills,
              totalAmount: paymentResponse.virtualAccountData.totalAmount,
              trxDateTime: payment.trxDateTime,
              referenceNo: payment.referenceNo,
              journalNum: payment.journalNum,
              paymentType: payment.paymentType,
              flagAdvise: payment.flagAdvise,
              paymentFlagStatus,
              billDetails: [],
              freeTexts: [],
            },
            additionalInfo: {},
          };
          return res.status(404).send(response);
        }
      } else if (
        paymentNew.trim() == renewalBCA ||
        paymentNew.trim() == renewalBCAUL
      ) {
        this.logger.log('[ Start Request Payment Renewal ]');
        paymentResponse.virtualAccountData = {};
        paymentResponse.virtualAccountData.partnerServiceId =
          payment.partnerServiceId;
        paymentResponse.virtualAccountData.customerNo = payment.customerNo;
        paymentResponse.virtualAccountData.virtualAccountNo =
          payment.virtualAccountNo;
        paymentResponse.virtualAccountData.virtualAccountName =
          payment.virtualAccountName;
        paymentResponse.virtualAccountData.virtualAccountEmail =
          payment.virtualAccountEmail;
        paymentResponse.virtualAccountData.virtualAccountPhone =
          payment.virtualAccountPhone;
        paymentResponse.virtualAccountData.trxId = payment.trxId;
        paymentResponse.virtualAccountData.paidAmount = {
          value: payment.paidAmount.value,
          currency: payment.paidAmount.currency,
        };
        paymentResponse.virtualAccountData.totalAmount = {
          value: payment.totalAmount.value,
          currency: payment.totalAmount.currency,
        };

        //CHECK STATUS BILL
        this.logger.log('[ Start Check Status Bill ]');
        let availableBillData;
        try {
          availableBillData = await this.detail.availableBillData(billDetail);
          this.logger.log(
            '[ Start Check Status Bill ] : ',
            JSON.stringify(availableBillData, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        let insertBill;
        let update;
        let lastInsert;

        let billCode;
        let bankStatementSeqNo;
        let seqNumber;

        //IF VALID BILL
        if (availableBillData.length > 0) {
          this.logger.log('[ Start VALID BILL ]');
          const paid = payment.paidAmount.value;
          const convertPaid = Number(paid);
          const total = payment.totalAmount.value;
          const convertTotal = Number(total);

          //GENERATE SEQ_NO USING SP
          const payAmount = availableBillData[0].nominal;
          if (
            Math.floor(convertPaid) === Math.floor(convertTotal) &&
            Math.floor(payAmount) === Math.floor(convertPaid) &&
            regexCheckStringAmountContent.test(paid) &&
            regexCheckStringAmountContent.test(total)
          ) {
            this.logger.log('[ Start Check Bank Statement No ]');
            let bankStatementNo;
            try {
              bankStatementNo =
                await this.bankService.generateBankStatementSeqNo(
                  bankStatement,
                );
              this.logger.log(
                '[ Bank Statement No ] : ',
                JSON.stringify(bankStatementNo, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            bankStatementSeqNo = bankStatementNo.bankStatementSeqNo;
            seqNumber = bankStatementNo.seqNumber;

            billCode = availableBillData[0].bill_code;

            //GET DETAIL BANK
            const bankDetail = await this.detail.detailBank(billDetail);

            //INSERT TO BILL PAYMENT
            this.logger.log('[ Start INSERT TO BILL PAYMENT ]');
            let resultSeqno;
            try {
              resultSeqno =
                await this.billPaymentService.generateBankStatementNo(
                  bankStatement,
                );
              this.logger.log(
                '[ INSERT TO BILL PAYMENT ] : ',
                JSON.stringify(resultSeqno, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            const stringValue = String(resultSeqno.seqNumber);

            const bankVaCode = payment.partnerServiceId;

            this.logger.log('[ Start Find Bank Detail By Va Code ]');
            let resultBankPartner;
            try {
              resultBankPartner = await this.bankService.findBankDetailByVaCode(
                bankVaCode,
              );
              this.logger.log(
                '[ Find Bank Detail By Va Code ] : ',
                JSON.stringify(resultBankPartner),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            const parsedDate = new Date(payment.trxDateTime);
            const randomValue = randomBytes(4).readUint32BE(0);
            const randomString = String(randomValue % 900000);

            billPayment.bank_va_code = payment.partnerServiceId.replace(
              /\s/g,
              '',
            );
            billPayment.bank_core_code = resultBankPartner.bankCoreCode;
            billPayment.received_mode_PL = resultBankPartner.receivedModePL;
            billPayment.bank_state_seq_no = resultSeqno.bankStatementSeqNo;
            billPayment.seq_number = stringValue;
            billPayment.status = '01';
            billPayment.account_bank_received = '';
            billPayment.customer_number = payment.customerNo;
            billPayment.request_id = payment.paymentRequestId;
            billPayment.bank_channel_code = payment.channelCode;
            billPayment.notes = '';
            billPayment.bill_payment_code = randomString;
            billPayment.bank_partner = resultBankPartner.bankCode;
            billPayment.customer_name = payment.virtualAccountName.replace(
              /'/g,
              "''",
            );
            billPayment.currency = payment.paidAmount.currency;
            billPayment.paid_amount = new BigDecimal(payment.paidAmount.value);
            billPayment.total_amount = new BigDecimal(
              payment.totalAmount.value,
            );
            billPayment.sub_company = payment.subCompany;
            billPayment.reference_bill_code = payment.referenceNo;
            billPayment.reference_bank = payment.referenceNo;
            billPayment.is_advice = payment.flagAdvise;
            billPayment.transaction_date = format(
              parsedDate,
              'yyyy-MM-dd HH:mm:ss',
            );
            billPayment.additional_data = null;
            billPayment.ekternal_id = payment.eksternalId;
            this.logger.log('[ Start Saving bill_payment ]');
            try {
              insertBill = await this.billPaymentService.saveBillPayment(
                billPayment,
              );
              // return;
              this.logger.log(
                '[ Saving bill_payment ] : ',
                JSON.stringify(billPayment, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            if (insertBill) {
              await this.logService.updateIsPaymentPaid(
                payment.paymentRequestId,
                '03',
              );
              this.logger.log('[Success Insert to Bill Payment]');
              responseCode = '2002500';
              responseMessage = 'Success';

              //UPDATE STATUS ON BILL
              this.logger.log('[ Start Last Insert ]');
              try {
                lastInsert = await this.billS.lastInsert();
                this.logger.log(
                  '[ Last Insert ] : ',
                  JSON.stringify(lastInsert, null, 2),
                );
              } catch (error) {
                throw new NotFoundException(error.message);
              }

              this.logger.log('[ Start Update Status ]');
              try {
                update = await this.billS.updateStatus(billCode);
                this.logger.log(
                  '[ Update Status ] : ',
                  JSON.stringify(update, null, 2),
                );
              } catch (error) {
                throw new NotFoundException(error.message);
              }

              if (!update) {
                paymentFlagStatus = '00';
                paymentFlagReason.english = 'Success';
                paymentFlagReason.indonesia = 'Sukses';
              } else {
                responseCode = '4042412';
                paymentFlagStatus = '01';
                responseMessage = 'Failed';
                paymentFlagReason.english = 'Bill not found';
                paymentFlagReason.indonesia = 'Tagihan tidak ditemukan';
                this.logger.error('[ Gagal Update Status ]');
                const response = {
                  responseCode: '4042412',
                  responseMessage: responseMessage,
                  virtualAccountData: {
                    paymentFlagReason,
                    partnerServiceId:
                      paymentResponse.virtualAccountData.partnerServiceId,
                    customerNo: paymentResponse.virtualAccountData.customerNo,
                    virtualAccountNo:
                      paymentResponse.virtualAccountData.virtualAccountNo,
                    virtualAccountName:
                      paymentResponse.virtualAccountData.virtualAccountName,
                    virtualAccountEmail:
                      paymentResponse.virtualAccountData.virtualAccountEmail,
                    virtualAccountPhone:
                      paymentResponse.virtualAccountData.virtualAccountPhone,
                    trxId: paymentResponse.virtualAccountData.trxId,
                    paymentRequestId: payment.paymentRequestId,
                    paidAmount: paymentResponse.virtualAccountData.paidAmount,
                    paidBills: payment.paidBills,
                    totalAmount: paymentResponse.virtualAccountData.totalAmount,
                    trxDateTime: payment.trxDateTime,
                    referenceNo: payment.referenceNo,
                    journalNum: payment.journalNum,
                    paymentType: payment.paymentType,
                    flagAdvise: payment.flagAdvise,
                    paymentFlagStatus,
                    billDetails: [],
                    freeTexts: [],
                  },
                  additionalInfo: {},
                };
                return res.status(404).send(response);
              }
            } else {
              this.logger.error('[Failed Insert to Bill Payment]');
              responseCode = '4042412';
              paymentFlagStatus = '01';
              responseMessage = 'Failed';
              paymentFlagReason.english =
                'Transaction Failed, Connection Lost Please Try Again Later';
              paymentFlagReason.indonesia =
                'Transaksi Gagal, Koneksi Terputus Mohon dicoba beberapa saat lagi';
              const response = {
                responseCode: '4042412',
                responseMessage: responseMessage,
                virtualAccountData: {
                  paymentFlagReason,
                  partnerServiceId:
                    paymentResponse.virtualAccountData.partnerServiceId,
                  customerNo: paymentResponse.virtualAccountData.customerNo,
                  virtualAccountNo:
                    paymentResponse.virtualAccountData.virtualAccountNo,
                  virtualAccountName:
                    paymentResponse.virtualAccountData.virtualAccountName,
                  virtualAccountEmail:
                    paymentResponse.virtualAccountData.virtualAccountEmail,
                  virtualAccountPhone:
                    paymentResponse.virtualAccountData.virtualAccountPhone,
                  trxId: paymentResponse.virtualAccountData.trxId,
                  paymentRequestId: payment.paymentRequestId,
                  paidAmount: paymentResponse.virtualAccountData.paidAmount,
                  paidBills: payment.paidBills,
                  totalAmount: paymentResponse.virtualAccountData.totalAmount,
                  trxDateTime: payment.trxDateTime,
                  referenceNo: payment.referenceNo,
                  journalNum: payment.journalNum,
                  paymentType: payment.paymentType,
                  flagAdvise: payment.flagAdvise,
                  paymentFlagStatus,
                  billDetails: [],
                  freeTexts: [],
                },
                additionalInfo: {},
              };
              return res.status(404).send(response);
            }
          } else {
            this.logger.error('[Invalid amount]');
            responseCode = '4042513';
            responseMessage = 'Invalid amount';
            paymentFlagStatus = '01';
            paymentFlagReason.english = 'Invalid amount';
            paymentFlagReason.indonesia = 'Jumlah tidak valid';
            const response = {
              responseCode: '4042513',
              responseMessage: responseMessage,
              virtualAccountData: {
                paymentFlagReason,
                partnerServiceId:
                  paymentResponse.virtualAccountData.partnerServiceId,
                customerNo: paymentResponse.virtualAccountData.customerNo,
                virtualAccountNo:
                  paymentResponse.virtualAccountData.virtualAccountNo,
                virtualAccountName:
                  paymentResponse.virtualAccountData.virtualAccountName,
                virtualAccountEmail:
                  paymentResponse.virtualAccountData.virtualAccountEmail,
                virtualAccountPhone:
                  paymentResponse.virtualAccountData.virtualAccountPhone,
                trxId: paymentResponse.virtualAccountData.trxId,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: paymentResponse.virtualAccountData.paidAmount,
                paidBills: payment.paidBills,
                totalAmount: paymentResponse.virtualAccountData.totalAmount,
                trxDateTime: payment.trxDateTime,
                referenceNo: payment.referenceNo,
                journalNum: payment.journalNum,
                paymentType: payment.paymentType,
                flagAdvise: payment.flagAdvise,
                paymentFlagStatus,
                billDetails: [],
                freeTexts: [],
              },
              additionalInfo: {},
            };
            return res.status(404).send(response);
          }
        } else {
          //INVALID BILL
          // return this.sendErrorProperty(
          //   res,
          //   404,
          //   '4042514',
          //   'Bill has been paid',
          // );
          await this.logService.updateIsPaymentPaid(
            payment.paymentRequestId,
            '04',
          );
          this.logger.error('[Invalied Bill]');
          responseCode = '4042514';
          responseMessage = 'Bill has been paid';
          paymentFlagStatus = '01';
          paymentFlagReason.english = 'Bill has been paid';
          paymentFlagReason.indonesia = 'Tagihan telah dibayar';
          const response = {
            responseCode: responseCode,
            responseMessage: responseMessage,
            virtualAccountData: {
              paymentFlagStatus,
              paymentFlagReason,
              partnerServiceId:
                paymentResponse.virtualAccountData.partnerServiceId,
              customerNo: paymentResponse.virtualAccountData.customerNo,
              virtualAccountNo:
                paymentResponse.virtualAccountData.virtualAccountNo,
              virtualAccountName:
                paymentResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail:
                paymentResponse.virtualAccountData.virtualAccountEmail,
              virtualAccountPhone:
                paymentResponse.virtualAccountData.virtualAccountPhone,
              trxId: paymentResponse.virtualAccountData.trxId,
              paymentRequestId: payment.paymentRequestId,
              paidAmount: paymentResponse.virtualAccountData.paidAmount,
              paidBills: payment.paidBills,
              totalAmount: paymentResponse.virtualAccountData.totalAmount,
              trxDateTime: payment.trxDateTime,
              referenceNo: payment.referenceNo,
              journalNum: payment.journalNum,
              paymentType: payment.paymentType,
              flagAdvise: payment.flagAdvise,
              billDetails: [],
              freeTexts: [],
            },
            additionalInfo: {},
          };
          return res.status(404).send(response);
        }

        let paymentsettlement;

        //GET T_BILL PROPERTIES
        this.logger.log('[ Start GET T_BILL PROPERTIES ]');
        let dataBill;
        try {
          dataBill = await this.billS.getDetailBillById(billCode);
          this.logger.log(
            '[ GET T_BILL PROPERTIES ] : ',
            JSON.stringify(dataBill, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        this.logger.log('[ Start Find Bank Detail By Va Code ]');
        let bank;
        try {
          bank = await this.bankService.findBankDetailByVaCode(
            bankDetail.bank_code,
          );
          this.logger.log(
            '[ Find Bank Detail By Va Code ] : ',
            JSON.stringify(bank, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        this.logger.log('[ Start Find Bank Account Received ]');
        let bankAccountReceived;
        try {
          bankAccountReceived = await this.bankService.findBankAccountReceived(
            bank.bankCoreCode,
            bank.receivedModePL,
            payment.paidAmount.currency,
            dataBill.product_category,
          );
          this.logger.log(
            '[ Find Bank Account Received ] : ',
            JSON.stringify(bankAccountReceived, null, 2),
          );
        } catch (error) {
          throw new NotFoundException(error.message);
        }

        if (dataBill != null) {
          const statement_date = formatISO(new Date(payment.trxDateTime), {
            representation: 'date',
          });

          // Generate JSON for sending PL transaction
          const paymentSettlement: PaymentRequestBody = {
            data: {
              payor_name: payment.virtualAccountName.replace(/'/g, "''"),
              collected_by: 'AUTO_SYS',
              location: 'FINAN',
              statement_date: statement_date,
              bank_statement_sequence_number: bankStatementSeqNo,
              remarks: '',
              receive_mode: bank.receivedModePL,
              collection_bank: bank.bankCoreCode,
              currency: payment.paidAmount.currency,
              product_category: dataBill.product_category,
              bank_account_number: bankAccountReceived.account_no,
              payee_bank: '',
              cheque_or_cc_no: '',
              cheque_date: '',
              approval_code: '',
              receive_amount: payment.paidAmount.value,
              proposal_no: '',
              policy_no: dataBill.policy_no,
              allocation: dataBill.allocation,
              allocation_remark: '',
              plan_code: '',
              reference_type: '',
              policy_holder_reference_no: '',
              policy_holder_name: '',
              address_1: '',
              address_2: '',
              address_3: '',
              city: '',
              postcode: '',
              state: '',
              country: '',
              fax_no: '',
              branch_code: '',
              services_unit: '',
            },
          };
          this.logger.log(
            '[ Created settlement PL obj ] : ',
            JSON.stringify(paymentSettlement, null, 2),
          );

          paymentsettlement = paymentSettlement;
          let billPaymentId;
          if (bankAccountReceived != null) {
            this.logger.log('[ Start To PL ]');
            const account = bankAccountReceived.account_no;
            billPaymentId = lastInsert[0].lastInsertId;
            await this.billPaymentService.statusUpdateBillPayment(
              billPaymentId,
              account,
            );
            // Generate request from Request objects to JSON string for saving to DB
            let requestBodyJson: string | null = null;
            try {
              requestBodyJson = JSON.stringify(paymentSettlement);
              this.logger.log(
                '[ Request Body] : ',
                JSON.stringify(requestBodyJson, null, 2),
              );
            } catch (error) {
              this.logger.error(
                '[Error Parsing JSON Request PL to String]: ',
                'error',
                JSON.stringify(error.message, null, 2),
              );
              throw error;
            }
            const baseurl = process.env.PL_URL;
            const path = `${baseurl}${process.env.PL_PATH}`;
            const url = path;
            const token = process.env.PL_AUTH_HEADER;
            const headers = {
              Authorization: `Basic ${token}`,
            };
            let responsePL;
            if (!token) {
              throw new UnauthorizedException('Token tidak valid');
            }
            const payload = {
              url: url,
              dataPL: paymentsettlement,
            };
            this.eventEmitter.emit(
              'send.pl',
              payload,
              headers,
              billPaymentId,
              payment.customerNo,
              billPaymentId,
              payment.paymentRequestId,
              requestBodyJson,
            );
            // try {
            //   responsePL = await axios.post(url, paymentsettlement, {
            //     headers,
            //     timeout: 30000,
            //   });
            //   if (responsePL.data.errorDataDetail) {
            //     await this.billPaymentService.statusUpdateBillPaymentErrorPL(
            //       billPaymentId,
            //     );

            //     this.logger.error(
            //       '[ Failed Published event send to PL ] : ',
            //       'error',
            //       JSON.stringify(responsePL.data.errorDataDetail, null, 2),
            //     );
            //   } else {
            //     await this.billPaymentService.statusUpdateBillPaymentSuccessPL(
            //       billPaymentId,
            //     );
            //     this.logger.log(
            //       '[ Published event send to PL ] : ',
            //       JSON.stringify(responsePL.data.errorDataDetail, null, 2),
            //     );
            //   }

            //   // Generate request from Response objects to JSON string for saving to DB
            //   let responseBodyJson: string | null = null;
            //   try {
            //     responseBodyJson = JSON.stringify(responsePL.data);
            //     this.logger.log(
            //       '[ Response Body] : ',
            //       JSON.stringify(responseBodyJson, null, 2),
            //     );
            //   } catch (error) {
            //     this.logger.error(
            //       '[ Error Parsing JSON Request PL to String] : ',
            //       'error',
            //       JSON.stringify(error.message, null, 2),
            //     );
            //     throw error;
            //   }

            //   // Insert t_log_core_transaction for logging transaction to PL
            //   this.logger.log('[ Start Saving log_core_transaction ]');
            //   const logCoreTransactionDto = new LogCore();
            //   logCoreTransactionDto.customerNumber = payment.customerNo;
            //   logCoreTransactionDto.billPaymentId = billPaymentId;
            //   logCoreTransactionDto.requestId = payment.paymentRequestId;
            //   logCoreTransactionDto.response = responseBodyJson;
            //   logCoreTransactionDto.request = requestBodyJson;
            //   await this.logCoreService.saveLogCore(logCoreTransactionDto);
            //   this.logger.log(
            //     '[ Saving log_core_transaction ]    : ',
            //     JSON.stringify(logCoreTransactionDto, null, 2),
            //   );
            // } catch (error) {
            //   this.logger.error(
            //     'Failed Process to PL : ',
            //     'error',
            //     JSON.stringify(error.message, null, 2),
            //   );
            // }
          } else {
            //UPDATE
            //1. Status = ‘Need to Check Data’
            //2. Notes = ‘Data account bank received tidak ditemukan’
            this.logger.error(
              'Update Status and Data account bank received not found',
            );
            await this.billPaymentService.statusUpdateBillPaymentReceivedNotFound(
              billPaymentId,
            );
          }
        }
        if (paymentFlagStatus === '00') {
          const response = {
            responseCode,
            responseMessage,
            virtualAccountData: {
              paymentFlagReason,
              partnerServiceId:
                paymentResponse.virtualAccountData.partnerServiceId,
              customerNo: paymentResponse.virtualAccountData.customerNo,
              virtualAccountNo:
                paymentResponse.virtualAccountData.virtualAccountNo,
              virtualAccountName:
                paymentResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail:
                paymentResponse.virtualAccountData.virtualAccountEmail,
              virtualAccountPhone:
                paymentResponse.virtualAccountData.virtualAccountPhone,
              trxId: paymentResponse.virtualAccountData.trxId,
              paymentRequestId: payment.paymentRequestId,
              paidAmount: paymentResponse.virtualAccountData.paidAmount,
              paidBills: payment.paidBills,
              totalAmount: paymentResponse.virtualAccountData.totalAmount,
              trxDateTime: payment.trxDateTime,
              referenceNo: payment.referenceNo,
              journalNum: payment.journalNum,
              paymentType: payment.paymentType,
              flagAdvise: payment.flagAdvise,
              paymentFlagStatus,
              billDetails: [],
              freeTexts: [],
            },
            additionalInfo: {},
          };
          return res.status(200).send(response);
        } else if (paymentFlagStatus === '01') {
          const response = {
            responseCode: '4042412',
            responseMessage: responseMessage,
            virtualAccountData: {
              paymentFlagReason,
              partnerServiceId:
                paymentResponse.virtualAccountData.partnerServiceId,
              customerNo: paymentResponse.virtualAccountData.customerNo,
              virtualAccountNo:
                paymentResponse.virtualAccountData.virtualAccountNo,
              virtualAccountName:
                paymentResponse.virtualAccountData.virtualAccountName,
              virtualAccountEmail:
                paymentResponse.virtualAccountData.virtualAccountEmail,
              virtualAccountPhone:
                paymentResponse.virtualAccountData.virtualAccountPhone,
              trxId: paymentResponse.virtualAccountData.trxId,
              paymentRequestId: payment.paymentRequestId,
              paidAmount: paymentResponse.virtualAccountData.paidAmount,
              paidBills: payment.paidBills,
              totalAmount: paymentResponse.virtualAccountData.totalAmount,
              trxDateTime: payment.trxDateTime,
              referenceNo: payment.referenceNo,
              journalNum: payment.journalNum,
              paymentType: payment.paymentType,
              flagAdvise: payment.flagAdvise,
              paymentFlagStatus,
              billDetails: [],
              freeTexts: [],
            },
            additionalInfo: {},
          };
          return res.status(404).send(response);
        }
      }
    } catch (error) {
      this.logger.error(
        '[ Error payment proccess] : ',
        'error',
        JSON.stringify(error.message, null, 2),
      );
      const paymentFlagReason: PaymentFlagReason = {
        english: '',
        indonesia: '',
      };
      const paymentFlagStatus = '';
      const response = {
        responseCode: '500',
        responseMessage: 'General Error',
        virtualAccount: {
          paymentFlagReason,
          partnerServiceId: '',
          customerNo: '',
          virtualAccountNo: '',
          virtualAccountName: '',
          virtualAccountEmail: '',
          virtualAccountPhone: '',
          trxId: '',
          paymentRequestId: '',
          paidAmount: {
            value: '',
            currency: '',
          },
          paidBills: '',
          totalAmount: {
            value: '',
            currency: '',
          },
          trxDateTime: '',
          referenceNo: '',
          journalNum: '',
          flagAdvise: '',
          paymentFlagStatus,
          billDetails: [],
          freeTexts: [],
        },
        additionalInfo: {},
      };
      return res.status(500).send(response);
    }
  }

  @OnEvent('send.pl')
  async handlePlEvent(
    payload: any,
    headers: any,
    billPaymentId: any,
    customerno: any,
    logBillPayemnt: number,
    paymentRequestId: any,
    requestbodyJson: any,
  ) {
    try {
      let responsePL;
      responsePL = await axios.post(payload.url, payload.dataPL, {
        headers,
      });
      this.logger.log('[ Published event send to PL ] : ', responsePL);

      if (responsePL.data.errorDataDetail) {
        await this.billPaymentService.statusUpdateBillPaymentErrorPL(
          billPaymentId,
        );

        this.logger.error(
          '[ Failed Published event send to PL ] : ',
          'error',
          JSON.stringify(responsePL.data.errorDataDetail, null, 2),
        );
      } else {
        await this.billPaymentService.statusUpdateBillPaymentSuccessPL(
          billPaymentId,
        );
        this.logger.log(
          '[ Published event send to PL ] : ',
          JSON.stringify(responsePL.data.errorDataDetail, null, 2),
        );
      }
      // console.log('Bill Payment Id : ', billPaymentId);
      // console.log('Response PL : ', responsePL);

      // Generate response from objects to JSON string for saving to DB
      let responseBodyJson: string | null = null;
      try {
        responseBodyJson = JSON.stringify(responsePL.data);
        this.logger.log(
          '[ Response Body] : ',
          JSON.stringify(responseBodyJson, null, 2),
        );
      } catch (error) {
        this.logger.error(
          '[ Error Parsing JSON Request PL to String] : ',
          'error',
          JSON.stringify(error.message),
        );
        throw error;
      }

      // Insert t_log_core_transaction for logging transaction to PL
      this.logger.log('[ Start saving log_core_transaction ]');
      const logCoreTransactionDto = new LogCore();
      logCoreTransactionDto.customerNumber = customerno;
      logCoreTransactionDto.billPaymentId = logBillPayemnt;
      logCoreTransactionDto.requestId = paymentRequestId;
      logCoreTransactionDto.response = responseBodyJson;
      logCoreTransactionDto.request = requestbodyJson;
      await this.logCoreService.saveLogCore(logCoreTransactionDto);
      this.logger.log(
        '[ Saving log_core_transaction ]    : ',
        JSON.stringify(logCoreTransactionDto),
      );
    } catch (error) {
      this.logger.error(
        'Failed Process to PL : ',
        'error',
        JSON.stringify(error.message, null, 2),
      );
    }
  }
}
