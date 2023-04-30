import { Test, TestingModule } from '@nestjs/testing';
import { DirectTradeService } from './direct-trade.service';

describe('DirectTradeService', () => {
  let service: DirectTradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectTradeService],
    }).compile();

    service = module.get<DirectTradeService>(DirectTradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
