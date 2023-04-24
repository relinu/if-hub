import { Test, TestingModule } from '@nestjs/testing';
import { WondertradeService } from './wondertrade.service';

describe('WondertradeService', () => {
  let service: WondertradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WondertradeService],
    }).compile();

    service = module.get<WondertradeService>(WondertradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
