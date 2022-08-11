import { PartialType } from '@nestjs/mapped-types';
import { PostRolesGroupDto } from './post-rolesgroup.dto';
import { IsString } from 'class-validator';

export class PutRolesGroupDto extends PartialType(PostRolesGroupDto) {
  @IsString()
  group_id: string;

  @IsString()
  role_id: string;
}
