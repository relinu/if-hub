import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthHandler } from './+handlers/auth.handler';
import { GameModeSelectHandler } from './+handlers/game-mode-select.handler';
import { ClientCollection } from './client-collection';
import { GameModeRegistry } from './game-mode-registry';
import { HandlerRegistry } from './handler-registry';
import { TcpServer } from './tcp-server';

@Module({
  providers: [
    TcpServer,
    ClientCollection,
    HandlerRegistry,
    GameModeRegistry,
    AuthHandler,
    GameModeSelectHandler,
  ],
  exports: [ClientCollection, HandlerRegistry, GameModeRegistry],
  imports: [AuthModule],
})
export class NetworkingModule {}
