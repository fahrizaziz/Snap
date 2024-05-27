import { Inject, Injectable } from '@nestjs/common';
import { error } from 'console';
import { DATABASE_LINK_PROJECT_CONNECTION } from 'src/db/databaseProviders2';

@Injectable()
export class ConnectionDbLinkService {
  constructor(
    @Inject(DATABASE_LINK_PROJECT_CONNECTION) private connection: any,
  ) {}
  async testConnection(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (error) {
        reject(error);
      } else {
        resolve('Database connected successfully');
      }
    });
  }
  async queryDbLink(sql: string, params?: any[]): Promise<any[]> {
    const request = this.connection.request();
    if (params) {
      params.forEach((param, index) => {
        request.input(`params${index}`, param);
      });
    }
    const result = await request.query(sql);
    return result.recordset;
  }
  async customQueryDbLink(sql: string, params?: any): Promise<any> {
    const request = this.connection.request();
    if (params) {
      params.forEach((param, index) => {
        request.input(`params${index}`, param);
      });
    }
    const result = await request.query(sql);
    return result.recordset;
  }

  async queryDbLink2(
    sql: string,
    params?: { [key: string]: any },
  ): Promise<any[]> {
    const request = this.connection.request();

    if (params) {
      for (const paramName in params) {
        if (params.hasOwnProperty(paramName)) {
          request.input(paramName, params[paramName]);
        }
      }
    }

    const result = await request.query(sql);
    return result.recordset;
  }
}
