import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuardBcaPayment extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException({
        responseCode: '4012501',
        responseMessage: 'Invalid Token (B2B)',
      });
    }

    return user;
  }
}
