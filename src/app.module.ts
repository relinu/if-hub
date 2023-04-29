import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WondertradeModule } from './wondertrade/wondertrade.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { NetworkingModule } from './networking/networking.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 15,
    }),
    MongooseModule.forRoot(
      process.env.DB_URL,
      { sslKey: process.env.DB_CERT, sslCert: process.env.DB_CERT },
    ),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'webClient') }),
    NetworkingModule,
    WondertradeModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
