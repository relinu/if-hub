import { Client } from './client';

export abstract class GameModeSelector {
  abstract initialize(client: Client): void;
}
