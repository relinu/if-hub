import { Test, TestingModule } from '@nestjs/testing';
import { WondertradeGateway } from './wondertrade.gateway';

describe('WondertradeGateway', () => {
  let gateway: WondertradeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WondertradeGateway],
    }).compile();

    gateway = module.get<WondertradeGateway>(WondertradeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
