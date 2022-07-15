import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  bank: string;

  @IsString()
  agency: string;

  @IsString()
  account: string;

  @IsString()
  pix: string;

  @IsString()
  address: string;

  @IsString()
  district: string;

  @IsString()
  number: string;

  @IsString()
  complement: string;

  @IsBoolean()
  active?: boolean;

  @IsString()
  groupId: string;
}
