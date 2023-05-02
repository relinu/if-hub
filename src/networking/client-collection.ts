import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'net';
import { v4 as uuidV4 } from 'uuid';
import { AuthHandler } from './+handlers/auth.handler';
import { PingHandler } from './+handlers/ping.handler';
import { Client } from './+utils/client';
import { HandlerRegistry } from './handler-registry';

@Injectable()
export class ClientCollection {
  private readonly logger = new Logger(ClientCollection.name);
  private clients: Map<string, Client>;

  constructor(private handlerRegistry: HandlerRegistry) {
    this.clients = new Map<string, Client>();
  }

  public addClient(socket: Socket): Client {
    const clientId = uuidV4();
    const newClient = new Client(clientId, socket);
    newClient.onDisconnect(() => this.removeClient(newClient.id));

    this.handlerRegistry.addHandler(newClient, PingHandler);
    this.handlerRegistry.addHandler(newClient, AuthHandler);

    this.clients.set(newClient.id, newClient);
    return newClient;
  }

  public getClient(id: string): Client {
    return this.clients.get(id);
  }

  private removeClient(id: string): boolean {
    this.logger.debug(`Client(${id}) removed from client collection`);
    return this.clients.delete(id);
  }
}
