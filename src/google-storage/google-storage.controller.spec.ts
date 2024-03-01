import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStorageController } from './google-storage.controller';

describe('GoogleStorageController', () => {
  let controller: GoogleStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleStorageController],
    }).compile();

    controller = module.get<GoogleStorageController>(GoogleStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
