/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { ConnectionPool } from 'mssql';

export const NOTIFIKASI_DATABASE_CONNECTION = 'NOTIFIKASI_DATABASE_CONNECTION';

export const databaseProviders = [
    {
      provide: NOTIFIKASI_DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
          const dbConfig = {
              server: configService.get<string>('db.host'),
              database: configService.get<string>('db.name'),
              user: configService.get<string>('db.user'),
              password: configService.get<string>('db.password'),
              port: configService.get<number>('db.port'),
              options: {
                  encrypt: false,
                  enableArithAbort: true,
                  abortTransactionOnError: true,
                  appName: 'NODEJS',
                  requestTimeOut: 300000,
              },
              enableDebug: true,
              debug: {
              packet: true,
              payload: true,
              token: false,
              data: true,
              },
          };
          const pool = await new ConnectionPool(dbConfig)
              .connect()
              .then((pool) => {
                console.log('Connected to SQL server db payment');
              return pool;
              })
              .catch((err) => console.log('Error to SQL server db payment', { err }));
              return pool;
          },
          inject: [ConfigService],
      },
];