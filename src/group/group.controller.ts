import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @IsPublic()
  @Post('create-group')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.groupService.findByName(name);
  }

  @Get(':id')
  findGroup(@Param('id') id: string) {
    return this.groupService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }
}
