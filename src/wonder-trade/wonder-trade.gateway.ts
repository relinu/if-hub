import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TradeOffer } from './+models/trade-offer.schema';

@WebSocketGateway()
export class WonderTradeGateway {
  @WebSocketServer() server: Server;

  sendNewOffer(offer: TradeOffer) {
    this.server.emit('newOffer', offer.pokemon_species);
  }
}
