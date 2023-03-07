import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: 'http://80.78.247.18:3000'
  })
  app.useStaticAssets(join(__dirname, '..', '..', 'client', 'build'))
  await app.listen(5000);
}
bootstrap();
