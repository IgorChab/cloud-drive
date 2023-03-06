import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {AuthModule} from "./auth/auth.module";
import {FileModule} from "./files/file.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path'

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot('mongodb://127.0.0.1:27017/cloud-drive'),
      ServeStaticModule.forRoot({
          rootPath: path.join(__dirname, '..', '..', 'client', 'build', 'static'),
      }),
      AuthModule,
      FileModule
  ],
    controllers: []
})
export class AppModule {}
