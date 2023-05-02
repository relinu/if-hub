import { Client } from 'src/networking/+utils/client';
import { v4 as uuidV4 } from 'uuid';

export const TRADE_START_PACKET = 'TRADESTR';
export const TRADE_STOP_PACKET = 'TRADESTP';
export const TRADE_DATA_KEY = 'trade_key';

export class Trade {
  readonly id: string;

  constructor(readonly players: Client[]) {
    this.id = uuidV4();

    // TODO: add disconnect handlers?
  }

  public setPokemon(clientId: string, pokemon: object) {
    // TODO: set pokemon; send packets to players
  }

  public setPlayerAccepts(clientId: string, accept: boolean) {
    // TODO: set acceptance; send packets to players;
    //       check if both accepted -> run trade
  }
}
