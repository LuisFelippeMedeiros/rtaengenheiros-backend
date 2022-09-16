import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RolesGroupService } from './rolesgroup.service';
import { PostRolesGroupDto } from './dto/post-rolesgroup.dto';
import { PutRolesGroupDto } from './dto/put-rolesgroup.dto';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('RolesGroup')
@Controller({
  path: RouteVersion.route + 'rolesgroup',
  version: RouteVersion.version,
})
export class RolesGroupController {
  constructor(private readonly rolesgroupService: RolesGroupService) {}

  @Post('create-roles-group')
  create(@Body() postRolesgroupDto: PostRolesGroupDto) {
    return this.rolesgroupService.create(postRolesgroupDto);
  }

  @Get('all')
  findAll() {
    return this.rolesgroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesgroupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() putRolesgroupDto: PutRolesGroupDto) {
    return this.rolesgroupService.update(id, putRolesgroupDto);
  }
}
