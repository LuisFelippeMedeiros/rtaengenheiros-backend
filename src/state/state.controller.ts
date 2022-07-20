import { Controller, Get, Param } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  findAll() {
    return this.stateService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.stateService.findByName(name);
  }
}
