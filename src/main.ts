import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Parser } from 'graphql/language/parser';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MutationGuard } from './users/auth-guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  
  await app.listen(3000);
}
bootstrap();
