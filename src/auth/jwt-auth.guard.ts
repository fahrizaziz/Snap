import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException({
        responseCode: '4012401',
        responseMessage: 'Invalid Token (B2B)',
      });
    }

    return user;
  }
}
