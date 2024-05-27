import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as jsonminify from 'jsonminify';
import { createHmac } from 'crypto';
import { ConnectionService } from 'src/connection/connection.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private connectionService: ConnectionService,
    private logger: LoggerService,
  ) {}

  async createToken(payload: string): Promise<any> {
    const accessToken = this.jwtService.sign({ payload });
    return { access_token: accessToken };
  }

  createHexToken() {
    const characters = '0123456789ABCDEF';
    const tokenLength = 16;
    let token = '';

    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return { access_token: token };
  }

  validateHexToken(token: string): boolean {
    const tokenLength = 16;
    const hexRegex = /^[0-9A-Fa-f]+$/;
    return token.length === tokenLength && hexRegex.test(token);
  }

  async validateClientKey(clientId: string): Promise<boolean> {
    const query = `SELECT * FROM m_oauth_key WHERE client_id = '${clientId}'`;
    const result = await this.connectionService.query(query);
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async validateClientKeyBank(clientId: string): Promise<boolean> {
    const query = `SELECT * FROM m_oauth_key WHERE client_id_bank = '${clientId}'`;
    const result = await this.connectionService.query(query);
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async validateToken(clientId: string): Promise<any> {
    const query = `SELECT * FROM m_oauth_key WHERE client_id = '${clientId}'`;
    const result = await this.connectionService.query(query);
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  isTokenExpired(token: any): any {
    try {
      // const originalToken = Buffer.from(token, 'hex').toString('utf-8');
      const verify = this.jwtService.verify(token);
      const issuedAt = new Date(verify.iat * 1000);
      const expAt = new Date(verify.exp * 1000);
      return {
        isExpired: false,
        payload: verify.payload,
        issued_at: issuedAt,
        exp_at: expAt,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          isExpired: true,
        };
      } else {
        throw error;
      }
    }
  }

  async generateSignature(client_id: string, timestamp: any) {
    try {
      const query = `SELECT private_key_bank from m_oauth_key where client_id = '${client_id}'`;
      const privateKey = await this.connectionService.query(query);
      const sign = crypto.createSign('RSA-SHA256');
      const stringToSign = client_id + '|' + timestamp;
      // const bufferData = Buffer.from(stringToSign, 'utf-8');
      // const encryptedData = crypto.publicEncrypt(publicKey, bufferData);
      // return encryptedData.toString('base64');
      sign.update(stringToSign);
      return sign.sign(privateKey[0].private_key_bank, 'base64');
    } catch (error) {
      console.error('Error generating signature:', error.message);
      throw error;
    }
  }

  async generateSignatureBank(client_id: string, timestamp: any) {
    try {
      const query = `SELECT private_key_bank from m_oauth_key where client_id_bank = '${client_id}'`;
      const privateKey = await this.connectionService.query(query);
      const sign = crypto.createSign('RSA-SHA256');
      const stringToSign = client_id + '|' + timestamp;
      sign.update(stringToSign);
      this.logger.log('[ Success Generate Signature Bank] : ', stringToSign);
      return sign.sign(privateKey[0].private_key_bank, 'base64');
    } catch (error) {
      this.logger.error('Error generating signature:', error.message);
      throw error;
    }
  }

  generateSymmetricStringToSign(
    http_method: string,
    relative_url: string,
    access_token: string,
    body: any,
    timestamp: string,
  ) {
    const token = access_token.split(' ')[1];
    const jsonString = typeof body === 'string' ? body : JSON.stringify(body);
    const minifiedJson = jsonminify(jsonString);
    const sha256hash = crypto
      .createHash('sha256')
      .update(minifiedJson)
      .digest('hex');
    const lowercaseHex = sha256hash.toLowerCase();
    const stringToSign = `${http_method}:${relative_url}:${token}:${lowercaseHex}:${timestamp}`;
    this.logger.log(
      '[ Success Generate Symmetric String To Sign] : ',
      stringToSign,
    );
    return stringToSign;
  }
  async generateSymmetricSignature(stringToSign: string) {
    const clientSecret = process.env.CLIENT_SECRET;

    const hmac = this.hmacSha512(clientSecret, stringToSign);
    const signature = hmac;
    this.logger.log('[ Success Generate Symmetric] : ', signature);
    return signature;
  }

  async generateSymmetricSignatureBank(bank: string, stringToSign: string) {
    let clientSecret: string;

    if (bank === 'BCA') {
      clientSecret = process.env.CLIENT_SECRET_BCA;
    } else if (bank === 'BRI') {
      clientSecret = process.env.CLIENT_SECRET_BRI;
    }
    const hmac = this.hmacSha512(clientSecret, stringToSign);
    const signature = hmac;
    this.logger.log('[ Success Generate Symmetric] : ', signature);
    return signature;
  }

  async verifySymmetricSignature(
    timestamp: string,
    signature: string,
    access_token: string,
    relative_url: string,
    body: any,
  ) {
    // const token = access_token.split(' ')[1];
    // const isExpired = this.isTokenExpired(token);
    // if (isExpired) {
    //   return {
    //     isValid: false,
    //   };
    // }
    const receivedSignature = signature;
    const stringToSign = this.generateSymmetricStringToSign(
      'POST',
      relative_url,
      access_token,
      body,
      timestamp,
    );

    const generatedSignature = await this.generateSymmetricSignature(
      stringToSign,
    );

    if (generatedSignature === receivedSignature) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
      };
    }
  }

  hmacSha512(secret: string, data: string): string {
    const hmac = createHmac('sha512', secret);
    hmac.update(data);
    return hmac.digest('base64');
  }

  async verifySignature(data: string, signature: string): Promise<boolean> {
    try {
      const client_id = data.split('|')[0];
      const query = `SELECT public_key from m_oauth_key where client_id = '${client_id}'`;
      const publicKey = await this.connectionService.query(query);
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data);
      return verify.verify(publicKey[0].public_key, signature, 'base64');
    } catch (error) {
      console.log(error);
    }
  }

  async verifySignatureBank(data: string, signature: string): Promise<boolean> {
    try {
      const client_id = data.split('|')[0];
      const query = `SELECT public_key_bank from m_oauth_key where client_id = '${client_id}'`;
      const publicKey = await this.connectionService.query(query);
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data);
      return verify.verify(publicKey[0].public_key_bank, signature, 'base64');
    } catch (error) {
      console.log(error);
    }
  }

  decryptedSignature(signature: string) {
    try {
      const privateKey = fs.readFileSync('key/private_key.pem', 'utf-8');
      const bufferData = Buffer.from(signature, 'base64');
      const decryptedData = crypto.privateDecrypt(privateKey, bufferData);
      return decryptedData.toString('utf-8');
    } catch (error) {
      console.error('Error decrypt signature:', error.message);
      throw error;
    }
  }

  isTimestampValid(timestamp: string): boolean {
    if (/^(\d{4})-(\d{2})-(\d{2})$/.test(timestamp)) {
      return false;
    }
    const parsedTimestamp = moment(timestamp, moment.ISO_8601, true);
    this.logger.log('[ isTimestampValid] : ', parsedTimestamp);
    return parsedTimestamp.isValid();
  }
}
