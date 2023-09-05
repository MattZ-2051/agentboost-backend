import { Controller } from '@nestjs/common';
import { GmcService } from './gmc.service';

@Controller('gmc')
export class GmcController {
  constructor(private readonly gmcService: GmcService) {}
}
