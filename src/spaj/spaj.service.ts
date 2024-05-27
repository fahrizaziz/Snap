import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { SPAJ } from 'src/dto/spaj';

@Injectable()
export class SpajService {
  constructor(private connectionService: ConnectionService) {}

  async spajNo(spaj: SPAJ) {
    const query = `
    SELECT * FROM t_spaj WHERE spaj_no = '${spaj.customer_no}' AND status = '01';
    `;
    try {
      const result = await this.connectionService.query(query);
      if (result.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error.message);
    }
  }

  async spajNotValid(spaj: SPAJ) {
    const query = `
      SELECT TOP 1 * FROM t_spaj 
      WHERE status = '02' 
      AND spaj_no = '${spaj.customer_no}'
    `;

    const result = await this.connectionService.query(query);
    if (result.length > 0) {
      return true;
    }
    return false;
  }

  async spajAlready(spaj: SPAJ) {
    const query = `
    SELECT TOP 1 * FROM t_spaj 
    WHERE status = '02' 
    AND spaj_no = '${spaj.customer_no}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }

  async getSpajNo(spaj: SPAJ) {
    const query = `
      SELECT TOP 1 * FROM t_spaj 
      WHERE status = '01' 
      AND spaj_no = '${spaj.spaj_no}'
    `;

    const result = await this.connectionService.query(query);
    return result[0];
    // const result = await this.connectionService.query(query);
    // if (result.length > 0) {
    //   return true;
    // }

    // return false;
  }

  async getSpajCust(spajNo: string) {
    const query = `
      SELECT TOP 1 * FROM t_spaj 
      WHERE spaj_no = '${spajNo}'
    `;
    const result = await this.connectionService.query(query);
    return result[0];
  }
}
