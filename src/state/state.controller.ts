import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { RouteVersion } from 'src/statics/route.version';
import { StateService } from './state.service';

@Controller({
  path: RouteVersion.route + 'state',
  version: RouteVersion.version,
})
export class StateController {
  constructor(private readonly stateService: StateService) {}
  @IsPublic()
  @Get()
  findAll() {
    return this.stateService.findAll();
  }
}
