import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';
import { CompanyService } from './company.service';
import { PostCompanyDto } from './dto/post-company.dto';
import { PutCompanyDto } from './dto/put-company.dto';

@ApiTags('Companies')
@Controller({
  path: RouteVersion.route + 'company',
  version: RouteVersion.version,
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('rowCount')
  async countRows(@Query('active') active: boolean) {
    return await this.companyService.rowCount(active);
  }

  @Get('all')
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findById(id);
  }

  @Post('create-company')
  async create(@Body() postCompanyDto: PostCompanyDto, @Req() req: any) {
    return await this.companyService.create(postCompanyDto, req);
  }

  @Get()
  async findPagination(
    @Query('page') page: number,
    @Query('active') active: boolean,
    @Query('filter') filter: string,
  ) {
    return await this.companyService.findPagination(page, active, filter);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.companyService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putCompanyDto: PutCompanyDto,
    @Req() req: any,
  ) {
    return await this.companyService.update(id, putCompanyDto, req);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.companyService.deactivate(id, req);
  }
}
