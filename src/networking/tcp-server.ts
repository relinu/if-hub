import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { createServer, Server as TCPServer, Socket } from 'net';
import { Client } from './+utils/client';
import { Packet } from './+utils/packet';
import { ClientCollection } from './client-collection';

const NET_SERVER_PORT_DEFAULT = 8478;
const NET_SOCKET_TIMEOUT_DEFAULT = 60 * 1000;

@Injectable()
export class TcpServer
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private readonly logger = new Logger(TcpServer.name);
  private server: TCPServer;

  constructor(private clientCollection: ClientCollection) {
    this.server = createServer(
      {
        allowHalfOpen: false,
        pauseOnConnect: false,
      },
      (socket) => this.clientConnected(socket),
    );
  }

  onApplicationBootstrap() {
    this.logger.log('TCP Server starting...');
    this.server.listen(NET_SERVER_PORT_DEFAULT);
  }

  beforeApplicationShutdown() {
    this.logger.log('TCP Server closing...');
    this.server.close();
  }

  public getClient(clientId: string): Client {
    return this.clientCollection.getClient(clientId);
  }

  private clientConnected(socket: Socket) {
    socket.setTimeout(NET_SOCKET_TIMEOUT_DEFAULT);
    const client = this.clientCollection.addClient(socket);
    const buffer = '';

    // on data
    socket.on('data', (data) =>
      this.handleConnectionData(client, data, buffer),
    );

    // disconnect client
    socket.on('end', () => client.disconnect());
    socket.on('error', () => client.disconnect());
    socket.on('close', () => client.disconnect());
    socket.on('timeout', () => client.disconnect());
  }

  private handleConnectionData(client: Client, data: Buffer, buffer: string) {
    buffer += data.toString();
    const msgs = buffer.split('\n');
    const lastIndex = msgs.length - 1;

    for (let i = 0; i < lastIndex; i++) {
      const packet = Packet.toPacket(msgs[i].trim());
      this.logger.debug(`Client(${client.id}) sent packet: ${packet.type}`);
      if (packet) {
        const handler = client.handlers.get(packet.type);
        if (handler && handler.check(client, packet)) {
          handler.handle(client, packet);
        } else {
          this.logger.debug(
            `Handler check failed for packet(${packet.type}) of Client(${client.id})`,
          );
        }
      } else {
        this.logger.debug(`Could not parse packet of Client(${client.id})`);
      }
    }

    buffer = msgs[lastIndex];
  }
}
