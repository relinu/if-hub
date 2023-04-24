import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TradeOffer } from './+models/trade-offer.schema';

@WebSocketGateway()
export class WondertradeGateway {
  @WebSocketServer() server: Server;

  sendNewOffer(offer: TradeOffer) {
    console.log('send offer: ' + offer.personal_id);
    this.server.emit('newOffer', offer.pokemon_species);
  }
}
