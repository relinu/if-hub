import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, TradeOfferSchema } from '../+models/pokemon.schema';
import { WonderTradeController } from './wonder-trade.controller';
import { WonderTradeService } from './wonder-trade.service';
import { WonderTradeGateway } from './wonder-trade.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: TradeOfferSchema },
    ]),
  ],
  controllers: [WonderTradeController],
  providers: [WonderTradeService, WonderTradeGateway],
})
export class WonderTradeModule {}
