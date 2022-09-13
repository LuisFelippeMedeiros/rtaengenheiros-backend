import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { PostStatusDto } from './dto/post-status.dto';
import { PutStatusDto } from './dto/put-status.dto';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller({
  path: RouteVersion.route + 'status',
  version: RouteVersion.version,
})
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post('create-status')
  async create(@Body() postStatusDto: PostStatusDto, @Req() req: any) {
    return this.statusService.create(postStatusDto, req);
  }

  @Get('all')
  async findAll() {
    return this.statusService.findAll();
  }

  @Get('byname/:name')
  async findOne(@Param('name') name: string) {
    return this.statusService.findByName(name);
  }

  @Get(':id')
  async findStatus(@Param('id') id: string) {
    return this.statusService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putStatusDto: PutStatusDto,
    @Req() req: any,
  ) {
    return this.statusService.update(id, putStatusDto, req);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.statusService.deactivate(id, req);
  }
}
