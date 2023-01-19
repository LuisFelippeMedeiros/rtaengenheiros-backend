import { PartialType } from '@nestjs/mapped-types';
import { PostUserDto } from './post-user.dto';

import { IsBoolean, IsString, MinLength, Matches } from 'class-validator';

export class PutUserDto extends PartialType(PostUserDto) {
  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  password?: string;

  @IsBoolean()
  active?: boolean;

  @IsString()
  group_id: string;

  @IsString()
  avatar: string;
}
