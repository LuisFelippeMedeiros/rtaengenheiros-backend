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
  Delete,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PostUserDto } from './dto/post-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { RouteVersion } from 'src/statics/route.version';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
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
  async countRows(@Query('active') active: boolean, @Req() req: any) {
    return await this.userService.rowCount(active, req);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  async findAll(
    @Query('page') page: number,
    @Query('active') active: boolean,
    @Req() req: any,
  ) {
    return await this.userService.findAll(page, active, req);
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

  @Delete('deactivate/:id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.userService.deactivate(id, req);
  }

  @Patch('password/:id')
  password(
    @Param('id') id: string,
    @Body() patchUserDto: PatchUserDto,
    @Req() req: any,
  ) {
    return this.userService.password(id, patchUserDto, req);
  }

  @Patch('avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const result = await this.userService.uploadAvatar(
      id,
      file.buffer,
      file.originalname,
    );
    return result;
  }
}
