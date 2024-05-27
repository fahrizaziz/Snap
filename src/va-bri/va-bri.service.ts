import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { BankChannelService } from 'src/bank-channel/bank-channel.service';
import { BankService } from 'src/bank/bank.service';
import { BillPaymentService } from 'src/bill-payment/bill-payment.service';
import { BillService } from 'src/bill/bill.service';
import { Bank } from 'src/dto/bank';
import { BankChannel } from 'src/dto/bank_channel';
import { BankDetail } from 'src/dto/bank_detail';
import { BankStatementSeqNo } from 'src/dto/bank_statement_seq_no';
import { Bill } from 'src/dto/bill';
import { BillPayment } from 'src/dto/bill_payment';
import { Inquery } from 'src/dto/inquery';
import { LogCore } from 'src/dto/log_core';
import { Payment } from 'src/dto/payment';
import { SPAJ } from 'src/dto/spaj';
import { BankVa } from 'src/dto/va-bank';
import { LogCoreService } from 'src/log_core/log_core.service';
import {
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
import { formatISO } from 'date-fns';
import axios from 'axios';
import { LoggerService } from 'src/logger/logger.service';
import { AuthService } from 'src/auth/auth.service';
import { format } from 'date-fns';
import { LogInquiryBillService } from 'src/log-inquiry-bill/log-inquiry-bill.service';
import { LogInquiry } from 'src/dto/log-inquiry';
import { LoginquirybilltransactionrepositoryService } from 'src/loginquirybilltransactionrepository/loginquirybilltransactionrepository.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VaBriService {
  constructor(
    private vaBankService: VaBankService,
    private billService: BillService,
    private spajService: SpajService,
    private billPaymentService: BillPaymentService,
    private bankService: BankService,
    private bankChannelService: BankChannelService,
    private logService: LogInquiryBillService,
    private logCoreService: LogCoreService, // private readonly modelMapper: ModelMapper,
    private logRepo: LoginquirybilltransactionrepositoryService,
    private logger: LoggerService,
    private eventEmitter: EventEmitter2,
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

  async inquiryBRI(inquiry: Inquery, @Res() res: Response) {
    try {
      // Validasi Field
      const customerNo = inquiry.customerNo;
      const virtualAccountNo = inquiry.virtualAccountNo;
      const inquiryRequestId = inquiry.inquiryRequestId;
      const additionalInfo = inquiry.additionalInfo;
      const idApp = inquiry.additionalInfo!.idApp;
      if (!customerNo || customerNo == '') {
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
      if (!virtualAccountNo || virtualAccountNo == '') {
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
      if (!inquiryRequestId || inquiryRequestId == '') {
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
      if (!additionalInfo) {
        const responseCode = '4002402';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Mandatory Field Additional Info';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Id App tidak boleh kosong';
        inquiryReason.english = 'Invalid Mandatory Field Additional Info';
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
      if (!idApp || idApp == '') {
        const responseCode = '4002402';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid Mandatory Field Inquiry Id App';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Id App tidak boleh kosong';
        inquiryReason.english = 'Invalid Mandatory Field Inquiry Id App';
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
      const logInquiryBill = new LogInquiry();
      logInquiryBill.request_id = inquiry.inquiryRequestId;
      logInquiryBill.eksternalId = inquiry.eksternalId;
      const bankVa = new BankVa();
      bankVa.bank_va_code = inquiry.partnerServiceId.replace(/\s/g, '');
      const bankID = new Bank();
      bankID.bank_id = inquiry.sourceBankCode;
      const bankChannel = new BankChannel();
      bankChannel.bank_channel_code = inquiry.channelCode;
      const billC = new Bill();
      billC.policy_no = inquiry.customerNo;
      billC.customer_number = inquiry.customerNo;
      const spaj = new SPAJ();
      spaj.customer_no = inquiry.customerNo;
      const saldoBill = new BillPayment();
      saldoBill.policy_no = inquiry.customerNo;
      saldoBill.ekternal_id = inquiry.eksternalId;

      const passApp = process.env.PASS_APP;
      const passapp = inquiry.passApp === passApp;

      //get Bank ID
      this.logger.log('[ Start Bank ID ]');
      let bankId;
      try {
        bankId = await this.bankService.getBankID(bankID);
        this.logger.log('[ Bank ID ] : ', JSON.stringify(bankId, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      //get Bank Channel
      this.logger.log('[ Start Bank Channel ]');
      let bankCh;
      try {
        bankCh = await this.bankChannelService.getBankChannel(bankChannel);
        this.logger.log('[ Bank Channel ] : ', JSON.stringify(bankCh, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // const inquiryReason: InquiryReason = {
      //   english: 'English reason',
      //   indonesia: 'Indonesian reason',
      // };

      if (!passapp || !inquiry.passApp) {
        const responseCode = '4012400';
        const inquiryStatus = '01';
        const responseMessage = 'Unauthorized. Client Forbidden Access API';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'Tidak sah. API Akses Terlarang Klien';
        inquiryReason.english = 'Unauthorized. Client Forbidden Access API';
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
        return res.status(401).send(response);
      } else if (
        !inquiry.sourceBankCode ||
        inquiry.sourceBankCode === '' ||
        bankId === null
      ) {
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'BrivaNum Doesn’t Exist';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'BrivaNum Tidak Ada';
        inquiryReason.english = 'BrivaNum Doesn’t Exist';
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
      } else if (
        !inquiry.trxDateInit ||
        inquiry.trxDateInit === '' ||
        !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2})$/.test(
          inquiry.trxDateInit,
        )
      ) {
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
      } else if (
        !inquiry.channelCode ||
        inquiry.channelCode === '' ||
        bankCh === null
      ) {
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid TerminalID';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'ID Terminal tidak valid';
        inquiryReason.english = 'Invalid TerminalID';
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

      // const inquiryRespons: ResponseInquirySuccess =
      //   new ResponseInquirySuccess();
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
      // if (!inquiry.partnerServiceId || inquiry.partnerServiceId === '') {
      //   const response = {
      //     responseCode: `4002401`,
      //     responseMessage: 'BrivaNum can’t be null',
      //   };
      //   return res.status(400).send(response);
      // } else
      if (isExistEksternalId.length > 0) {
        const responseCode = '4092400';
        const responseMessage = 'Conflict';
        const inquiryStatus = '01';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
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

      const inquiryNew = inquiry.partnerServiceId.replace(/\s/g, '');
      // Validasi Format
      const virt = inquiry.virtualAccountNo.replace(/\s/g, '');
      const regexCheckStringContent = /^\+?\d*$/;

      if (!regexCheckStringContent.test(customerNo)) {
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

      // Pengecekan VA Nomor
      const company = inquiry.virtualAccountNo.replace(/\s/g, '');
      const companyVa = company.substring(0, 5);
      const custono = company.substring(5);

      this.logger.log('[ Start VA Nomor ]');
      let companycustomerNo;
      try {
        companycustomerNo = await this.billService.getProductCategory(custono);
        this.logger.log(
          '[ VA Nomor ] : ',
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

      if (
        companyVa !== inquiryNew ||
        (companycustomerNo == undefined && companySpaj == undefined)
      ) {
        const responseCode = '4042412';
        const responseMessage = 'Invalid Bill/Virtual Account [Not Found]';
        const inquiryStatus = '01';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
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
      }

      // this.logger.log('[ Start Check Eksternal ID ]');

      // let responseCode = '';
      // let responseMessage = '';
      // let inquiryStatus = '';

      //CompanyCode
      const newBusiness = process.env.NEWBUSINESS;
      const renewal = process.env.RENEWAL;

      // const isValid = await this.authService.isTimestampValid(
      //   inquiry.trxDateInit,
      // );

      //Replace No Polis
      this.logger.log('[ Start Check Bill ]');
      let checkBill;
      try {
        checkBill = await this.billService.getBill(billC);
        this.logger.log(
          '[ Check Bill ] : ',
          JSON.stringify(checkBill, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      this.logger.log('[ Start Check Settle ]');
      let checkSettle;
      try {
        checkSettle = await this.billService.getSettle(billC);
        this.logger.log(
          '[ Check Settle ] : ',
          JSON.stringify(checkSettle, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      //get BankVACode
      let isExistCompanyCode = false;
      let bankva;
      this.logger.log('[ Start  Bank VA Code ]');
      try {
        bankva = await this.vaBankService.getBankVaBRI(bankVa);
        isExistCompanyCode = bankva != null ? true : false;
        this.logger.log('[ Bank VA Code ] : ', JSON.stringify(bankva, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // const response = {
      //   responseCode: `4002401`,
      //   responseMessage: 'BrivaNum Doesn’t Exist',
      // };

      this.logger.log('[ Start Is Exist Bill ]');
      let isExistBill = true;
      try {
        isExistBill = await this.spajService.spajNo(spaj);
        this.logger.log(
          '[ Is Exist Bill ] : ',
          JSON.stringify(isExistBill, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      // this.logger.log('[ Start Is No Exist Bill ]');
      let isNoExistBill = true;
      try {
        isNoExistBill = await this.spajService.spajNotValid(spaj);
        this.logger.log(
          '[ Is No Exist Bill ] : ',
          JSON.stringify(isNoExistBill, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (isExistCompanyCode) {
        if (inquiry.partnerServiceId.trim() === newBusiness) {
          this.logger.log('[ Start Request Inquiry New Business ]');
          if (isExistBill) {
            // Insert into log_inquiry_bill
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            this.logger.log('[ Start Is Exist Bill New Business ]');
            const responseCode = '2002400';
            const responseMessage = 'Successful';
            const inquiryRespons = new ResponseInquirySuccess();
            inquiryRespons.virtualAccountData = {};
            inquiryRespons.virtualAccountData.partnerServiceId =
              inquiry.partnerServiceId;
            inquiryRespons.virtualAccountData.customerNo = inquiry.customerNo;
            inquiryRespons.virtualAccountData.virtualAccountNo =
              inquiry.virtualAccountNo;
            inquiryRespons.virtualAccountData.virtualAccountName =
              'PT Equity Life Indonesia';
            inquiryRespons.virtualAccountData.inquiryRequestId =
              inquiry.inquiryRequestId;
            inquiryRespons.virtualAccountData.totalAmount = {
              value: '0.00',
              currency: 'IDR',
            };
            const inquiryStatus = '00';
            logInquiryBill.inquiry_status = inquiryStatus;
            await this.logService.updateLogInquiryBill(logInquiryBill);
            this.logger.log(
              '[ Update Status Inquiry log_bill_inquiry] : ',
              inquiryStatus,
            );
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.indonesia = 'Sukses';
            inquiryReason.english = 'Success';
            inquiryRespons.virtualAccountData.additionalInfo = {
              idApp: inquiry.additionalInfo.idApp,
              info1: 'SPAJ',
            };
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                partnerServiceId:
                  inquiryRespons.virtualAccountData.partnerServiceId,
                customerNo: inquiryRespons.virtualAccountData.customerNo,
                virtualAccountNo:
                  inquiryRespons.virtualAccountData.partnerServiceId +
                  inquiryRespons.virtualAccountData.customerNo,
                virtualAccountName:
                  inquiryRespons.virtualAccountData.virtualAccountName,
                inquiryRequestId:
                  inquiryRespons.virtualAccountData.inquiryRequestId,
                totalAmount: inquiryRespons.virtualAccountData.totalAmount,
                inquiryStatus,
                inquiryReason,
                additionalInfo:
                  inquiryRespons.virtualAccountData.additionalInfo,
              },
            };
            this.logger.log('SPAJ Number has found');
            return res.status(200).send(response);
          } else if (isNoExistBill) {
            // Insert into log_inquiry_bill
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            const responseCode = '4042419';
            const responseMessage = 'Bill expired';
            const inquiryStatus = '01';
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.english = 'already expired';
            inquiryReason.indonesia = 'tagihan sudah habis masa berlakunya';
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
          } else {
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            const responseCode = '4042411';
            const responseMessage = 'SPAJ not found';
            const inquiryStatus = '01';
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.english = 'SPAJ not found';
            inquiryReason.indonesia = 'SPAJ tidak di temukan';
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
          }
        } else if (inquiry.partnerServiceId.trim() === renewal) {
          this.logger.log('[ Start Request Inquiry Renewal ]');
          if (checkBill[0] != null) {
            this.logger.log('[ Start Check Inquiry Bill Renewal ]');
            //CheckSaldo
            const resultBill = await this.billService.findDueDateBRI(billC);
            this.logger.log('[ Result Bill ] : ', resultBill);
            let due_date;
            let formattedDueDate;
            const inquiryRespons = new ResponseInquirySuccess();
            inquiryRespons.virtualAccountData = {};
            if (resultBill != null) {
              due_date = resultBill.due_date;
              formattedDueDate = format(due_date, 'yyyy-MM-dd');
              this.logger.log(
                '[ Result Bill In ] : ',
                JSON.stringify(formattedDueDate, null, 2),
              );
            } else {
              const resultBillCurrentDate =
                await this.billService.currentDate();
              due_date = resultBillCurrentDate.due_date;
              formattedDueDate = due_date;
              this.logger.log('[ Result Bill In Today ]');
            }
            billC.due_date = formattedDueDate;

            this.logger.log('[ Start Check Total Standing Renewal ]');
            let totalStading;
            try {
              totalStading = await this.billService.totalOutStandingBRI(billC);
              this.logger.log(
                '[ Total Standing ] : ',
                JSON.stringify(totalStading, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }
            // Insert into log_inquiry_bill
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            const responseCode = '2002400';
            const responseMessage = 'Successful';
            inquiryRespons.virtualAccountData.partnerServiceId =
              inquiry.partnerServiceId;
            inquiryRespons.virtualAccountData.customerNo = inquiry.customerNo;
            inquiryRespons.virtualAccountData.virtualAccountNo =
              inquiry.virtualAccountNo;
            inquiryRespons.virtualAccountData.virtualAccountName =
              checkBill[0].policy_holder;
            inquiryRespons.virtualAccountData.inquiryRequestId =
              inquiry.inquiryRequestId;
            inquiryRespons.virtualAccountData.totalAmount = {
              value: totalStading.total_outstanding + '.00',
              currency: 'IDR',
            };
            const inquiryStatus = '00';
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.indonesia = 'Sukses';
            inquiryReason.english = 'Success';
            inquiryRespons.virtualAccountData.additionalInfo = {
              idApp: inquiry.additionalInfo.idApp,
              info1: 'Tagihan',
            };
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                partnerServiceId:
                  inquiryRespons.virtualAccountData.partnerServiceId,
                customerNo: inquiryRespons.virtualAccountData.customerNo,
                virtualAccountNo:
                  inquiryRespons.virtualAccountData.partnerServiceId +
                  inquiryRespons.virtualAccountData.customerNo,
                virtualAccountName:
                  inquiryRespons.virtualAccountData.virtualAccountName,
                inquiryRequestId:
                  inquiryRespons.virtualAccountData.inquiryRequestId,
                totalAmount: inquiryRespons.virtualAccountData.totalAmount,
                inquiryStatus,
                inquiryReason,
                additionalInfo:
                  inquiryRespons.virtualAccountData.additionalInfo,
              },
            };
            this.logger.log('[Polis Number has found]');
            return res.status(200).send(response);
          } else if (checkSettle[0] != null) {
            // Insert into log_inquiry_bill
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            const responseCode = '4042414';
            const responseMessage = 'Paid Bill';
            const inquiryStatus = '01';
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.english = 'Paid Bill';
            inquiryReason.indonesia = 'Tagihan sudah Dibayar';
            this.logger.error('[Polis Number Already Paid]');
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
          } else {
            this.logger.log('[ Save Bill transaction]');
            await this.logService.saveLogInquiryBillByRequest(inquiry);
            const responseCode = '4042412';
            const responseMessage = 'No bill';
            const inquiryStatus = '01';
            const inquiryReason: InquiryReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            inquiryReason.english = 'No bill';
            inquiryReason.indonesia = 'Tidak ada tagihan';
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
            this.logger.error('No bill');
            return res.status(404).send(response);
          }
        }
      }
      // return res.status(400).send(response);
    } catch (error) {
      this.logger.error(
        '[ Error inquiry proccess] : ',
        'error',
        JSON.stringify(error.message, null, 2),
      );
      const response = {
        responseCode: '5002400',
        responseMessage: 'General Error',
      };
      return res.status(500).send(response);
    }

    // Ubah ke nest js
    // Programatically Rollback
    // TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

    // LinkedHashMap<String, String> res = new LinkedHashMap<>();
    // res.put("BillAmount", "");
    // res.put("BillName", "");
    // res.put("BrivaNum", "");

    // InquiryResponseDto inquiryResponseDto = new InquiryResponseDto();
    // inquiryResponseDto.setBillDetail(res);
    // inquiryResponseDto.setInfo1("Terjadi gangguan");
    // inquiryResponseDto.setInfo2("-");
    // inquiryResponseDto.setInfo3("-");
    // inquiryResponseDto.setInfo4("-");
    // inquiryResponseDto.setInfo5("-");
    // inquiryResponseDto.setStatusBill("9");
    // inquiryResponseDto.setCurrency("");
    // return inquiryResponseDto;
  }

  async paymentBRI(payment: Payment, @Res() res: Response) {
    try {
      // Validasi Field
      const customerNo = payment.customerNo;
      const virtualAccountNo = payment.virtualAccountNo;
      const virtualAccountName = payment.virtualAccountName;
      const paidAmount = payment.paidAmount;
      const amount = payment.paidAmount!.value;
      const currency = payment.paidAmount!.currency;
      const paymentRequestId = payment.paymentRequestId;
      if (!customerNo || customerNo == '') {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Mandatory Field Payment Customer No';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Customer No tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Customer No';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!virtualAccountNo || virtualAccountNo == '') {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage =
          'Invalid Mandatory Field Payment Virtual Account No';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Virtual Account No tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Virtual Account No';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!virtualAccountName || virtualAccountName == '') {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage =
          'Invalid Mandatory Field Payment Virtual Account Name';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Virtual Account Name tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Virtual Account Name';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!paidAmount) {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Mandatory Field Payment Paid Amount';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Paid Amount tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Paid Amount';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!amount || amount == '') {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage =
          'Invalid Mandatory Field Payment Paid Amount Value';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Paid Amount Value tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Paid Amount Value';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!currency || currency == '') {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage =
          'Invalid Mandatory Field Payment Paid Amount Currency';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Paid Amount Currency tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Paid Amount Currency';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (!paymentRequestId) {
        const responseCode = '4002502';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Mandatory Field Payment Request Id';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Payment Request Id tidak boleh kosong';
        paymentFlagReason.english =
          'Invalid Mandatory Field Payment Request Id';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      const logInquiryBill = new LogInquiry();
      logInquiryBill.request_id = payment.paymentRequestId;
      logInquiryBill.eksternalId = payment.ekternalId;
      const bankID = new Bank();
      bankID.bank_id = payment.sourceBankCode;
      const bankChannel = new BankChannel();
      bankChannel.bank_channel_code = payment.channelCode;
      const billPayment = new BillPayment();
      billPayment.request_id = payment.paymentRequestId;
      billPayment.ekternal_id = payment.ekternalId;
      const billC = new Bill();
      billC.policy_no = payment.customerNo;
      billC.customer_number = payment.customerNo;
      const bankDetail = new BankDetail();
      bankDetail.bank_code = payment.partnerServiceId;
      const spaj = new SPAJ();
      spaj.spaj_no = payment.customerNo;
      const bankS = new BankStatementSeqNo();
      bankS.bankVaCode = payment.partnerServiceId;

      const IdApp = process.env.ID_APP;
      const passApp = process.env.PASS_APP;
      const idapp = payment.additionalInfo.idApp === IdApp;
      const passapp = payment.additionalInfo.passApp === passApp;

      //get Bank ID
      this.logger.log('[ Start Bank ID ]');
      let bankId;
      try {
        bankId = await this.bankService.getBankID(bankID);
        this.logger.log('[ Bank ID ] : ', JSON.stringify(bankId, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      //get Bank Channel
      this.logger.log('[ Start Bank Channel ]');
      let bankCh;
      try {
        bankCh = await this.bankChannelService.getBankChannel(bankChannel);
        this.logger.log('[ Bank Channel ] : ', JSON.stringify(bankCh, null, 2));
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (!idapp || !payment.additionalInfo.idApp) {
        const responseCode = '4012500';
        const paymentFlagStatus = '01';
        const responseMessage = 'Unauthorized. Client Forbidden Access API';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Tidak sah. API Akses Terlarang Klien';
        paymentFlagReason.english = 'Unauthorized. Client Forbidden Access API';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      } else if (!passapp || !payment.additionalInfo.passApp || !passApp) {
        const responseCode = '4012500';
        const paymentFlagStatus = '01';
        const responseMessage = 'Unauthorized. Client Forbidden Access API';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Tidak sah. API Akses Terlarang Klien';
        paymentFlagReason.english = 'Unauthorized. Client Forbidden Access API';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      } else if (
        !payment.sourceBankCode ||
        payment.sourceBankCode === '' ||
        bankId === null
      ) {
        const responseCode = '4002401';
        const paymentFlagStatus = '01';
        const responseMessage = 'BrivaNum Doesn’t Exist';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'BrivaNum Tidak Ada';
        paymentFlagReason.english = 'BrivaNum Doesn’t Exist';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      } else if (
        !payment.trxDateTime ||
        payment.trxDateTime === '' ||
        !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2})$/.test(
          payment.trxDateTime,
        )
      ) {
        const responseCode = '4002501';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Field Format { Trx Date Init }';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Format { Trx Date Init } tidak sesuai';
        paymentFlagReason.english = 'Invalid Field Format { Trx Date Init }';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      } else if (
        !payment.channelCode ||
        payment.channelCode === '' ||
        bankCh === null
      ) {
        const responseCode = '4002401';
        const inquiryStatus = '01';
        const responseMessage = 'Invalid TerminalID';
        const inquiryReason: InquiryReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        inquiryReason.indonesia = 'ID Terminal tidak valid';
        inquiryReason.english = 'Invalid TerminalID';
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
      } else if (
        !payment.paidAmount.value ||
        payment.paidAmount.value.trim() === '' ||
        !/^[0-9]{1,10}(\.\d{2})$/.test(payment.paidAmount.value)
      ) {
        const responseCode = '4042513';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid amount';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Jumlah tidak valid';
        paymentFlagReason.english = 'Invalid amount';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }

      // /   let responseCode = '';
      //   let responseMessage = '';
      //   let paymentFlagStatus = '';

      //   const paymentResponse = new ResponsePayment();

      //   const paymentFlagReason: PaymentFlagReason = {
      //     english: 'English reason',
      //     indonesia: 'Indonesian reason',
      //   };

      // else if (!payment.partnerServiceId || payment.partnerServiceId === '') {
      //   const response = {
      //     responseCode: '4002401',
      //     responseMessage: 'BrivaNum can’t be null',
      //   };
      //   return res.status(400).send(response);
      // }

      // else if (isTRID != null) {
      //   const response = {
      //     responseCode: '4002501',
      //     responseMessage: 'Transaction ID Already Registered',
      //   };
      //   return res.status(400).send(response);
      // }

      // else if (isExistEksternalId != null) {
      //   const response = {
      //     responseCode: '4092500',
      //     responseMessage: 'Conflict',
      //   };
      //   return res.status(400).send(response);
      // }

      //CompanyCode
      const newBusiness = process.env.NEWBUSINESS;
      const renewal = process.env.RENEWAL;

      //   const regexCheckStringAmountContent = /^0\.00$|^\d+(\.\d{2})?$/;
      //   await this.logService.updateRetryLog(
      //     payment.paymentRequestId,
      //     retryCount,
      //   );
      //   const isValid = await this.authService.isTimestampValid(
      //     payment.trxDateTime,
      //   );

      // if (!regexCheckStringContent.test(paymentNew)) {
      //   const responseCode = '4002501';
      //   const inquiryStatus = '01';
      //   const responseMessage = 'Invalid Field Format { Partner Service ID }';
      //   const inquiryReason: InquiryReason = {
      //     english: 'English reason',
      //     indonesia: 'Indonesian reason',
      //   };
      //   inquiryReason.indonesia = 'Format { Partner Service ID } tidak sesuai';
      //   inquiryReason.english = 'Invalid Field Format { Partner Service ID }';
      //   const response = {
      //     responseCode,
      //     responseMessage,
      //     virtualAccountData: {
      //       inquiryStatus,
      //       inquiryReason,
      //       partnerServiceId: payment.partnerServiceId,
      //       customerNo: payment.customerNo,
      //       virtualAccountNo: payment.virtualAccountNo,
      //       virtualAccountName: '',
      //       virtualAccountEmail: '',
      //       virtualAccountPhone: '',
      //       inquiryRequestId: payment.paymentRequestId,
      //       paidAmount: {
      //         currency: '',
      //         value: '',
      //       },
      //       subCompany: '',
      //       billDetails: [],
      //       freeTexts: [],
      //       virtualAccountTrxType: '',
      //       feeAmount: null,
      //       additionalInfo: {},
      //     },
      //   };
      //   return res.status(400).send(response);
      // }

      const paymentNew = payment.partnerServiceId.replace(/\s/g, '');
      const regexCheckStringContent = /^\+?\d*$/;
      const count = await this.logService.getRetryLog(payment.paymentRequestId);
      const paymentAlreadyPaid = count?.payment_already_paid;
      const retryCount = count?.retry_attempt + 1 || false;
      await this.logService.updateRetryLog(
        payment.paymentRequestId,
        retryCount,
      );

      if (!regexCheckStringContent.test(customerNo)) {
        const responseCode = '4002501';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Field Format { Customer No }';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Format { Customer No } tidak sesuai';
        paymentFlagReason.english = 'Invalid Field Format { Customer No }';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }
      if (
        !regexCheckStringContent.test(
          payment.virtualAccountNo.replace(/\s/g, ''),
        )
      ) {
        const responseCode = '4002501';
        const paymentFlagStatus = '01';
        const responseMessage = 'Invalid Field Format { Virtual Account No }';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia =
          'Format { Virtual Account No } tidak sesuai';
        paymentFlagReason.english =
          'Invalid Field Format { Virtual Account No }';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(400).send(response);
      }

      //   //get BankVACode
      //   isExistBankDetail = bankDetails != null ? true : false;
      //   const response = {
      //     responseCode: `4002401`,
      //     responseMessage: 'BrivaNum Doesn’t Exist',
      //   };

      // Pengecekan VA Nomor
      const company = payment.virtualAccountNo.replace(/\s/g, '');
      const companyVa = company.substring(0, 5);
      const custono = company.substring(5);

      this.logger.log('[ Start VA Nomor ]');
      let companycustomerNo;
      try {
        companycustomerNo = await this.billService.getProductCategory(custono);
        this.logger.log(
          '[ VA Nomor ] : ',
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
      if (
        retryCount > 1 &&
        (companyVa !== paymentNew ||
          (companycustomerNo == undefined && companySpaj == undefined))
      ) {
        const responseCode = '4042518';
        const responseMessage = 'Inconsistent Request';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.english = 'Inconsistent Payment Request';
        paymentFlagReason.indonesia = 'Request Payment tidak konsisten';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(404).send(response);
      }

      //   // // let resultBillAlready;
      //   // // try {
      //   // //   resultBillAlready = await this.billS.billAlready3(bill);
      //   // //   this.logger.log(
      //   // //     '[ Bill Payment With Status Already Pay 002 ] : ',
      //   // //     JSON.stringify(resultBillAlready, null, 2),
      //   // //   );
      //   // // } catch (error) {
      //   // //   throw new NotFoundException(error.message);
      //   // // }

      //   // if (
      //   //   resultLatestLog.retry_attempt == 1 &&
      //   //   resultLatestLog.request_id == payment.paymentRequestId
      //   // ) {
      //   //   responseCode = '4092400';
      //   //   responseMessage = 'Conflict';
      //   //   paymentFlagStatus = '01';
      //   //   paymentFlagReason.indonesia =
      //   //     'Tidak bisa menggunakan X-EXTERNAL-ID yang sama';
      //   //   paymentFlagReason.english = 'Cannot use the same X-EXTERNAL-ID';
      //   //   const response = {
      //   //     responseCode,
      //   //     responseMessage,
      //   //     virtualAccountData: {
      //   //       paymentFlagStatus,
      //   //       paymentFlagReason,
      //   //       partnerServiceId: payment.partnerServiceId,
      //   //       customerNo: payment.customerNo,
      //   //       virtualAccountNo: payment.virtualAccountNo,
      //   //       virtualAccountName: '',
      //   //       virtualAccountEmail: '',
      //   //       virtualAccountPhone: '',
      //   //       inquiryRequestId: payment.paymentRequestId,
      //   //       paidAmount: {
      //   //         currency: '',
      //   //         value: '',
      //   //       },
      //   //       subCompany: '',
      //   //       billDetails: [],
      //   //       freeTexts: [],
      //   //       virtualAccountTrxType: '',
      //   //       feeAmount: null,
      //   //       additionalInfo: {},
      //   //     },
      //   //   };
      //   //   return res.status(404).send(response);
      //   // }

      if (retryCount > 1 && paymentAlreadyPaid === '03') {
        await this.logService.updateIsPaymentPaid(
          payment.paymentRequestId,
          '04',
        );
        const responseCode = '4042518';
        const responseMessage = 'Inconsistent Request';
        const paymentFlagStatus = '00';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Sukses';
        paymentFlagReason.english = 'Success';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo:
              payment.partnerServiceId + payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(404).send(response);
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
        isExistEksternalId != null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
      ) {
        const responseCode = '4042518';
        const responseMessage = 'Inconsistent Request';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(404).send(response);
      }

      if (
        isExistEksternalId == null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
      ) {
        const responseCode = '4042518';
        const responseMessage = 'Inconsistent Request';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(404).send(response);
      }

      if (
        isExistEksternalId != null &&
        isTRID != null &&
        paymentAlreadyPaid === '04'
      ) {
        const responseCode = '4042518';
        const responseMessage = 'Inconsistent Request';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia = 'Tagihan Sudah Dibayarkan';
        paymentFlagReason.english = 'Bill Has Been Paid';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Bill Has Been Paid',
          },
        };
        return res.status(404).send(response);
      }
      //   // console.log(
      //   //   `Result Log Retry Attempt : ${resultLatestLog.retry_attempt}`,
      //   // );
      //   // console.log(`Result Log Request Id : ${resultLatestLog.request_id}`);
      //   // console.log(
      //   //   resultLatestLog.retry_attempt == 1 &&
      //   //     resultLatestLog.request_id != payment.paymentRequestId,
      //   // );
      //   // console.log(`Eksternal Id Same : ${isExistEksternalIdSame.request_id}`);
      //   // console.log(`Payment Request ID : ${payment.paymentRequestId}`);
      //   // console.log(
      //   //   isExistEksternalIdSame.request_id == payment.paymentRequestId,
      //   // );
      //   // console.log(
      //   //   resultLatestLog.retry_attempt == 1 &&
      //   //     isExistEksternalIdSame.request_id == payment.paymentRequestId,
      //   // );

      //   let isExistEksternalIdSame;
      //   try {
      //     isExistEksternalIdSame = await this.logRepo.findByEkternalIdSame(
      //       logInquiryBill,
      //     );
      //     this.logger.log(
      //       '[ Check Exist Eksternal ID ]',
      //       JSON.stringify(isExistEksternalId, null, 2),
      //     );
      //   } catch (error) {
      //     throw new NotFoundException(error.message);
      //   }

      const resultLatestLog = await this.logService.lastInsert();
      if (
        resultLatestLog.retry_attempt == 1 &&
        resultLatestLog.request_id != payment.paymentRequestId
      ) {
        const responseCode = '4092400';
        const responseMessage = 'Conflict';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.indonesia =
          'Tidak bisa menggunakan X-EXTERNAL-ID yang sama';
        paymentFlagReason.english = 'Cannot use the same X-EXTERNAL-ID';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Cannot use the same X-EXTERNAL-ID',
          },
        };
        return res.status(404).send(response);
      }

      //   // if (
      //   //   (resultLatestLog.retry_attempt == 1 &&
      //   //     resultLatestLog.request_id != payment.paymentRequestId) ||
      //   //   (paymentAlreadyPaid === '03' &&
      //   //     isExistEksternalIdSame.request_id == payment.paymentRequestId)
      //   // ) {
      //   //   responseCode = '4092400';
      //   //   responseMessage = 'Conflict';
      //   //   paymentFlagStatus = '01';
      //   //   paymentFlagReason.indonesia =
      //   //     'Tidak bisa menggunakan X-EXTERNAL-ID yang sama';
      //   //   paymentFlagReason.english = 'Cannot use the same X-EXTERNAL-ID';
      //   //   const response = {
      //   //     responseCode,
      //   //     responseMessage,
      //   //     virtualAccountData: {
      //   //       paymentFlagStatus,
      //   //       paymentFlagReason,
      //   //       partnerServiceId: payment.partnerServiceId,
      //   //       customerNo: payment.customerNo,
      //   //       virtualAccountNo: payment.virtualAccountNo,
      //   //       virtualAccountName: '',
      //   //       virtualAccountEmail: '',
      //   //       virtualAccountPhone: '',
      //   //       inquiryRequestId: payment.paymentRequestId,
      //   //       paidAmount: {
      //   //         currency: '',
      //   //         value: '',
      //   //       },
      //   //       subCompany: '',
      //   //       billDetails: [],
      //   //       freeTexts: [],
      //   //       virtualAccountTrxType: '',
      //   //       feeAmount: null,
      //   //       additionalInfo: {},
      //   //     },
      //   //   };
      //   //   return res.status(404).send(response);
      //   // }

      if (
        companyVa !== paymentNew ||
        (companycustomerNo == undefined && companySpaj == undefined)
      ) {
        //  tambahin instert ke table log
        await this.logService.saveorUpdateLogInquiryBillByRequestBRI(payment);
        const responseCode = '4042512';
        const responseMessage = 'Invalid Bill/Virtual Account [Not Found]';
        const paymentFlagStatus = '01';
        const paymentFlagReason: PaymentFlagReason = {
          english: 'English reason',
          indonesia: 'Indonesian reason',
        };
        paymentFlagReason.english = 'Bill not found';
        paymentFlagReason.indonesia = 'Tagihan tidak ditemukan';
        const response = {
          responseCode,
          responseMessage,
          virtualAccountData: {
            partnerServiceId: payment.partnerServiceId,
            customerNo: payment.customerNo,
            virtualAccountNo: payment.virtualAccountNo,
            virtualAccountName: payment.virtualAccountName,
            paymentRequestId: payment.paymentRequestId,
            paidAmount: {
              currency: '',
              value: '',
            },
            paymentFlagStatus,
            paymentFlagReason,
            // subCompany: '',
            // billDetails: [],
            // freeTexts: [],
            // virtualAccountTrxType: '',
            // feeAmount: null,
            // additionalInfo: {},
          },
          additionalInfo: {
            idApp: payment.additionalInfo.idApp,
            passApp: payment.additionalInfo.passApp,
            info1: 'Invalid Mandatory Field Payment Request Id',
          },
        };
        return res.status(404).send(response);
      }

      this.logger.log('[ Start Bank Details ]');
      let isExistBankDetail = false;
      let bankDetails;
      try {
        bankDetails = await this.bankService.findBankDetailByVaCode(
          bankDetail.bank_code,
        );
        this.logger.log(
          '[ Bank Details ] : ',
          JSON.stringify(bankDetails, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }
      isExistBankDetail = bankDetails != null ? true : false;

      this.logger.log('[ Start Is SPAJ ]');
      let isSPAJ;
      try {
        isSPAJ = await this.spajService.getSpajNo(spaj);
        this.logger.log('[ Is SPAJ ] : ', JSON.stringify(isSPAJ, null, 2));
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

      //Replace No Polis
      this.logger.log('[ Start Check Bill ]');
      let checkBill;
      try {
        checkBill = await this.billService.getBill(billC);
        this.logger.log(
          '[ Check Bill ] : ',
          JSON.stringify(checkBill, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      this.logger.log('[ Check Bill Payment With Status Already Pay 002 ]');
      let resultBillAlready;
      try {
        resultBillAlready = await this.billService.billBRIAlready(billC);
        this.logger.log(
          '[ Bill Payment With Status Already Pay 002 ] : ',
          JSON.stringify(resultBillAlready, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      this.logger.log('[ Check Bill Payment With Status Already Pay 003 ]');
      let resultBillAlready2;
      try {
        resultBillAlready2 = await this.billService.billBRIAlready2(billC);
        this.logger.log(
          '[ Bill Payment With Status Already Pay 003 ] : ',
          JSON.stringify(resultBillAlready2, null, 2),
        );
      } catch (error) {
        throw new NotFoundException(error.message);
      }

      if (isExistBankDetail) {
        if (payment.partnerServiceId.trim() == newBusiness) {
          this.logger.log('[ Start Request Payment New Business ]');
          if (isSPAJ != null) {
            // await this.logService.updateIsPaymentPaid(
            //   payment.paymentRequestId,
            //   '03',
            // );
            //Insert BillPayment
            this.logger.log('[ Start Insert Bill Payment ]');
            try {
              await this.billPaymentService.saveBillBRI(payment);
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Bill Payment Id ]');
            let billPaymentId;
            try {
              billPaymentId = await this.billPaymentService.findByBillPaymentId(
                billPayment,
              );
              this.logger.log(
                '[ Bill Payment Id ] : ',
                JSON.stringify(billPaymentId, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            // Get Bank Detail Properties [bank_core_code, received_mode_PL]
            this.logger.log('[ Start Bank Detail Properties ]');
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

            //get BankStatement
            this.logger.log('[ Start Bank Statement ]');
            let bankStatementNo;
            try {
              bankStatementNo =
                await this.bankService.generateBankStatementSeqNo(bankS);
              this.logger.log(
                '[ Bank Detail Properties ] : ',
                JSON.stringify(bankStatementNo, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Bank Account Received ]');
            let bankAccountReceived;
            try {
              bankAccountReceived =
                await this.bankService.findBankAccountReceived(
                  bank.bankCoreCode,
                  bank.receivedModePL,
                  'IDR',
                  'TL',
                );
              this.logger.log(
                '[ Bank Account Received ] : ',
                JSON.stringify(bankAccountReceived, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            await this.logService.updateIsPaymentPaid(
              payment.paymentRequestId,
              '03',
            );

            const statement_date = formatISO(new Date(payment.trxDateTime), {
              representation: 'date',
            });

            let lastInsert;
            //UPDATE STATUS ON BILL
            this.logger.log('[ Start Last Insert ]');
            try {
              lastInsert = await this.billService.lastInsert();
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
            const paymentSettlement: PaymentRequestBody = {
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
              '[Created settlement PL obj] : ',
              paymentSettlement,
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
                JSON.stringify(error.message, null, 2),
              );
              throw error;
            }

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
              'pl.bri',
              payload,
              headers,
              billPaymentIds,
              payment.customerNo,
              billPaymentId.bill_payment_id,
              payment.paymentRequestId,
              requestBodyJson,
            );
            // responsePL = axios.post(url, dataPL, { headers });
            // this.logger.log('[ Published event send to PL ] : ', responsePL);

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
            //     JSON.stringify(error.message, null, 2),
            //   );
            //   throw error;
            // }

            // // Insert t_log_core_transaction for logging transaction to PL
            // const logCoreTransaction = new LogCore();
            // logCoreTransaction.customerNumber = payment.customerNo;
            // logCoreTransaction.billPaymentId = billPaymentId.bill_payment_id;
            // logCoreTransaction.requestId = payment.paymentRequestId;
            // logCoreTransaction.response = responseBodyJson;
            // logCoreTransaction.request = requestBodyJson;
            // await this.logCoreService.saveLogCore(logCoreTransaction);
            // this.logger.log(
            //   '[ Saving log_core_transaction ]    : ',
            //   JSON.stringify(logCoreTransaction, null, 2),
            // );

            const responseCode = '2002500';
            const responseMessage = 'Successful';
            const paymentResponse = new ResponsePayment();
            paymentResponse.virtualAccountData = {};
            paymentResponse.virtualAccountData.partnerServiceId =
              payment.partnerServiceId;
            paymentResponse.virtualAccountData.customerNo = payment.customerNo;
            paymentResponse.virtualAccountData.virtualAccountNo =
              payment.virtualAccountNo;
            paymentResponse.virtualAccountData.virtualAccountName =
              'PT Equity Life Indonesia';
            paymentResponse.virtualAccountData.paymentRequestId =
              payment.paymentRequestId;
            paymentResponse.virtualAccountData.paidAmount = {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            };
            const paymentFlagStatus = '00';
            const paymentFlagReason: PaymentFlagReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            paymentFlagReason.english = 'Success';
            paymentFlagReason.indonesia = 'Sukses';
            // paymentResponse.virtualAccountData.additionalInfo = {
            //   idApp: payment.additionalInfo.idApp,
            //   passApp: payment.additionalInfo.passApp,
            //   info1: 'SPAJ',
            // };
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                partnerServiceId:
                  paymentResponse.virtualAccountData.partnerServiceId,
                customerNo: paymentResponse.virtualAccountData.customerNo,
                virtualAccountNo:
                  paymentResponse.virtualAccountData.virtualAccountNo,
                virtualAccountName:
                  paymentResponse.virtualAccountData.virtualAccountName,
                paymentRequestId:
                  paymentResponse.virtualAccountData.paymentRequestId,
                paidAmount: paymentResponse.virtualAccountData.paidAmount,
                paymentFlagStatus,
                paymentFlagReason,
                // additionalInfo:
                //   paymentResponse.virtualAccountData.additionalInfo,
              },
              additionalInfo: {
                idApp: payment.additionalInfo.idApp,
                passApp: payment.additionalInfo.passApp,
                info1: 'SPAJ',
              },
            };
            this.logger.log('[Payment SPAJ Number has been successfully]');
            return res.status(200).send(response);
          } else if (isBillHavePaid == null) {
            const response = {
              responseCode: `4042519`,
              responseMessage: 'Bill expired',
            };
            this.logger.error('[Bill expired]');
            return res.status(404).send(response);
          } else {
            const response = {
              responseCode: `4042414`,
              responseMessage: 'SPAJ not found',
            };
            this.logger.error('[SPAJ not found]');
            return res.status(404).send(response);
          }
        } else if (payment.partnerServiceId.trim() == renewal) {
          this.logger.log('[ Start Request Payment Renewal ]');
          if (checkBill[0] != null) {
            const resultBill = await this.billService.findDueDateBRI(billC);
            this.logger.log('[ Result Bill ] : ', resultBill);
            let due_date;
            let formattedDueDate;
            if (resultBill != null) {
              due_date = resultBill.due_date;
              formattedDueDate = format(due_date, 'yyyy-MM-dd');
              this.logger.error(
                '[ Result Bill In ] : ',
                JSON.stringify(formattedDueDate, null, 2),
              );
            } else {
              const resultBillCurrentDate =
                await this.billService.currentDate();
              due_date = resultBillCurrentDate.due_date;
              formattedDueDate = due_date;
              this.logger.error('[ Result Bill Not In Today ]');
            }
            billC.due_date = formattedDueDate;

            this.logger.log('[ Start Check Total Standing Renewal ]');
            let totalStading;
            try {
              totalStading = await this.billService.totalOutStandingBRI(billC);
              this.logger.log(
                '[ Total Standing ] : ',
                JSON.stringify(totalStading, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Insert T Bill Payment ]');
            try {
              await this.billPaymentService.saveBillBRIRe(payment);
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start VALID BILL ]');
            const paid = payment.paidAmount.value;
            const convertPaid = Number(paid);
            if (convertPaid !== totalStading.total_outstanding) {
              const response = {
                responseCode: `4042513`,
                responseMessage: 'Invalid amount',
              };
              return res.status(404).send(response);
            }

            this.logger.log('[ Start Bank Statement Seq No ]');
            let bankStatemenNo;
            try {
              bankStatemenNo =
                await this.bankService.generateBankStatementSeqNo(bankS);
              this.logger.log(
                '[ Bank Statement Seq No ] : ',
                JSON.stringify(bankStatemenNo, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            const statement_date = formatISO(new Date(payment.trxDateTime), {
              representation: 'date',
            });

            //get BankStatement
            const bankStatementSeqNo = bankStatemenNo.bankStatementSeqNo;

            this.logger.log('[ Start Policy Holder ]');
            let policyHolder;
            try {
              policyHolder = await this.billService.getBill(billC);
              this.logger.log(
                '[ Policy Holder ] : ',
                JSON.stringify(policyHolder, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Bank Detail Va Code ]');
            let bank;
            try {
              bank = await this.bankService.findBankDetailByVaCode(
                bankDetail.bank_code,
              );
              this.logger.log(
                '[ Bank Detail Va Code ] : ',
                JSON.stringify(bank, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Product Category ]');
            let getProductCategory;
            try {
              getProductCategory = await this.billService.getProductCategory(
                payment.customerNo,
              );
              this.logger.log(
                '[ Product Category ] : ',
                JSON.stringify(getProductCategory, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            this.logger.log('[ Start Bank Account Received ]');
            let bankAccountReceived;
            try {
              bankAccountReceived =
                await this.bankService.findBankAccountReceived(
                  bank.bankCoreCode,
                  bank.receivedModePL,
                  payment.paidAmount.currency,
                  getProductCategory.product_category,
                );
              this.logger.log(
                '[ Bank Account Received ] : ',
                JSON.stringify(bankAccountReceived, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }

            await this.logService.updateIsPaymentPaid(
              payment.paymentRequestId,
              '03',
            );

            const convertPaymount = Math.floor(
              parseFloat(payment.paidAmount.value),
            );

            // Generate JSON for sending PL transaction
            const paymentSettlement: PaymentRequestBody = {
              data: {
                payor_name: policyHolder[0].policy_holder.replace(/'/g, "''"),
                collected_by: 'AUTO_SYS',
                location: 'FINAN',
                statement_date: statement_date,
                bank_statement_sequence_number: bankStatementSeqNo,
                remarks: '',
                receive_mode: bank.receivedModePL,
                collection_bank: bank.bankCoreCode,
                currency: payment.paidAmount.currency,
                product_category: getProductCategory.product_category,
                bank_account_number: bankAccountReceived.account_no,
                payee_bank: '',
                cheque_or_cc_no: '',
                cheque_date: '',
                approval_code: '',
                receive_amount: convertPaymount.toString(),
                proposal_no: '',
                policy_no: getProductCategory.policy_no,
                allocation: getProductCategory.allocation,
                allocation_remark: getProductCategory.allocation_remarks,
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
              paymentSettlement,
            );

            // Generate request from Java objects to JSON string for saving to DB
            let requestBodyJson: string | null = null;
            try {
              requestBodyJson = JSON.stringify(paymentSettlement);
              this.logger.log(
                '[ Request Body] : ',
                JSON.stringify(requestBodyJson, null, 2),
              );
            } catch (error) {
              console.error(
                '[Error Parsing JSON Request PL to String]: ',
                'error',
                JSON.stringify(error, null, 2),
              );
              throw error;
            }

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
            this.logger.log('[ Start Find Bill Payment ID ]');
            // let billPaymentId;
            // try {
            //   billPaymentId = await this.billPaymentService.findByBillPaymentId(
            //     billPayment,
            //   );
            //   this.logger.log(
            //     '[ Find Bill Payment ID ] : ',
            //     JSON.stringify(billPaymentId, null, 2),
            //   );
            // } catch (error) {
            //   throw new NotFoundException(error.message);
            // }
            // const account = bankAccountReceived.account_no;
            // await this.billPaymentService.statusUpdateBillPayment(
            //   billPaymentId,
            //   account,
            // );
            let lastInsert;
            //UPDATE STATUS ON BILL
            this.logger.log('[ Start Last Insert ]');
            try {
              lastInsert = await this.billService.lastInsert();
              this.logger.log(
                '[ Last Insert ] : ',
                JSON.stringify(lastInsert, null, 2),
              );
            } catch (error) {
              throw new NotFoundException(error.message);
            }
            let billPaymentId;
            const account = bankAccountReceived.account_no;
            billPaymentId = lastInsert[0].lastInsertId;
            await this.billPaymentService.statusUpdateBillPayment(
              billPaymentId,
              account,
            );

            const payload = {
              url: url,
              dataPL: dataPL,
            };

            this.eventEmitter.emit(
              'pl.bri',
              payload,
              headers,
              billPaymentId,
              payment.customerNo,
              billPaymentId,
              payment.paymentRequestId,
              requestBodyJson,
            );
            // responsePL = axios.post(url, dataPL, { headers });
            // this.logger.log('[ Published event send to PL ] : ', responsePL);

            //Update status payment Renewal
            await this.billService.updateStatusBill(billC);
            this.logger.log('[Update status bill to STAT000002]');

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
            //     JSON.stringify(error.message, null, 2),
            //   );
            //   throw error;
            // }

            // // Insert t_log_core_transaction for logging transaction to PL
            // const logCoreTransactionDto = new LogCore();
            // logCoreTransactionDto.customerNumber = payment.customerNo;
            // logCoreTransactionDto.billPaymentId = billPaymentId.bill_payment_id;
            // logCoreTransactionDto.requestId = payment.paymentRequestId;
            // logCoreTransactionDto.response = responseBodyJson;
            // logCoreTransactionDto.request = requestBodyJson;
            // await this.logCoreService.saveLogCore(logCoreTransactionDto);
            // this.logger.log(
            //   '[ Saving log_core_transaction ]    : ',
            //   JSON.stringify(logCoreTransactionDto, null, 2),
            // );

            const responseCode = '2002500';
            const responseMessage = 'Successful';
            const paymentResponse = new ResponsePayment();
            paymentResponse.virtualAccountData = {};
            paymentResponse.virtualAccountData.partnerServiceId =
              payment.partnerServiceId;
            paymentResponse.virtualAccountData.customerNo = payment.customerNo;
            paymentResponse.virtualAccountData.virtualAccountNo =
              payment.virtualAccountNo;
            paymentResponse.virtualAccountData.virtualAccountName =
              payment.virtualAccountName;
            paymentResponse.virtualAccountData.paymentRequestId =
              payment.paymentRequestId;
            paymentResponse.virtualAccountData.paidAmount = {
              value: payment.paidAmount.value,
              currency: payment.paidAmount.currency,
            };
            const paymentFlagStatus = '00';
            const paymentFlagReason: PaymentFlagReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            paymentFlagReason.english = 'Success';
            paymentFlagReason.indonesia = 'Sukses';
            // paymentResponse.virtualAccountData.additionalInfo = {
            //   idApp: payment.additionalInfo.idApp,
            //   passApp: payment.additionalInfo.passApp,
            //   info1: 'Tagihan',
            // };
            const response = {
              responseCode,
              responseMessage,
              virtualAccountData: {
                partnerServiceId:
                  paymentResponse.virtualAccountData.partnerServiceId,
                customerNo: paymentResponse.virtualAccountData.customerNo,
                virtualAccountNo:
                  paymentResponse.virtualAccountData.virtualAccountNo,
                virtualAccountName:
                  paymentResponse.virtualAccountData.virtualAccountName,
                paymentRequestId:
                  paymentResponse.virtualAccountData.paymentRequestId,
                paidAmount: paymentResponse.virtualAccountData.paidAmount,
                paymentFlagStatus,
                paymentFlagReason,
                // additionalInfo:
                //   paymentResponse.virtualAccountData.additionalInfo,
              },
              additionalInfo: {
                idApp: payment.additionalInfo.idApp,
                passApp: payment.additionalInfo.passApp,
                info1: 'Tagihan',
              },
            };
            this.logger.log('[Payment Policy Number has been successfully]');
            return res.status(200).send(response);
          } else if (resultBillAlready != null) {
            const paymentFlagStatus = '01';
            const responseMessage = 'Bill has been paid';
            const paymentFlagReason: PaymentFlagReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            paymentFlagReason.english = 'Already Paid';
            paymentFlagReason.indonesia = 'Tagihan Sudah Dibayar';
            this.logger.error('Have No Bill');
            const response = {
              responseCode: '4042414',
              responseMessage: responseMessage,
              virtualAccountData: {
                // paymentFlagReason,
                // partnerServiceId: payment.partnerServiceId,
                // customerNo: payment.customerNo,
                // virtualAccountNo: payment.virtualAccountNo,
                // virtualAccountName: payment.virtualAccountName,
                // virtualAccountEmail: payment.virtualAccountEmail,
                // virtualAccountPhone: payment.virtualAccountPhone,
                // trxId: payment.trxId,
                // paymentRequestId: payment.paymentRequestId,
                // paidAmount: payment.paidAmount,
                // paidBills: payment.paidBills,
                // totalAmount: payment.totalAmount,
                // trxDateTime: payment.trxDateTime,
                // referenceNo: payment.referenceNo,
                // journalNum: payment.journalNum,
                // paymentType: payment.paymentType,
                // flagAdvise: payment.flagAdvise,
                // paymentFlagStatus,
                // billDetails: [],
                // freeTexts: [],
                partnerServiceId: payment.partnerServiceId,
                customerNo: payment.customerNo,
                virtualAccountNo: payment.virtualAccountNo,
                virtualAccountName: payment.virtualAccountName,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: {
                  value: payment.paidAmount.value,
                  currency: payment.paidAmount.currency,
                },
                paymentFlagStatus,
                paymentFlagReason,
              },
              additionalInfo: {
                idApp: payment.additionalInfo.idApp,
                passApp: payment.additionalInfo.passApp,
                info1: 'Already Paid',
              },
            };
            return res.status(404).send(response);
          } else if (resultBillAlready2 != null) {
            const paymentFlagStatus = '01';
            const responseMessage = 'Bill has been paid';
            const paymentFlagReason: PaymentFlagReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            paymentFlagReason.english = 'Already Paid';
            paymentFlagReason.indonesia = 'Tagihan Sudah Dibayar';
            this.logger.error('Have No Bill');
            const response = {
              responseCode: '4042414',
              responseMessage: responseMessage,
              virtualAccountData: {
                // paymentFlagReason,
                // partnerServiceId: payment.partnerServiceId,
                // customerNo: payment.customerNo,
                // virtualAccountNo: payment.virtualAccountNo,
                // virtualAccountName: payment.virtualAccountName,
                // virtualAccountEmail: payment.virtualAccountEmail,
                // virtualAccountPhone: payment.virtualAccountPhone,
                // trxId: payment.trxId,
                // paymentRequestId: payment.paymentRequestId,
                // paidAmount: payment.paidAmount,
                // paidBills: payment.paidBills,
                // totalAmount: payment.totalAmount,
                // trxDateTime: payment.trxDateTime,
                // referenceNo: payment.referenceNo,
                // journalNum: payment.journalNum,
                // paymentType: payment.paymentType,
                // flagAdvise: payment.flagAdvise,
                // paymentFlagStatus,
                // billDetails: [],
                // freeTexts: [],
                partnerServiceId: payment.partnerServiceId,
                customerNo: payment.customerNo,
                virtualAccountNo: payment.virtualAccountNo,
                virtualAccountName: payment.virtualAccountName,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: {
                  value: payment.paidAmount.value,
                  currency: payment.paidAmount.currency,
                },
                paymentFlagStatus,
                paymentFlagReason,
              },
              additionalInfo: {
                idApp: payment.additionalInfo.idApp,
                passApp: payment.additionalInfo.passApp,
                info1: 'Already Paid',
              },
            };
            return res.status(404).send(response);
          } else {
            // this.logger.error('[Payment Policy Number failed!]');
            // const response = {
            //   responseCode: `4002401`,
            //   responseMessage: 'Bill not found',
            // };
            // return res.status(400).send(response);
            const paymentFlagStatus = '01';
            const responseMessage = 'Failed';
            const paymentFlagReason: PaymentFlagReason = {
              english: 'English reason',
              indonesia: 'Indonesian reason',
            };
            paymentFlagReason.english = 'Bill not found';
            paymentFlagReason.indonesia = 'Tagihan tidak ditemukan';
            this.logger.error('[ Gagal Update Status ]');
            const response = {
              responseCode: '4042414',
              responseMessage: responseMessage,
              virtualAccountData: {
                partnerServiceId: payment.partnerServiceId,
                customerNo: payment.customerNo,
                virtualAccountNo: payment.virtualAccountNo,
                virtualAccountName: payment.virtualAccountName,
                paymentRequestId: payment.paymentRequestId,
                paidAmount: {
                  value: payment.paidAmount.value,
                  currency: payment.paidAmount.currency,
                },
                paymentFlagStatus,
                paymentFlagReason,
                // paymentFlagReason,
                // partnerServiceId: payment.partnerServiceId,
                // customerNo: payment.customerNo,
                // virtualAccountNo: payment.virtualAccountNo,
                // virtualAccountName: payment.virtualAccountName,
                // virtualAccountEmail: payment.virtualAccountEmail,
                // virtualAccountPhone: payment.virtualAccountPhone,
                // trxId: payment.trxId,
                // paymentRequestId: payment.paymentRequestId,
                // paidAmount: payment.paidAmount,
                // paidBills: payment.paidBills,
                // totalAmount: payment.totalAmount,
                // trxDateTime: payment.trxDateTime,
                // referenceNo: payment.referenceNo,
                // journalNum: payment.journalNum,
                // paymentType: payment.paymentType,
                // flagAdvise: payment.flagAdvise,
                // paymentFlagStatus,
                // billDetails: [],
                // freeTexts: [],
              },
              additionalInfo: {
                idApp: payment.additionalInfo.idApp,
                passApp: payment.additionalInfo.passApp,
                info1: 'Bill not found',
              },
            };
            return res.status(404).send(response);
          }
        }
      }
      // return res.status(400).send(response);
    } catch (error) {
      this.logger.error(
        '[ Error payment proccess] : ',
        'error',
        JSON.stringify(error.message, null, 2),
      );
      const response = {
        responseCode: '5002500',
        responseMessage: 'General Error',
      };
      return res.status(500).send(response);
    }
  }

  @OnEvent('pl.bri')
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
      responsePL = await axios.post(payload.url, payload.dataPL, { headers });
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
          JSON.stringify(error.message, null, 2),
        );
        throw error;
      }

      // Insert t_log_core_transaction for logging transaction to PL
      const logCoreTransaction = new LogCore();
      logCoreTransaction.customerNumber = customerno;
      logCoreTransaction.billPaymentId = logBillPayemnt;
      logCoreTransaction.requestId = paymentRequestId;
      logCoreTransaction.response = responseBodyJson;
      logCoreTransaction.request = requestbodyJson;
      await this.logCoreService.saveLogCore(logCoreTransaction);
      this.logger.log(
        '[ Saving log_core_transaction ]    : ',
        JSON.stringify(logCoreTransaction, null, 2),
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
