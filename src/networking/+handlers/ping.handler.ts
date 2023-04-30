import { Injectable, Logger } from '@nestjs/common';
import { BaseHandler } from 'src/networking/+handlers/base.handler';
import { Client } from 'src/networking/+models/client';
import { Packet } from 'src/networking/+models/packet';

@Injectable()
export class PingHandler extends BaseHandler {
  private readonly logger = new Logger(PingHandler.name);

  constructor() {
    super();
  }

  public get type(): string {
    return 'PING';
  }

  public check(): boolean {
    return true;
  }

  public handle(client: Client): boolean {
    this.logger.debug(`Client(${client.id}) send ping`);
    client.sendPacket(new Packet(this.type));
    return true;
  }
}
