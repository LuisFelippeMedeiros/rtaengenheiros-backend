import { PartialType } from '@nestjs/mapped-types';
import { PostRoleDto } from './post-role.dto';

import { IsBoolean, IsString } from 'class-validator';

export class PutRoleDto extends PartialType(PostRoleDto) {
  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  module: string;
}
