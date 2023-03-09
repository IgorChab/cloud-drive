import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: 'https://chatbook.space'
  })
  app.setGlobalPrefix("api")
  await app.listen(5000);
}
bootstrap();
