import { User } from '../entities/user.entity';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto extends User {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  cpf: string;

  @IsString()
  rg: string;

  @IsString()
  telephone: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsNumber()
  stateId: number;

  @IsNumber()
  cityId: number;

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
  active: boolean;

  @IsString()
  groupId: string;
}
