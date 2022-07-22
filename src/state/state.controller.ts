import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}
  @IsPublic()
  @Get()
  findAll() {
    return this.stateService.findAll();
  }
}
