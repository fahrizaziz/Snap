import { IsNotEmpty } from 'class-validator';

export class AuthorizationHeaders {
  @IsNotEmpty()
  auth: string;
}
