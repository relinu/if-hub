import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DirectTradeModule } from 'src/direct-trade/direct-trade.module';
import { AuthHandler } from './+handlers/auth.handler';
import { ModeSelectHandler } from './+handlers/mode-select.handler';
import { ClientCollection } from './client-collection';
import { HandlerRegistry } from './handler-registry';
import { TcpServer } from './tcp-server';

@Module({
  providers: [
    TcpServer,
    ClientCollection,
    HandlerRegistry,
    AuthHandler,
    ModeSelectHandler,
  ],
  exports: [HandlerRegistry],
  imports: [AuthModule, forwardRef(() => DirectTradeModule)],
})
export class NetworkingModule {}
