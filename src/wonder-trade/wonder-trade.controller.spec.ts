import { Test, TestingModule } from '@nestjs/testing';
import { WonderTradeController } from './wonder-trade.controller';

describe('WonderTradeController', () => {
  let controller: WonderTradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WonderTradeController],
    }).compile();

    controller = module.get<WonderTradeController>(WonderTradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
