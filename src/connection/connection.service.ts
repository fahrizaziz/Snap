import { Inject, Injectable } from '@nestjs/common';
import { error } from 'console';
import { NOTIFIKASI_DATABASE_CONNECTION } from 'src/db/databaseProviders';

@Injectable()
export class ConnectionService {
  constructor(
    @Inject(NOTIFIKASI_DATABASE_CONNECTION) private connection: any,
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

  // async query(
  //   sql: string,
  //   params?: any[],
  //   timeoutMillis = 120000,
  // ): Promise<any[]> {
  //   const request = this.connection.request();
  //   if (params) {
  //     params.forEach((param, index) => {
  //       request.input(`params${index}`, param);
  //     });
  //   }
  //   const result = await request.query(sql).then((result) => result.recordset);
  //   // return result.recordset;
  //   const timeoutPromise = new Promise<any[]>((_, reject) => {
  //     setTimeout(() => {
  //       reject(new Error('Query timeout'));
  //     }, timeoutMillis);
  //   });

  //   return Promise.race([result, timeoutPromise])
  //     .then((result) => {
  //       return result;
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //       throw error;
  //     });
  // }

  async query(sql: string, params?: any[]): Promise<any[]> {
    const request = this.connection.request();
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    }
    const result = await request.query(sql);
    return result.recordset;
  }

  async updateExecute(query: string) {
    const request = this.connection.request();
    const result = await request.query(query);
    return result.rowsAffected;
  }

  async customQuery(sql: string, params?: any): Promise<any> {
    const request = this.connection.request();
    if (params) {
      params.forEach((param, index) => {
        request.input(`params${index}`, param);
      });
    }
    const result = await request.query(sql);
    return result.recordset;
  }

  async executeStoredProcedure(storedProcedureName: string, ...params: any[]) {
    const request = this.connection.request();
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          request.input(key, params[key]);
        }
      }
    }
    // const result = await request.execute(storedProcedureName);
    // return result.recordset;
    // if (params) {
    //   params.forEach((param, index) => {
    //     request.input(`param${index}`, param);
    //   });
    // }

    const result = await request.execute(storedProcedureName);
    return result.recordset;
  }
}
