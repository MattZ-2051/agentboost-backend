import { Test, TestingModule } from '@nestjs/testing';
import { ZillowController } from './zillow.controller';

describe('ZillowController', () => {
  let controller: ZillowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZillowController],
    }).compile();

    controller = module.get<ZillowController>(ZillowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
