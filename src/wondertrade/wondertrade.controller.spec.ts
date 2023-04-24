import { Test, TestingModule } from '@nestjs/testing';
import { WondertradeController } from './wondertrade.controller';

describe('WondertradeController', () => {
  let controller: WondertradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WondertradeController],
    }).compile();

    controller = module.get<WondertradeController>(WondertradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
