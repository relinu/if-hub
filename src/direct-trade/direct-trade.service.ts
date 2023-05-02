import { Injectable } from '@nestjs/common';
import { GameMode } from 'src/+utils/game-mode';
import { PlayerQueue, PACKET_QUEUE } from 'src/+utils/player-queue';
import { Client, DATA_KEY_NAME } from 'src/networking/+utils/client';
import { Packet } from 'src/networking/+utils/packet';
import { ClientCollection } from 'src/networking/client-collection';
import { GameModeRegistry, GameModeSelector } from 'src/networking/game-mode-registry';
import { HandlerRegistry } from 'src/networking/handler-registry';
import { DTRoomHandler } from './+handlers/dtroom.handler';
import { TradeAcceptHandler } from './+handlers/trade-accept.handler';
import { TradePokemonHandler } from './+handlers/trade-pokemon.handler';
import {
  Trade,
  DATA_KEY_TRADE,
  PACKET_TRADE_START,
  PACKET_TRADE_STOP,
} from './+utils/trade';

@Injectable()
export class DirectTradeService extends GameModeSelector {
  private playerQueue: PlayerQueue<number>;
  private trades: Map<string, Trade>;

  constructor(
    modeRegistry: GameModeRegistry,
    private handlerRegistry: HandlerRegistry,
    private clientCollection: ClientCollection,
  ) {
    super();
    this.playerQueue = new PlayerQueue<number>();
    this.trades = new Map<string, Trade>();

    modeRegistry.addGamemode(GameMode.DIRECT_TRADE, this);
  }

  public initialize(client: Client) {
    const handler = this.handlerRegistry.addHandler(client, DTRoomHandler);
    client.sendPacket(new Packet(handler.type));
  }

  public startTrade(client: Client, code: number) {
    const partner = this.playerQueue.find(code);

    if (partner) {
      this.playerQueue.enqueue(code, client.id);
      client.sendPacket(new Packet(PACKET_QUEUE));
    } else {
      const partnerClient = this.clientCollection.getClient(partner[0]);
      this.createTrade([client, partnerClient]);
    }
  }

  public getTrade(tradeId: string): Trade {
    return this.trades.get(tradeId);
  }

  public endTrade(tradeId: string) {
    const trade = this.getTrade(tradeId);

    for (const player of trade.players) {
      player.setData(DATA_KEY_TRADE, undefined);

      this.handlerRegistry.removeHandler(player, TradePokemonHandler);
      this.handlerRegistry.removeHandler(player, TradeAcceptHandler);

      player.sendPacket(new Packet(PACKET_TRADE_STOP));
    }

    this.trades.delete(tradeId);
  }

  private createTrade(players: Client[]) {
    const trade: Trade = new Trade(players, this);
    this.trades.set(trade.id, trade);

    for (let i = 0; i < players.length; i++) {
      players[i].setData(DATA_KEY_TRADE, trade.id);

      this.handlerRegistry.addHandler(players[i], TradePokemonHandler);
      this.handlerRegistry.addHandler(players[i], TradeAcceptHandler);

      const otherPlayer = (i + 1) % 2;
      players[i].sendPacket(new Packet(PACKET_TRADE_START, [players[otherPlayer].getData(DATA_KEY_NAME)]));
    }
  }
}
