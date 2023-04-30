import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Client } from '../+models/client';
import { Packet, ParamTypes } from '../+models/packet';
import { HandlerRegistry } from '../handler-registry';
import { BaseHandler } from './base.handler';
import { ModeSelectHandler } from './mode-select.handler';

export const AUTH_DATA_KEY = 'auth_key';

@Injectable()
export class AuthHandler extends BaseHandler {
  private readonly logger = new Logger(AuthHandler.name);
  public get type(): string {
    return 'AUTH';
  }

  constructor(
    private auth: AuthService,
    private handlerRegistry: HandlerRegistry,
  ) {
    super();
  }

  public check(client: Client, packet: Packet): boolean {
    return !client.getData<boolean>(AUTH_DATA_KEY) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const token = packet.getParameter(0, ParamTypes.string);
    if (token && this.auth.redeemToken(token)) {
      this.logger.debug(
        `Client (${client.id}) successfully claimed token: ${token}`,
      );
      client.clearTimeout();
      client.setData(AUTH_DATA_KEY, true);
      this.handlerRegistry.removeHandler(client, AuthHandler);
      const mode = this.handlerRegistry.addHandler(client, ModeSelectHandler);
      client.sendPacket(new Packet(mode.type));
    } else {
      client.disconnect();
    }

    return true;
  }
}
