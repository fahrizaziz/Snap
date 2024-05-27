import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { BankChannel } from 'src/dto/bank_channel';

@Injectable()
export class BankChannelService {
  constructor(private connectionService: ConnectionService) {}

  async getBankChannel(bankChannel: BankChannel) {
    const query = `
        SELECT TOP 1 * FROM m_bank_channel 
        WHERE is_active = 1 
        AND bank_channel_code = '${bankChannel.bank_channel_code}'
    `;
    const result = await this.connectionService.query(query);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
