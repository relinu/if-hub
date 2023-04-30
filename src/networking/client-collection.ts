import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { v4 as uuidV4 } from 'uuid';
import { AuthHandler } from './+handlers/auth.handler';
import { Client } from './+models/client';
import { HandlerRegistry } from './handler-registry';

@Injectable()
export class ClientCollection {
  private clients: Map<string, Client>;

  constructor(private handlerRegistry: HandlerRegistry) {
    this.clients = new Map<string, Client>();
  }

  public addClient(socket: Socket): Client {
    const clientId = uuidV4();
    const newClient = new Client(clientId, socket, this);
    this.handlerRegistry.addHandler(newClient, AuthHandler);

    this.clients.set(newClient.id, newClient);
    return newClient;
  }

  public getClient(id: string): Client {
    return this.clients.get(id);
  }

  public removeClient(id: string): boolean {
    const client = this.clients.get(id);
    if (client) {
      client.disconnect();
    }

    return this.clients.delete(id);
  }
}
