import { Controller } from '@nestjs/common';
import { ZillowService } from './zillow.service';

@Controller('zillow')
export class ZillowController {
  constructor(private readonly zillowService: ZillowService) {}
}
