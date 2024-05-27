import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import {
  Logger as winstonLogger,
  createLogger,
  format,
  transports,
} from 'winston';
import * as moment from 'moment';

import * as fs from 'fs';

import 'winston-daily-rotate-file';

const date = moment().format('YYYY-MM-DD');

@Injectable()
export class LoggerService extends Logger {
  private readonly logger: winstonLogger;
  private logsDirPath: string;
  private getCurrentDate() {
    return moment().format('YYYY-MM-DD');
  }
  private ensureDateDirectoryExists() {
    const currentDate = this.getCurrentDate();
    const dateDirPath = path.join(this.logsDirPath, currentDate);
    // Cek apakah folder logs sudah ada atau belum
    if (!fs.existsSync(dateDirPath)) {
      // Jika belum ada, buat folder logs
      fs.mkdirSync(dateDirPath);
      fs.chmodSync(dateDirPath, '775');
      console.log('Berhasil Membuat folder logs');
    } else {
      fs.chmodSync(dateDirPath, '775');
      console.log('Gagal Membuat folder logs');
    }
  }

  private ensureLogsDirectoryExists() {
    if (!fs.existsSync(this.logsDirPath)) {
      fs.mkdirSync(this.logsDirPath);
      console.log('Logs folder created');
    } else {
      console.log('Logs folder already exists');
    }
  }

  private updateLogger() {
    const currentDate = this.getCurrentDate();
    const dateDirPath = path.join(this.logsDirPath, currentDate);
    this.ensureLogsDirectoryExists();
    this.ensureDateDirectoryExists();

    const customFormat = format.printf(
      ({ level, message, label, timestamp, data }) => {
        return `${timestamp} [${label}] ${level}: ${message} ===> ${data}`;
      },
    );

    const errorTransport = new transports.File({
      level: 'error',
      dirname: dateDirPath,
      filename: path.join(dateDirPath, `error-api-bi-snap.log`),
      format: format.combine(
        format.label({ label: 'API SNAP' }),
        format.timestamp(),
        customFormat,
      ),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    });
    const infoTransport = new transports.File({
      level: 'info',
      filename: path.join(dateDirPath, `info-api-bi-snap.log`),
      format: format.combine(
        format.label({ label: 'API SNAP' }),
        format.timestamp(),
        customFormat,
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    });
    this.logger.clear();
    this.logger.add(errorTransport);
    this.logger.add(infoTransport);
    this.logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          }),
        ),
      }),
    );
  }
  constructor() {
    super();

    this.logsDirPath = './logs';
    this.ensureLogsDirectoryExists();

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({
          format: () =>
            moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss.SSS Z'),
        }),
        format.json(),
      ),

      transports: [],
    });
    this.updateLogger();
  }

  log(message: string, data?: any) {
    super.log(message);
    this.updateLogger();
    this.logger.log({ level: 'info', message, data });
  }

  error(message: string, trace?: string, data?: any) {
    super.error(message, trace);
    this.updateLogger();
    this.logger.error({ level: 'error', message, trace, data });
  }

  warn(message: string, data?: any) {
    super.warn(message);
    this.updateLogger();
    this.logger.warn({ level: 'warn', message, data });
  }

  debug(message: string, data?: any) {
    super.debug(message);
    this.updateLogger();
    this.logger.debug({ level: 'debug', message, data });
  }

  verbose(message: string, data?: any) {
    super.verbose(message);
    this.logger.verbose({ level: 'verbose', message, data });
  }
}
