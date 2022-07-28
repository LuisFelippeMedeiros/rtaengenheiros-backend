import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RouteVersion } from 'src/statics/route.version';

@Controller({
  path: RouteVersion.route + 'roles',
  version: RouteVersion.version
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create-role')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
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
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }
}
