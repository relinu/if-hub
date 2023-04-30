import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TradeOffer } from './+models/trade-offer.schema';
import { WonderTradeService } from './wonder-trade.service';

@Controller('wondertrade')
export class WonderTradeController {
  constructor(private wtService: WonderTradeService) {}

  @Post()
  @HttpCode(200)
  async handleTrade(@Body() offer: TradeOffer): Promise<TradeOffer> {
    return await this.wtService.trade(offer);
  }
}
