import { Controller } from '@nestjs/common';
import { RealtyService } from './realty.service';

@Controller('realty')
export class RealtyController {
  constructor(private readonly realtyService: RealtyService) {}
}
