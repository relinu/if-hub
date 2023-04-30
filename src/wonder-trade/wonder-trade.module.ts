import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeOffer, TradeOfferSchema } from './+models/trade-offer.schema';
import { WonderTradeController } from './wonder-trade.controller';
import { WonderTradeService } from './wonder-trade.service';
import { WonderTradeGateway } from './wonder-trade.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeOffer.name, schema: TradeOfferSchema },
    ]),
  ],
  controllers: [WonderTradeController],
  providers: [WonderTradeService, WonderTradeGateway],
})
export class WonderTradeModule {}
