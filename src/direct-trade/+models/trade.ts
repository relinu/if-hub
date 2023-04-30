import { Client } from 'src/networking/+models/client';
import { v4 as uuidV4 } from 'uuid';

export const TRADE_DATA_KEY = 'trade_key';

export class Trade {
  readonly id: string;

  constructor(readonly players: Client[]) {
    this.id = uuidV4();
  }
}
