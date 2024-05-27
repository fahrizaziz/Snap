import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { OAuth2Strategy } from './oauth2.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as fs from 'fs';
import { ConnectionService } from 'src/connection/connection.service';
import { databaseProviders } from 'src/db/databaseProviders';
import { JwtStrategy } from './jwt.strategy';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'oauth2' }), // Use 'oauth2' as the default strategy
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '900s',
        },
      }),
    }),
  ],
  providers: [
    // OAuth2Strategy,
    AuthService,
    ConnectionService,
    ...databaseProviders,
    JwtStrategy,
    LoggerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
