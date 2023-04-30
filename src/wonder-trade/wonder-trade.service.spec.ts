import { Test, TestingModule } from '@nestjs/testing';
import { WonderTradeService } from './wonder-trade.service';

describe('WonderTradeService', () => {
  let service: WonderTradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WonderTradeService],
    }).compile();

    service = module.get<WonderTradeService>(WonderTradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
