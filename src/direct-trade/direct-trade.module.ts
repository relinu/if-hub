import { Module } from '@nestjs/common';
import { NetworkingModule } from 'src/networking/networking.module';
import { DirectTradeService } from './direct-trade.service';

@Module({
  providers: [DirectTradeService],
  exports: [DirectTradeService],
  imports: [NetworkingModule],
})
export class DirectTradeModule {}
