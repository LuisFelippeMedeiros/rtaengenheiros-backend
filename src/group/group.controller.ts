import { Controller, Get, Post, Body, Put, Param, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { PostGroupDto } from './dto/post-group.dto';
import { PutGroupDto } from './dto/put-group.dto';
import { RouteVersion } from 'src/statics/route.version';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller({
  path: RouteVersion.route + 'groups',
  version: RouteVersion.version,
})
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create-group')
  async create(@Body() postGroupDto: PostGroupDto, @Req() req: any) {
    return await this.groupService.create(postGroupDto, req);
  }
  @IsPublic()
  @Get()
  async findAll() {
    return await this.groupService.findAll();
  }

  @Get('/byname/:name')
  async findOne(@Param('name') name: string) {
    return await this.groupService.findByName(name);
  }

  @Get(':id')
  async findGroup(@Param('id') id: string) {
    return await this.groupService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putGroupDto: PutGroupDto,
    @Req() req: any,
  ) {
    return await this.groupService.update(id, putGroupDto, req);
  }

  @Put('deactivate/:id')
  async deactivate(
    @Param('id') id: string,
    @Body() putGroupDto: PutGroupDto,
    @Req() req: any,
  ) {
    return await this.groupService.deactivate(id, putGroupDto, req);
  }
}
