import { Injectable, Logger } from '@nestjs/common';
import { Pokemon } from 'src/+models/pokemon.schema';
import { DirectTradeService } from '../direct-trade.service';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+utils/client';
import { Packet, ParamTypes } from 'src/networking/+utils/packet';
import { DATA_KEY_TRADE } from '../+utils/trade';
import { DATA_KEY_TRADE_ACCEPT } from './trade-accept.handler';
import { TradePacketType } from '../+utils/trade-packet';

@Injectable()
export class TradePokemonHandler extends BaseHandler {
  private readonly logger = new Logger(TradePokemonHandler.name);

  constructor(private dtService: DirectTradeService) {
    super();
  }


  public get type(): string {
    return TradePacketType.TRADEPKM;
  }

  public check(client: Client, packet: Packet): boolean {
    return (
      client.getData<string>(DATA_KEY_TRADE) &&
      !client.getData<boolean>(DATA_KEY_TRADE_ACCEPT) &&
      packet.length > 0
    );
  }

  public handle(client: Client, packet: Packet): boolean {
    const tradeId = client.getData<string>(DATA_KEY_TRADE);
    const trade = this.dtService.getTrade(tradeId);

    console.log(packet);
    const pokemon: Pokemon = packet.getParameter(0, ParamTypes.object) as Pokemon;
    if (pokemon) {
      this.logger.debug(
        `Client(${client.id}) want to trade: ${pokemon.personal_id}`,
      );
      trade.setPokemon(client.id, pokemon);
      return true;
    }

    return false;
  }
}
