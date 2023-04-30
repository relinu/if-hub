import { Injectable, Logger } from '@nestjs/common';
import { QUEUE_DATA_KEY } from 'src/+models/player-queue';
import { DirectTradeService } from 'src/direct-trade/direct-trade.service';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+models/client';
import { Packet, ParamTypes } from 'src/networking/+models/packet';
import { HandlerRegistry } from 'src/networking/handler-registry';

@Injectable()
export class DTRoomHandler extends BaseHandler {
  private readonly logger = new Logger(DTRoomHandler.name);

  constructor(
    private handlerRegistry: HandlerRegistry,
    private dtService: DirectTradeService,
  ) {
    super();
  }

  public get type(): string {
    return 'ROOM';
  }

  public check(client: Client, packet: Packet): boolean {
    return !client.getData<number>(QUEUE_DATA_KEY) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const code: number = packet.getParameter(0, ParamTypes.number);
    client.setData(QUEUE_DATA_KEY, code);
    this.handlerRegistry.removeHandler(client, DTRoomHandler);

    this.dtService.startTrade(client, code);
    return true;
  }
}
