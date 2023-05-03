import { Client } from "src/networking/+utils/client";

export const DATA_KEY_QUEUE = 'queue_key';
export const PACKET_QUEUE = 'QUEUE';

export class PlayerQueue<T extends number | string> {
  private queues: Map<T, string[]>;
  private disconnectHandlers: Map<string, () => void>;

  constructor() {
    this.queues = new Map<T, string[]>();
    this.disconnectHandlers = new Map<string, () => void>();
  }

  enqueue(queueId: T, player: Client) {
    let queue = this.queues.get(queueId);
    if (!queue) {
      queue = [];
      this.queues.set(queueId, queue);
    }

    player.onDisconnect(this.createDisconnectHandler(queueId, player));
    queue.push(player.id);
  }

  find(queueId: T, count = 1): string[] {
    const queue = this.queues.get(queueId);
    var retValue: string[] = undefined;

    if (queue && queue.length >= count) {
      if (count == 1) {
        retValue = [queue.shift()];
      } else {
        retValue = queue.splice(0, count);
      }
    }

    if (retValue) {
      for (const pId of retValue) {
        const dHapndler = this.disconnectHandlers.get(pId);
        if (dHapndler) {
          dHapndler();
          this.disconnectHandlers.delete(pId);
        }
      }
    }

    return retValue;
  }

  private createDisconnectHandler(queueId: T, player: Client) {
    const dHandler = () => {
      const queue = this.queues.get(queueId);
      if (queue) {
        const i = queue.findIndex(e => e === player.id);
        if (i >= 0) {
          queue.splice(i, 1);
        }
      }
    }

    this.disconnectHandlers.set(player.id, () => {
      player.onDisconnect(dHandler, true);
      this.disconnectHandlers.delete(player.id);
    });

    return dHandler;
  }
}
