import { Injectable, Logger } from '@nestjs/common';
import { DirectTradeService } from '../direct-trade.service';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+utils/client';
import { Packet, ParamTypes } from 'src/networking/+utils/packet';
import { DATA_KEY_TRADE } from '../+utils/trade';
import { TradePacketType } from '../+utils/trade-packet';

export const DATA_KEY_TRADE_ACCEPT = 'trade_accept_key';

@Injectable()
export class TradeAcceptHandler extends BaseHandler {
  private readonly logger = new Logger(TradeAcceptHandler.name);

  constructor(private dtService: DirectTradeService) {
    super();
  }


  public get type(): string {
    return TradePacketType.TRADEACPT;
  }

  public check(client: Client, packet: Packet): boolean {
    return client.getData<string>(DATA_KEY_TRADE) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const tradeId = client.getData<string>(DATA_KEY_TRADE);
    const trade = this.dtService.getTrade(tradeId);

    const accept: boolean = packet.getParameter(0, ParamTypes.boolean);
    this.logger.debug(`Client(${client.id}) accepted trade: ${accept}`);

    client.setData<boolean>(DATA_KEY_TRADE_ACCEPT, accept);
    trade.setPlayerAccepts(client.id, accept);

    return true;
  }
}
