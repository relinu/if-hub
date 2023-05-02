import { Injectable, Logger } from '@nestjs/common';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+utils/client';
import { Packet, ParamTypes } from 'src/networking/+utils/packet';
import { TRADE_DATA_KEY } from '../+utils/trade';
import { DirectTradeService } from '../direct-trade.service';
import { TRADE_ACCEPT_DATA_KEY } from './trade-accept.handler';

@Injectable()
export class TradePokemonHandler extends BaseHandler {
  private readonly logger = new Logger(TradePokemonHandler.name);

  constructor(private dtService: DirectTradeService) {
    super();
  }

  public get type(): string {
    return 'TRADEPKM';
  }

  public check(client: Client, packet: Packet): boolean {
    return client.getData<string>(TRADE_DATA_KEY) && !client.getData<boolean>(TRADE_ACCEPT_DATA_KEY) && packet.length > 0;
  }

  public handle(client: Client, packet: Packet): boolean {
    const tradeId = client.getData<string>(TRADE_DATA_KEY);
    const trade = this.dtService.getTrade(tradeId);

    const pokemon: object = packet.getParameter(0, ParamTypes.object);
    if (pokemon) {
      trade.setPokemon(client.id, pokemon);
      return true;
    }

    return false;
  }
}
