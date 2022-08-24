import { PartialType } from '@nestjs/mapped-types';
import { PostSupplierDto } from './post-supplier.dto';
import { IsString } from 'class-validator';

export class PutSupplierDto extends PartialType(PostSupplierDto) {
  @IsString()
  name: string;

  @IsString()
  telephone: string;

  @IsString()
  account: string;

  @IsString()
  cnpj: string;

  @IsString()
  ie: string;

  @IsString()
  agency: string;

  @IsString()
  bank: string;

  @IsString()
  pix: string;

  @IsString()
  pix2: string;

  @IsString()
  address: string;

  @IsString()
  district: string;

  @IsString()
  number: string;

  @IsString()
  complement: string;
}
