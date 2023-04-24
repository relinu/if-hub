import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeOffer, TradeOfferSchema } from './+models/trade-offer.schema';
import { WondertradeController } from './wondertrade.controller';
import { WondertradeService } from './wondertrade.service';
import { WondertradeGateway } from './wondertrade.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeOffer.name, schema: TradeOfferSchema },
    ]),
  ],
  controllers: [WondertradeController],
  providers: [WondertradeService, WondertradeGateway],
})
export class WondertradeModule {}
