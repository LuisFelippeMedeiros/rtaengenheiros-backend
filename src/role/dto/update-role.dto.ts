import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

import { IsBoolean, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsBoolean()
  active: boolean;
}
