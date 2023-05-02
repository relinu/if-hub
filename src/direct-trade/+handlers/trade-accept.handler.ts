import { Injectable, Logger } from '@nestjs/common';
import { DirectTradeService } from 'src/direct-trade/direct-trade.service';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+utils/client';
import { Packet, ParamTypes } from 'src/networking/+utils/packet';
import { TRADE_DATA_KEY } from '../+utils/trade';

export const TRADE_ACCEPT_DATA_KEY = 'trade_accept_key';

@Injectable()
export class TradeAcceptHandler extends BaseHandler {
  private readonly logger = new Logger(TradeAcceptHandler.name);

  constructor(private dtService: DirectTradeService) {
    super();
  }

  public get type(): string {
    return 'TRADEACPT';
  }

  public check(client: Client, packet: Packet): boolean {
    return client.getData<string>(TRADE_DATA_KEY) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const tradeId = client.getData<string>(TRADE_DATA_KEY);
    const trade = this.dtService.getTrade(tradeId);

    const accept: boolean = packet.getParameter(0, ParamTypes.boolean);
    this.logger.debug(`Client(${client.id}) accepted trade: ${accept}`);

    client.setData<boolean>(TRADE_ACCEPT_DATA_KEY, accept);
    trade.setPlayerAccepts(client.id, accept);

    return true;
  }
}
