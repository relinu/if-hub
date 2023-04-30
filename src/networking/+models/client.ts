import { Logger } from '@nestjs/common';
import { Socket } from 'net';
import { AUTH_DATA_KEY } from '../+handlers/auth.handler';
import { BaseHandler } from '../+handlers/base.handler';
import { ClientCollection } from '../client-collection';
import { Packet } from './packet';

const CLIENT_AUTH_TIMEOUT_DEFAULT = 2 * 1000;

export class Client {
  private readonly logger = new Logger(Client.name);

  readonly id: string;
  private socket: Socket;
  readonly handlers: Map<string, BaseHandler>;
  private data: Map<string, any>;
  private timeout: NodeJS.Timeout;

  constructor(id: string, socket: Socket, private cc: ClientCollection) {
    this.id = id;
    this.socket = socket;
    this.data = new Map<string, any>();
    this.setData(AUTH_DATA_KEY, false);

    this.handlers = new Map<string, BaseHandler>();
    this.timeout = setTimeout(
      () => this.disconnect(),
      CLIENT_AUTH_TIMEOUT_DEFAULT,
    );

    this.logger.log(`New client connected with id: ${this.id}`);
  }

  public disconnect(msg = '') {
    if (this.socket && !this.socket.destroyed) {
      this.logger.log(`Client(${this.id}) disconnected`);
      const error = msg ? { name: 'error', message: msg } : undefined;
      this.socket.destroy(error);
      this.cc.removeClient(this.id);
    }

    this.clearTimeout();
  }

  public getData<T>(key: string) {
    return this.data.get(key) as T;
  }

  public setData<T>(key: string, data: T) {
    this.data.set(key, data);
  }

  public clearData() {
    this.data.clear();
  }

  public sendPacket(packet: Packet) {
    this.socket.write(packet.toString());
  }

  public addHandler(handler: BaseHandler) {
    this.handlers.set(handler.type, handler);
  }

  public removeHandler(handler: BaseHandler) {
    this.handlers.delete(handler.type);
  }

  public clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
