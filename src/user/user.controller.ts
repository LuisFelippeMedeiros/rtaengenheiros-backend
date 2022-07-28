import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RouteVersion } from 'src/statics/route.version';

@Controller({
  path: RouteVersion.version + 'users',
  version: '1'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.userService.create(createUserDto, req);
  }

  @Get()
  async findPagination(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 1,
    @Query('onlyRowCount') onlyRowCount: boolean = false,
    @Query('active') active = true
  ) {
    let pagination: IPagination = { pageIndex, pageSize, onlyRowCount }
    return await this.userService.findAll(pagination, active);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, updateUserDto, req);
  }

  @Put('deactivate/:id')
  deactivate(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, updateUserDto, req);
  }
}
