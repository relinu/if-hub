import { Injectable } from '@nestjs/common';
import { PlayerQueue, QUEUE_PACKET_TYPE } from 'src/+models/player-queue';
import { Client } from 'src/networking/+models/client';
import { Packet } from 'src/networking/+models/packet';
import { ClientCollection } from 'src/networking/client-collection';
import { HandlerRegistry } from 'src/networking/handler-registry';
import { DTRoomHandler } from './+handlers/dtroom.handler';
import { Trade, TRADE_DATA_KEY } from './+models/trade';

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
    this.trades.delete(tradeId);
    // TODO: remove handlers, send stop packets
  }

  private createTrade(players: Client[]) {
    const trade: Trade = new Trade(players);
    this.trades.set(trade.id, trade);

    for (const player of players) {
      player.setData(TRADE_DATA_KEY, trade.id);
      // TODO: add handlers, send start packets
    }
  }
}
