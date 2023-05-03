import { Pokemon } from 'src/+models/pokemon.schema';
import { Client } from 'src/networking/+utils/client';
import { Packet } from 'src/networking/+utils/packet';
import { v4 as uuidV4 } from 'uuid';
import { DirectTradeService } from '../direct-trade.service';
import { TradePacketType } from './trade-packet';

export const DATA_KEY_TRADE = 'trade_key';

export class Trade {
  readonly id: string;
  private pokemon: Map<string, Pokemon>;
  private acceptance: Map<string, boolean>;

  constructor(
    readonly players: Client[],
    private dtService: DirectTradeService,
  ) {
    this.id = uuidV4();
    this.pokemon = new Map<string, Pokemon>();
    this.acceptance = new Map<string, boolean>();

    for (const player of players) {
      player.onDisconnect(() => this.stop());
    }
  }

  public setPokemon(clientId: string, pokemon: Pokemon) {
    this.pokemon.set(clientId, pokemon);

    const packetParam = JSON.stringify(pokemon);
    for (const player of this.players) {
      player.sendPacket(
        new Packet(TradePacketType.TRADEPKM, [
          (clientId === player.id).toString(),
          packetParam,
        ]),
      );
    }
  }

  public setPlayerAccepts(clientId: string, accept: boolean) {
    this.acceptance.set(clientId, accept);

    let allAccepted = true;
    for (const player of this.players) {
      player.sendPacket(
        new Packet(TradePacketType.TRADEACPT, [
          (clientId === player.id).toString(),
          accept.toString(),
        ]),
      );
      allAccepted = allAccepted && this.acceptance.get(player.id);
    }

    if (allAccepted) {
      const player1 = this.players[0];
      const player2 = this.players[1];

      const poke1 = this.pokemon.get(player1.id);
      const poke2 = this.pokemon.get(player2.id);

      if (poke1 && poke2) {
        player1.sendPacket(
          new Packet(TradePacketType.TRADEFIN, [JSON.stringify(poke2)]),
        );
        player2.sendPacket(
          new Packet(TradePacketType.TRADEFIN, [JSON.stringify(poke1)]),
        );
      }

      this.stop();
    }
  }

  public stop() {
    this.dtService.endTrade(this.id);
  }
}
