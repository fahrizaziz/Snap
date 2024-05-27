import { HttpException, HttpStatus } from '@nestjs/common';

export class DataNotFoundException extends HttpException {
  constructor(message: string, errors: string[] = []) {
    super({ message, errors }, HttpStatus.NOT_FOUND);
  }
}
