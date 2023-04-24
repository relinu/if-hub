import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TradeOffer } from './+models/trade-offer.schema';
import { WondertradeService } from './wondertrade.service';

@Controller('wondertrade')
export class WondertradeController {
  constructor(private wtService: WondertradeService) {}

  @Post()
  @HttpCode(200)
  async handleTrade(@Body() offer: TradeOffer): Promise<TradeOffer> {
    return await this.wtService.trade(offer);
  }
}
