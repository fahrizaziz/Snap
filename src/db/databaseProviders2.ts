/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { ConnectionPool } from 'mssql';

export const DATABASE_LINK_PROJECT_CONNECTION = 'DATABASE_LINK_PROJECT_CONNECTION';

export const databaseProviders2 = [
    {
      provide: DATABASE_LINK_PROJECT_CONNECTION,
      useFactory: async (configService: ConfigService) => {
          const dbConfig = {
              server: configService.get<string>('db2.host'),
              database: configService.get<string>('db2.name'),
              user: configService.get<string>('db2.user'),
              password: configService.get<string>('db2.password'),
              port: configService.get<number>('db2.port'),
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
                console.log('Connected to SQL server db link project');
              return pool;
              })
              .catch((err) => console.log('Error to SQL server db link project', { err }));
              return pool;
          },
          inject: [ConfigService],
      },
];