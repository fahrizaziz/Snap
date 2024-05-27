import { Injectable } from '@nestjs/common';
import { ConnectionDbLinkService } from 'src/connection-db-link/connection-db-link.service';
import { ConnectionService } from 'src/connection/connection.service';
import { Bank } from 'src/dto/bank';
import { BankAccountReceived } from 'src/dto/bank_account_received';
// import { BankDetail } from 'src/dto/bank_detail';
import { BankStatementSeqNo } from 'src/dto/bank_statement_seq_no';

@Injectable()
export class BankService {
  constructor(
    private connectionService: ConnectionService,
    private connectionDbLinkService: ConnectionDbLinkService,
  ) {}

  async findBankDetailByVaCode(bankVaCode: string) {
    const bankVa = bankVaCode.replace(/\s/g, '');
    const query = `
        SELECT bank_code AS bankCode,
        core_code AS bankCoreCode,
        bank_name AS bankName,
        bi_code AS biCode,
        received_mode_PL AS receivedModePL
        FROM v_detail_bank
        WHERE bank_va_code = '${bankVa}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async findBankDetailByVaCode2() {
    const query = `
        SELECT bank_code AS bankCode,
        core_code AS bankCoreCode,
        bank_name AS bankName,
        bi_code AS biCode,
        received_mode_PL AS receivedModePL
        FROM v_detail_bank
    `;

    const result = await this.connectionService.query(query);
    return result[0];
  }

  async findBankAccountReceived(
    collectionBankCode: string,
    receivedMode: string,
    currency: string,
    productCategory: string,
  ) {
    try {
      const query = `
      SELECT * FROM PAYMENT.view_account_received_bank_individu
      WHERE collection_bank_code = '${collectionBankCode}'
            AND received_mode = '${receivedMode}'
            AND currency = '${currency}'
            AND product_category_code = '${productCategory}'
    `;
      const result = await this.connectionDbLinkService.queryDbLink(query);
      return result[0];
    } catch (error) {
      console.log(error.message);
    }
  }

  async getExistProposalOnPL(proposalNo: string) {
    const query = `
      SELECT * FROM PAYMENT.func_get_data_spaj_individu (${proposalNo})
    `;
    const result = await this.connectionDbLinkService.queryDbLink(query);
    const respons = {
      data: result,
    };
    return respons;
  }

  async isExistPremiumOnPL(spajNo: string, bankStateSeqNo: string) {
    const query = `
      SELECT * FROM [PAYMENT].[func_get_data_premium_received_individu_table_valued_by_spaj] (${spajNo}, ${bankStateSeqNo})
    `;

    const result = await this.connectionDbLinkService.queryDbLink(query);

    return result.length > 0 ? true : false;
  }

  async generateBankStatementSeqNo(bankStatement: BankStatementSeqNo) {
    const bankVa = bankStatement.bankVaCode.replace(/\s/g, '');
    const query = `
    DECLARE	@return_value int

    EXEC	@return_value = [dbo].[f_generate_bank_statement_no]
        @bankVaCode = N'${bankVa}'
    
    SELECT	'Return Value' = @return_value
    `;

    const output = await this.connectionService.query(query);
    const bankStatementSeqNo = {
      bankStatementSeqNo: output[0].bank_statement_seq_no,
      seqNumber: output[0].seq_number,
      seqNumberZero: output[0].seq_number_zero,
    };

    return bankStatementSeqNo;
  }

  async getBankID(bank: Bank) {
    const query = `
      SELECT TOP 1 * FROM m_bank WHERE is_active = '1' AND bi_code = '${bank.bank_id}'
    `;
    const result = await this.connectionService.query(query);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
