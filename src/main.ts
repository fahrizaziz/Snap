import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*', // Change this to your allowed origins or use a function for dynamic control
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders:
  //     'Content-Type,Authorization,X-TIMESTAMP,X-CLIENT-KEY,X-CLIENT-SECRET,Content-Type,X-SIGNATURE,Accept,Authorization,Authorization-Customer,ORIGIN,X-PARTNER-ID,X-EXTERNAL-ID,X-IP-ADDRESS,X-DEVICE-ID,CHANNEL-ID,X-LATITUDE,X-LONGITUDE',
  // });
  const PORT = process.env.PORT;
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidUnknownValues: true,
  //     transform: true,
  //   }),
  // );
  await app.listen(PORT);
}
bootstrap();
