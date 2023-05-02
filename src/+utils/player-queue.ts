export const DATA_KEY_QUEUE = 'queue_key';
export const PACKET_QUEUE = 'QUEUE';

export class PlayerQueue<T extends number | string> {
  private queues: Map<T, string[]>;

  constructor() {
    this.queues = new Map<T, string[]>();
  }

  enqueue(queueId: T, player: string) {
    let queue = this.queues.get(queueId);
    if (!queue) {
      queue = [];
      this.queues.set(queueId, queue);
    }

    queue.push(player);
  }

  find(queueId: T, count = 1): string[] {
    const queue = this.queues.get(queueId);
    if (queue && queue.length >= count) {
      if (count == 1) {
        return [queue.shift()];
      } else {
        return queue.splice(0, count);
      }
    }

    return undefined;
  }
}
