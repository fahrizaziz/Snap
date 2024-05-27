// import { Body, Controller, Post } from '@nestjs/common';
// import { Token } from 'src/dto/token';
// import { ResponseToken } from 'src/response/response.token';
// import { TokenService } from './token.service';

// @Controller('oauth')
// export class TokenController {
//   constructor(private readonly tokenService: TokenService) {}

//   @Post('/token')
//   async login(@Body() tokens: Token): Promise<ResponseToken> {
//     try {
//       const token = await this.tokenService.signIn(tokens);
//       if (!token) {
//         throw new Error('Invalid credentials');
//       }

//       return token;
//     } catch (error) {
//       return {
//         message: error.message,
//       };
//     }
//   }

//   @Post('/public/oauth/token')
//   async signIn(@Body() tokens: Token): Promise<ResponseToken> {
//     try {
//       const token = await this.tokenService.login(tokens);
//       if (!token) {
//         throw new Error('Invalid credentials');
//       }

//       return token;
//     } catch (error) {
//       return {
//         message: error.message,
//       };
//     }
//   }
// }
