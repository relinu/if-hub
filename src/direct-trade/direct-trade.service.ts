import { Injectable } from '@nestjs/common';
import { PlayerQueue, QUEUE_PACKET_TYPE } from 'src/+utils/player-queue';
import { Client } from 'src/networking/+utils/client';
import { Packet } from 'src/networking/+utils/packet';
import { ClientCollection } from 'src/networking/client-collection';
import { HandlerRegistry } from 'src/networking/handler-registry';
import { DTRoomHandler } from './+handlers/dtroom.handler';
import { TradeAcceptHandler } from './+handlers/trade-accept.handler';
import { TradePokemonHandler } from './+handlers/trade-pokemon.handler';
import { Trade, TRADE_DATA_KEY, TRADE_START_PACKET, TRADE_STOP_PACKET } from './+utils/trade';

@Injectable()
export class DirectTradeService {
  private playerQueue: PlayerQueue<number>;
  private trades: Map<string, Trade>;

  constructor(
    private handlerRegistry: HandlerRegistry,
    private clientCollection: ClientCollection,
  ) {
    this.playerQueue = new PlayerQueue<number>();
    this.trades = new Map<string, Trade>();
  }

  public initialize(client: Client) {
    const handler = this.handlerRegistry.addHandler(client, DTRoomHandler);
    client.sendPacket(new Packet(handler.type));
  }

  public startTrade(client: Client, code: number) {
    const partner = this.playerQueue.find(code);

    if (partner) {
      this.playerQueue.enqueue(code, client.id);
      client.sendPacket(new Packet(QUEUE_PACKET_TYPE));
    } else {
      const partnerClient = this.clientCollection.getClient(partner[0]);
      this.createTrade([client, partnerClient]);
    }
  }

  public getTrade(tradeId: string): Trade {
    return this.trades.get(tradeId);
  }

  public stopTrade(tradeId: string) {
    const trade = this.getTrade(tradeId);

    for (const player of trade.players) {
      player.setData(TRADE_DATA_KEY, undefined);

      this.handlerRegistry.removeHandler(player, TradePokemonHandler);
      this.handlerRegistry.removeHandler(player, TradeAcceptHandler);

      player.sendPacket(new Packet(TRADE_STOP_PACKET));
    }

    this.trades.delete(tradeId);
  }

  private createTrade(players: Client[]) {
    const trade: Trade = new Trade(players);
    this.trades.set(trade.id, trade);

    for (const player of players) {
      player.setData(TRADE_DATA_KEY, trade.id);

      this.handlerRegistry.addHandler(player, TradePokemonHandler);
      this.handlerRegistry.addHandler(player, TradeAcceptHandler);

      player.sendPacket(new Packet(TRADE_START_PACKET));
    }
  }
}
