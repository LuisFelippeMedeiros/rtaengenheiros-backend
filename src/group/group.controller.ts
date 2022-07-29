import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { PostGroupDto } from './dto/post-group.dto';
import { PutGroupDto } from './dto/put-group.dto';
import { RouteVersion } from 'src/statics/route.version';

@Controller({
  path: RouteVersion.route + 'groups',
  version: RouteVersion.version,
})
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create-group')
  async create(@Body() postGroupDto: PostGroupDto) {
    return await this.groupService.create(postGroupDto);
  }

  @Get()
  async findAll() {
    return await this.groupService.findAll();
  }

  @Get('/byname/:name')
  async findOne(@Param('name') name: string) {
    return await this.groupService.findByName(name);
  }

  @Get('/byid/:id')
  async findGroup(@Param('id') id: string) {
    return await this.groupService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() putGroupDto: PutGroupDto) {
    return await this.groupService.update(id, putGroupDto);
  }
}
