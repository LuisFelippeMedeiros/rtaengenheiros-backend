import { Controller, Get, Param } from '@nestjs/common';
import { RouteVersion } from 'src/statics/route.version';
import { CompanyService } from './company.service';

@Controller({
  path: RouteVersion.route + 'company',
  version: RouteVersion.version
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findById(id);
  }
}
