import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StringUtilsService {
  constructor(private configService: ConfigService) {}

  substring(str: string, start: number, end: number): string {
    return str.substring(start, end);
  }
}
