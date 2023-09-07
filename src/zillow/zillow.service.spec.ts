import { Test, TestingModule } from '@nestjs/testing';
import { ZillowService } from './zillow.service';

describe('ZillowService', () => {
  let service: ZillowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZillowService],
    }).compile();

    service = module.get<ZillowService>(ZillowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
