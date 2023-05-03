import { Module } from '@nestjs/common';
import { NetworkingModule } from 'src/networking/networking.module';
import { DTRoomHandler } from './+handlers/dtroom.handler';
import { TradeAcceptHandler } from './+handlers/trade-accept.handler';
import { TradePokemonHandler } from './+handlers/trade-pokemon.handler';
import { DirectTradeService } from './direct-trade.service';

@Module({
  providers: [
    DirectTradeService,
    DTRoomHandler,
    {
      provide: 'TradeAcceptHandler',
      useClass: TradeAcceptHandler,
    },
    {
      provide: 'TradePokemonHandler',
      useClass: TradePokemonHandler,
    },
  ],
  imports: [NetworkingModule],
  exports: [DirectTradeService],
})
export class DirectTradeModule {}
