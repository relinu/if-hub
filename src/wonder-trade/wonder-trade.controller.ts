import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Pokemon } from '../+models/pokemon.schema';
import { WonderTradeService } from './wonder-trade.service';

@Controller('wondertrade')
export class WonderTradeController {
  constructor(private wtService: WonderTradeService) {}

  @Post()
  @HttpCode(200)
  async handleTrade(@Body() offer: Pokemon): Promise<Pokemon> {
    return await this.wtService.trade(offer);
  }
}
