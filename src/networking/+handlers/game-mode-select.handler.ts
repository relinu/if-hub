import { Injectable, Logger } from '@nestjs/common';
import { Client } from '../+utils/client';
import { Packet, ParamTypes } from '../+utils/packet';
import { GameModeRegistry } from '../game-mode-registry';
import { HandlerRegistry } from '../handler-registry';
import { BaseHandler } from './base.handler';

export const DATA_KEY_MODE = 'mode_key';

@Injectable()
export class GameModeSelectHandler extends BaseHandler {
  private readonly logger = new Logger(GameModeSelectHandler.name);

  constructor(
    private handlerRegistry: HandlerRegistry,
    private modeRegistry: GameModeRegistry,
  ) {
    super();
  }

  public get type(): string {
    return 'MODE';
  }

  public check(client: Client, packet: Packet): boolean {
    return !client.getData<number>(DATA_KEY_MODE) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const mode: number = packet.getParameter(0, ParamTypes.number);
    const selector = this.modeRegistry.getSelector(mode);

    if (selector) {
      this.logger.debug(`Client(${client.id}) switched to gamemode: ${mode}`);
      selector.initialize(client);
    } else {
      this.logger.debug(
        `Client(${client.id}) switched to not implemented gamemode: ${mode}`,
      );
      client.disconnect('not_implemented');
    }

    client.setData(DATA_KEY_MODE, mode);
    this.handlerRegistry.removeHandler(client, GameModeSelectHandler);
    return true;
  }
}
