import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WondertradeModule } from './wondertrade/wondertrade.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';

const certPath = '.\\X509-cert-1606584436327368388.pem';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 15,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://cluster0.kwmnejd.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority',
      { sslKey: certPath, sslCert: certPath },
    ),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'webClient') }),
    WondertradeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
