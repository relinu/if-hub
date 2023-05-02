import { Injectable, Logger } from '@nestjs/common';
import { GameMode } from 'src/+utils/game-mode';
import { Client } from './+utils/client';

export abstract class GameModeSelector {
  abstract initialize(client: Client): void;
}

@Injectable()
export class GameModeRegistry {
  private readonly logger = new Logger(GameModeRegistry.name);
  private selectors: Map<GameMode, GameModeSelector>;

  constructor() {
    this.selectors = new Map<GameMode, GameModeSelector>();
  }

  public addGamemode<T extends GameModeSelector>(mode: GameMode, selector: T) {
    this.logger.debug(`Added selector for gamemode: ${mode}`);
    this.selectors.set(mode, selector);
  }

  public getSelector(mode: GameMode): GameModeSelector {
    return this.selectors.get(mode);
  }
}
