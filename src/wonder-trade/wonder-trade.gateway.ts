import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Pokemon } from '../+models/pokemon.schema';

@WebSocketGateway()
export class WonderTradeGateway {
  @WebSocketServer() server: Server;

  sendNewOffer(offer: Pokemon) {
    this.server.emit('newOffer', offer.pokemon_species);
  }
}
