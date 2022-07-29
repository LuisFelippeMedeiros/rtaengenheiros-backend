/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RouteVersion } from 'src/statics/route.version';
import { User } from './entities/user.entity';

@Controller({
  path: RouteVersion.route + 'users',
  version: RouteVersion.version,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    return this.userService.create(createUserDto, req);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findPagination(
    @Query('pageIndex') pageIndex: number = 1,
    @Query('pageSize') pageSize: number = 1,
    @Query('onlyRowCount') onlyRowCount: boolean = false,
    @Query('active') active = true,
  ) {
    // eslint-disable-next-line prefer-const
    const pagination: IPagination = { pageIndex, pageSize, onlyRowCount };
    return await this.userService.findAll(pagination, active);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (user) return new User(user);
    else
      throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
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
