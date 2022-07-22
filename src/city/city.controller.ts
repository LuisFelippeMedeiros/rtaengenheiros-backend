import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @IsPublic()
  @Get(':state_id')
  find(@Param('state_id') state_id: number) {
    return this.cityService.findByState(state_id);
  }
}
