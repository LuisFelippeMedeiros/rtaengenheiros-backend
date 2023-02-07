import { PartialType } from '@nestjs/mapped-types';
import { PostUserDto } from './post-user.dto';

import { IsString, MinLength, Matches } from 'class-validator';

export class PatchUserDto extends PartialType(PostUserDto) {
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  password: string;

  @IsString()
  password_confirmation: string;
}
