import { Body, Controller, Post } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankAccountReceived } from 'src/dto/bank_account_received';
import { BankStatementSeqNo } from 'src/dto/bank_statement_seq_no';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async findBankDetailByVaCode() {
    return this.bankService.findBankDetailByVaCode2();
  }

  @Post('/account')
  async findBankAccountReceived() {
    // @Body() bankAccountReceived: BankAccountReceived,
    const collectionBankCode = '148';
    const receivedMode = 'VBCA';
    const currency = 'IDR';
    const productCategory = 'TL';
    return this.bankService.findBankAccountReceived(
      collectionBankCode,
      receivedMode,
      currency,
      productCategory,
    );
  }

  // @Post('/onpl')
  // async getExistProposalOnPL2() {
  //   return this.bankService.getExistProposalOnPL2();
  // }

  @Post('/bank-statement')
  async generateBankStatementSeqNo(@Body() bankStatement: BankStatementSeqNo) {
    return this.bankService.generateBankStatementSeqNo(bankStatement);
  }
}
