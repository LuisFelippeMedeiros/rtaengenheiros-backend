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
import { PostUserDto } from './dto/post-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import { RouteVersion } from 'src/statics/route.version';
import { User } from './entities/user.entity';

@Controller({
  path: RouteVersion.route + 'users',
  version: RouteVersion.version,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  create(@Body() postUserDto: PostUserDto, @Req() req: any) {
    return this.userService.create(postUserDto, req);
  }

  @Get('rowCount')
  async countRows() {
    return await this.userService.rowCount()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query('page') page: number, @Query('active') active: boolean) {
    return await this.userService.findAll(page, active);
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
    @Body() putUserDto: PutUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, putUserDto, req);
  }

  @Put('deactivate/:id')
  deactivate(
    @Param('id') id: string,
    @Body() putUserDto: PutUserDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, putUserDto, req);
  }
}
