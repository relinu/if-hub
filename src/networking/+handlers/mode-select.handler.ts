import { Injectable, Logger } from '@nestjs/common';
import { GameMode } from 'src/+utils/gamemodes';
import { DirectTradeService } from 'src/direct-trade/direct-trade.service';
import { Client } from '../+utils/client';
import { Packet, ParamTypes } from '../+utils/packet';
import { HandlerRegistry } from '../handler-registry';
import { BaseHandler } from './base.handler';

export const MODE_DATA_KEY = 'mode_key';

@Injectable()
export class ModeSelectHandler extends BaseHandler {
  private readonly logger = new Logger(ModeSelectHandler.name);

  constructor(
    private handlerRegistry: HandlerRegistry,
    private dtService: DirectTradeService,
  ) {
    super();
  }

  public get type(): string {
    return 'MODE';
  }

  public check(client: Client, packet: Packet): boolean {
    return !client.getData<number>(MODE_DATA_KEY) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const mode: number = packet.getParameter(0, ParamTypes.number);

    switch (mode) {
      case GameMode.DIRECT_TRADE:
        this.logger.debug(`Client(${client.id}) switched mode to: directtrade`);
        this.dtService.initialize(client);
        break;
      case GameMode.ONLINE_BATTLE:
        this.logger.debug(`Client(${client.id}) switched mode to: battle`);
        client.disconnect('not_implemented');
        break;
      default:
        return false;
    }

    client.setData(MODE_DATA_KEY, mode);
    this.handlerRegistry.removeHandler(client, ModeSelectHandler);
    return true;
  }
}
