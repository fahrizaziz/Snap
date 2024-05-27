import { IsDateString } from 'class-validator';

export class TimestampDto {
  @IsDateString()
  timestamp: string;
}
