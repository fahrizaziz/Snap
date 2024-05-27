import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { BankVa } from 'src/dto/va-bank';

@Injectable()
export class VaBankService {
  constructor(private connectionService: ConnectionService) {}

  async getBankVa(vaBank: BankVa) {
    const vabank = vaBank.bank_va_code;
    const num = vabank.replace(/\s/g, '');
    const complexSql = `
      SELECT TOP 1 *
      FROM m_bank_va
      WHERE is_active = '1' AND bank_va_code = '${num}' AND va_type = 'OPENAMOUNT' AND reference_type = 'SPAJ'
    `;
    try {
      const result = await this.connectionService.query(complexSql);
      if (result.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getBankVaBRI(vaBank: BankVa) {
    const vabank = vaBank.bank_va_code;
    const num = vabank.replace(/\s/g, '');
    const complexSql = `
      SELECT TOP 1 *
      FROM m_bank_va
      WHERE is_active = '1' AND bank_va_code = '${num}'
    `;
    try {
      const result = await this.connectionService.query(complexSql);
      if (result.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getBankVaProd(vaBank: BankVa) {
    const vabank = vaBank.bank_va_code;
    const num = vabank.replace(/\s/g, '');
    const complexSql = `
      SELECT TOP 1 *
      FROM m_bank_va_prod_cat
      WHERE is_active = '1' AND bank_va_code = '${num}'
    `;
    const result = await this.connectionService.query(complexSql);
    if (result.length > 0) {
      return true;
    }

    return false;
  }

  async getBankVaRe(vaBank: BankVa) {
    const vabank = vaBank.bank_va_code;
    const num = vabank.replace(/\s/g, '');
    const complexSql = `
      SELECT COUNT(*) AS total_row
      FROM m_bank_va
      WHERE is_active = '1' AND bank_va_code = '${num}'
    `;
    const result = await this.connectionService.query(complexSql);
    return result[0];
  }

  async getvaBank(vaBank: string) {
    const complexSql = `
      SELECT COUNT(*) AS total_row
      FROM m_bank_va
      WHERE is_active = '1' AND bank_va_code = '${vaBank}'
    `;
    const result = await this.connectionService.query(complexSql);
    return result[0];
  }

  async getBankVaProdRe(vaBank: BankVa) {
    const vabank = vaBank.bank_va_code;
    const num = vabank.replace(/\s/g, '');
    const complexSql = `
      SELECT *
      FROM m_bank_va_prod_cat
      WHERE is_active = '1' AND bank_va_code = '${num}'
    `;
    try {
      const result = await this.connectionService.query(complexSql);
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
}
