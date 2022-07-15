import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import { IsBoolean } from 'class-validator';

export class InactivateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  active: boolean;
}
