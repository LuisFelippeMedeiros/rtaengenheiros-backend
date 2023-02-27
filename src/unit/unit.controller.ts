import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { PostUnitDto } from './dto/post-unit.dto';
import { PutUnitDto } from './dto/put-unit.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('Unit')
@Controller({
  path: RouteVersion.route + 'unit',
  version: RouteVersion.version,
})
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post('create-unit')
  async create(@Body() postUnitDto: PostUnitDto, @Req() req: any) {
    return this.unitService.create(postUnitDto, req);
  }

  @Get()
  async findPagination(
    @Query('page') page: number,
    @Query('active') active: boolean,
    @Query('filter') filter: string
  ) {
    return await this.unitService.findPagination(page, active, filter);
  }

  @Get('rowCount')
  async countRows(@Query('active') active: boolean) {
    return await this.unitService.rowCount(active);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.unitService.findById(id);
  }

  @Get('byName/:initials')
  async findByName(@Param('initials') initials: string) {
    return this.unitService.findByName(initials);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() putUnitDto: PutUnitDto,
    @Req() req: any,
  ) {
    return this.unitService.update(id, putUnitDto, req);
  }

  @Delete('deactivate/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.unitService.deactivate(id, req);
  }
}
