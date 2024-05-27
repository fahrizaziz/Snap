import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TimestampValidationPipe } from 'src/timestamp-validation/timestamp-validation.pipe';
import { TimestampDto } from 'src/dto/timestamp';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('/access-token')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private sendErrorResponse(
    res: Response,
    statusCode: number,
    responseCode: string,
    responseMessage: string,
  ) {
    return res.status(statusCode).json({ responseCode, responseMessage });
  }

  @Get()
  async test() {
    return {
      message: 'test',
    };
  }

  @Post('timestamp')
  timestampValidation(@Body(new TimestampValidationPipe()) body: TimestampDto) {
    try {
      const date = new Date();
      return {
        timestamp: body,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid timestamp format');
      }
      throw error;
    }
  }

  @Get('token')
  // @UseGuards(AuthGuard('oauth2')) // Apply the OAuth2 guard
  async token() {
    // This route is protected and will generate an OAuth2 token
    const clientId = 'your_client_id'; // Replace with your client ID
    const clientSecret = 'your_client_secret'; // Replace with your client secret

    // Use the authService to generate the token
    const tokenResponse = await this.authService.createToken(
      clientId + '|' + clientSecret,
    );

    // Return the token response
    return tokenResponse;
  }

  @Post('/b2b')
  async generateToken(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-CLIENT-KEY') clientKey: string,
    @Headers('X-SIGNATURE') signature: string,
    @Body() body: { grantType: string },
    @Res() res: Response,
  ) {
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4007301',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }

    const isClientKeyExist = await this.authService.validateClientKey(
      clientKey,
    );
    if (!isClientKeyExist) {
      return this.sendErrorResponse(
        res,
        401,
        '4017300',
        'Unauthorized. [Unknown client]',
      );
    }

    try {
      if (body.grantType === 'client_credentials') {
        const stringToSign = clientKey + '|' + timestamp;
        const isVerify = await this.authService.verifySignature(
          stringToSign,
          signature,
        );

        if (!isVerify) {
          return this.sendErrorResponse(
            res,
            401,
            '4017300',
            'Unauthorized. [Signature]',
          );
        } else {
          const token = await this.authService.createToken(stringToSign);
          const response = {
            responseCode: '2007300',
            responseMessage: 'Successful',
            accessToken: token.access_token,
            tokenType: 'bearer',
            expiresIn: '900',
          };
          res.status(200).send(response);
        }
      } else {
        res.status(400).send({
          responseCode: '4007300',
          responseMessage: 'invalid field format [grant type]',
        });
      }
    } catch (error) {
      return this.sendErrorResponse(
        res,
        400,
        '4017302',
        'Invalid Mandatory Field [X-CLIENT-KEY]',
      );
    }
  }

  @Post('/b2bBank')
  async generateTokenBank(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-CLIENT-KEY') clientKey: string,
    @Headers('X-SIGNATURE') signature: string,
    @Body() body: { grantType: string },
    @Res() res: Response,
  ) {
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4007301',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }

    const isClientKeyExist = await this.authService.validateClientKey(
      clientKey,
    );
    if (!isClientKeyExist) {
      return this.sendErrorResponse(
        res,
        401,
        '4017300',
        'Unauthorized. [Unknown client]',
      );
    }

    try {
      if (body.grantType === 'client_credentials') {
        const stringToSign = clientKey + '|' + timestamp;
        const isVerify = await this.authService.verifySignatureBank(
          stringToSign,
          signature,
        );

        if (!isVerify) {
          return this.sendErrorResponse(
            res,
            401,
            '4017300',
            'Unauthorized. [Signature]',
          );
        } else {
          const token = await this.authService.createToken(stringToSign);
          const response = {
            responseCode: '2007300',
            responseMessage: 'Successful',
            accessToken: token.access_token,
            tokenType: 'bearer',
            expiresIn: '900',
          };
          res.status(200).send(response);
        }
      } else {
        res.status(400).send({
          responseCode: '4007300',
          responseMessage: 'invalid field format [grant type]',
        });
      }
    } catch (error) {
      return this.sendErrorResponse(
        res,
        400,
        '4017302',
        'Invalid Mandatory Field [X-CLIENT-KEY]',
      );
    }
  }

  @Post('createSymmetricSignature')
  @UseGuards(JwtAuthGuard)
  async createSymmetricSignature(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('Authorization') access_token: string,
    @Headers('relative_url') relative_url: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    const stringToSign = this.authService.generateSymmetricStringToSign(
      'POST',
      relative_url,
      access_token,
      body,
      timestamp,
    );
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4007301',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    try {
      const signature = await this.authService.generateSymmetricSignature(
        stringToSign,
      );
      const response = {
        signature: signature,
      };
      res.status(200).send(response);
    } catch (error) {
      return this.sendErrorResponse(
        res,
        400,
        '4017302',
        'Invalid StringToSign',
      );
    }
  }

  @Post('createSymmetricSignatureBank')
  // @UseGuards(JwtAuthGuard)
  async createSymmetricSignatureBank(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('Authorization') access_token: string,
    @Headers('relative_url') relative_url: string,
    @Headers('bank') bank: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    const stringToSign = this.authService.generateSymmetricStringToSign(
      'POST',
      relative_url,
      access_token,
      body,
      timestamp,
    );
    const isValid = this.authService.isTimestampValid(timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4007301',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    try {
      const signature = await this.authService.generateSymmetricSignatureBank(
        bank,
        stringToSign,
      );
      const response = {
        signature: signature,
      };
      res.status(200).send(response);
    } catch (error) {
      return this.sendErrorResponse(
        res,
        400,
        '4017302',
        'Invalid StringToSign',
      );
    }
  }

  @Post('verifySymmetricSignature')
  // @UseGuards(JwtAuthGuard)
  async verifySymmetricSignature(
    @Headers('X-TIMESTAMP') timestamp: string,
    @Headers('X-SIGNATURE') signature: string,
    @Headers('Authorization') access_token: string,
    @Headers('relative_url') relative_url: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const receivedSignature = signature;
    const stringToSign = this.authService.generateSymmetricStringToSign(
      'POST',
      relative_url,
      access_token,
      body,
      timestamp,
    );
    const generatedSignature =
      await this.authService.generateSymmetricSignature(stringToSign);

    if (generatedSignature === receivedSignature) {
      const response = {
        isValid: true,
      };
      res.status(200).send(response);
    } else {
      return this.sendErrorResponse(res, 400, '4017302', 'Invalid Signature');
    }
  }

  @Post('isTokenExpired')
  async checkToken(@Body() body: any, @Res() res: Response) {
    const token = this.authService.isTokenExpired(body.token);
    if (token.isExpired == true) {
      return res.json({
        message: 'Token expired',
      });
    }
    return token;
  }

  @Post('createSignature')
  async createSignature(@Body() body: any, @Res() res: Response): Promise<any> {
    try {
      const signature = await this.authService.generateSignature(
        body.client_id,
        body.timestamp,
      );
      const response = {
        responseCode: '2007300',
        responseMessage: 'Successful',
        signature: signature,
      };
      return res.status(200).send(response);
    } catch (error) {
      return this.sendErrorResponse(res, 400, '4017302', 'Invalid Client_ID');
    }
  }

  @Post('createSignatureBank')
  async createSignatureBank(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    const isValid = this.authService.isTimestampValid(body.timestamp);
    if (!isValid) {
      return this.sendErrorResponse(
        res,
        400,
        '4007301',
        'Invalid timestamp format [X-TIMESTAMP]',
      );
    }
    try {
      const signature = await this.authService.generateSignatureBank(
        body.client_id,
        body.timestamp,
      );
      const response = {
        responseCode: '2007300',
        responseMessage: 'Successful',
        signature: signature,
      };
      return res.status(200).send(response);
    } catch (error) {
      return this.sendErrorResponse(res, 400, '4017302', 'Invalid Client_ID');
    }
  }

  @Post('verifySignature')
  async verify(@Body() body: any): Promise<boolean> {
    const stringToSign = body.client_id + '|' + body.timestamp;
    return this.authService.verifySignature(stringToSign, body.signature);
  }

  @Post('isSignatureValid')
  isSignatureValid(@Body() body: any) {
    const payload = this.authService.decryptedSignature(body.signature);
    const stringToSign = body.client_id + '|' + body.timestamp;

    if (payload === stringToSign) {
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
      };
    }
  }
}
