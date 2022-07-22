import { Controller, Get, Param, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  

  
  
    

  @Get('state/:id')
  find(@Param('id') ufId: number, @Query('name')filter: string) {
    return this.cityService.findByState(ufId, filter);

  }
}
