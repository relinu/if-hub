import { Test, TestingModule } from '@nestjs/testing';
import { WonderTradeGateway } from './wonder-trade.gateway';

describe('WonderTradeGateway', () => {
  let gateway: WonderTradeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WonderTradeGateway],
    }).compile();

    gateway = module.get<WonderTradeGateway>(WonderTradeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
