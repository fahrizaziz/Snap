import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class TimestampValidationPipe implements PipeTransform<string, Date> {
  private timeStampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  transform(value): Date {
    if (!this.timeStampRegex.test(value.timestamp)) {
      throw new BadRequestException(`Invalid timestamp format`);
    }

    const parsedDate = new Date(value.timestamp);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid parsed date format`);
    }
    return parsedDate;
  }
}
