import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';
import { StateService } from './state.service';

@ApiTags('states')
@Controller({
  path: RouteVersion.route + 'state',
  version: RouteVersion.version,
})
export class StateController {
  constructor(private readonly stateService: StateService) {}
  @Get('all')
  findAll() {
    return this.stateService.findAll();
  }
}
