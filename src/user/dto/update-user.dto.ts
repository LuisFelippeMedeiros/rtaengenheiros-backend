import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsString()
  bank: string;

  @IsString()
  agency: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Senha muito fraca' })
  password: string;

  @IsNumber()
  city_id?: number;

  @IsNumber()
  state_id?: number;

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
  group_id: string;
}
