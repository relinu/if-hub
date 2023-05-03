import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Client, DATA_KEY_NAME } from '../+utils/client';
import { Packet, ParamTypes } from '../+utils/packet';
import { HandlerRegistry } from '../handler-registry';
import { BaseHandler } from './base.handler';
import { GameModeSelectHandler } from './game-mode-select.handler';

export const DATA_KEY_AUTH = 'auth_key';

@Injectable()
export class AuthHandler extends BaseHandler {
  private readonly logger = new Logger(AuthHandler.name);

  constructor(
    private auth: AuthService,
    private handlerRegistry: HandlerRegistry,
  ) {
    super();
  }

  public get type(): string {
    return 'AUTH';
  }

  public check(client: Client, packet: Packet): boolean {
    return !client.getData<boolean>(DATA_KEY_AUTH) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const token = packet.getParameter(0, ParamTypes.string);
    const info = this.auth.redeemToken(token);
    if (token && info) {
      this.logger.debug(
        `Client (${client.id}) successfully claimed token: ${token}`,
      );
      client.clearTimeout();
      client.setData(DATA_KEY_AUTH, true);
      client.setData(DATA_KEY_NAME, info);
      this.handlerRegistry.removeHandler(client, AuthHandler);
      const mode = this.handlerRegistry.addHandler(
        client,
        GameModeSelectHandler,
      );
      client.sendPacket(new Packet(mode.type));
    } else {
      client.disconnect();
    }

    return true;
  }
}
