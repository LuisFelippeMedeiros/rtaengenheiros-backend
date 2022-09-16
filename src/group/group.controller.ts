import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Req,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { PostGroupDto } from './dto/post-group.dto';
import { PutGroupDto } from './dto/put-group.dto';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
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

  @Get('all')
  async findAll() {
    return await this.groupService.findAll();
  }

  @Get('byname/:name')
  async findOne(@Param('name') name: string) {
    return await this.groupService.findByName(name);
  }

  @Get(':id')
  async findGroup(@Param('id') id: string) {
    return await this.groupService.findById(id);
  }

  @Get('rolesgroup/:id')
  async findRolesByGroup(@Param('group_id') group_id: string) {
    return await this.groupService.findRolesById(group_id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putGroupDto: PutGroupDto,
    @Req() req: any,
  ) {
    return await this.groupService.update(id, putGroupDto, req);
  }

  @Delete('deactivate/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.groupService.deactivate(id, req);
  }
}
