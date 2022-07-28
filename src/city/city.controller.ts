import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { RouteVersion } from 'src/statics/route.version';
import { CityService } from './city.service';

@Controller({
  path: RouteVersion.route + 'cities',
  version: RouteVersion.version,
})
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @IsPublic()
  @Get('state/:id')
  find(@Param('id') ufId: number, @Query('name') filter: string) {
    return this.cityService.findByState(ufId, filter);
  }
}
