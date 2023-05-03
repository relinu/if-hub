import { Logger } from '@nestjs/common';
import { Socket } from 'net';
import { EventEmitter } from 'stream';
import { DATA_KEY_AUTH } from '../+handlers/auth.handler';
import { BaseHandler } from '../+handlers/base.handler';
import { Packet } from './packet';

const NET_AUTH_TIMEOUT_DEFAULT = 2 * 1000;
const EVENT_DISCONNECT = 'disconnect';
export const DATA_KEY_NAME = 'name_key';

export class Client {
  private readonly logger = new Logger(Client.name);

  readonly id: string;
  private socket: Socket;
  readonly handlers: Map<string, BaseHandler>;
  private data: Map<string, any>;
  private timeout: NodeJS.Timeout;
  private event: EventEmitter;

  constructor(id: string, socket: Socket) {
    this.id = id;
    this.socket = socket;
    this.event = new EventEmitter();
    this.data = new Map<string, any>();
    this.setData(DATA_KEY_AUTH, false);

    this.handlers = new Map<string, BaseHandler>();
    this.timeout = setTimeout(
      () => this.disconnect(),
      NET_AUTH_TIMEOUT_DEFAULT,
    );

    this.logger.log(`New client connected with id: ${this.id}`);
  }

  public disconnect(msg = '') {
    if (this.event) {
      this.logger.log(`Client(${this.id}) disconnected`);
      this.event.emit(EVENT_DISCONNECT, this.id);
      this.event.removeAllListeners();
      this.event = undefined;
    }

    if (this.socket && !this.socket.destroyed) {
      const error = msg ? { name: 'error', message: msg } : undefined;
      this.socket.destroy(error);
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
    if (this.socket.writable) {
      this.socket.write(packet.toString());
    }
  }

  public addHandler(handler: BaseHandler) {
    this.handlers.set(handler.type, handler);
  }

  public removeHandler(handler: BaseHandler) {
    this.handlers.delete(handler.type);
  }

  public onDisconnect(handler: (id: string) => void, remove = false) {
    if (remove) {
      this.event.removeListener(EVENT_DISCONNECT, handler);
    } else {
      this.event.on(EVENT_DISCONNECT, handler);
    }
  }

  public clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
