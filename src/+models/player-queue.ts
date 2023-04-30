export const QUEUE_DATA_KEY = 'queue_key';
export const QUEUE_PACKET_TYPE = 'QUEUE';

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
