import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
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
  create(@Body() postRoleDto: PostRoleDto, @Req() req: any) {
    return this.roleService.create(postRoleDto, req);
  }

  @Get('all')
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() putRoleDto: PutRoleDto,
    @Req() req: any,
  ) {
    return this.roleService.update(id, putRoleDto, req);
  }
}
