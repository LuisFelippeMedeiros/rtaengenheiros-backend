import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { PostRoleDto } from './dto/post-role.dto';
import { PutRoleDto } from './dto/put-role.dto';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller({
  path: RouteVersion.route + 'roles',
  version: RouteVersion.version,
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create-role')
  create(@Body() postRoleDto: PostRoleDto) {
    return this.roleService.create(postRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() putRoleDto: PutRoleDto) {
    return this.roleService.update(id, putRoleDto);
  }
}
