// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Token } from 'src/dto/token';
// import { User } from 'src/entity/user.entity';
// import { ResponseToken } from 'src/response/response.token';
// import { FindOneOptions, Repository } from 'typeorm';

// @Injectable()
// export class TokenService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     private readonly jwtService: JwtService,
//   ) {}

//   async signIn(tokens: Token): Promise<ResponseToken> {
//     const options: FindOneOptions<User> = {
//       where: {
//         client_id: tokens.client_id,
//         grant_type: tokens.grant_type,
//         secret: tokens.client_secret,
//       },
//     };

//     const user = await this.userRepository.findOne(options);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const token = await this.generateToken(user);

//     return {
//       access_token: token,
//       token_type: 'Bearer',
//     };
//   }

//   async login(tokens: Token): Promise<ResponseToken> {
//     const options: FindOneOptions<User> = {
//       where: {
//         client_id: tokens.client_id,
//         grant_type: tokens.grant_type,
//       },
//     };

//     const user = await this.userRepository.findOne(options);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const days = 14;
//     const hours = 23;
//     const expires = days * 24 * 60 * 60 + hours * 60 * 60;

//     const token = await this.generateToken(user);

//     return {
//       token_type: 'Bearer',
//       expires_in: expires,
//       access_token: token,
//     };
//   }

//   async generateToken(user: User): Promise<any> {
//     const payload = { username: user.client_id, sub: user.id };
//     return this.jwtService.sign(payload);
//   }
// }
