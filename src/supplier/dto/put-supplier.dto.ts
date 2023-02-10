import { PartialType } from '@nestjs/mapped-types';
import { PostSupplierDto } from './post-supplier.dto';
import { IsOptional, IsString } from 'class-validator';

export class PutSupplierDto extends PartialType(PostSupplierDto) {
  @IsString()
  name: string;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  account: string;

  @IsOptional()
  @IsString()
  account_type: string;

  @IsOptional()
  @IsString()
  operation: string;

  @IsOptional()
  @IsString()
  cnpj: string;

  @IsOptional()
  @IsString()
  agency: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsOptional()
  @IsString()
  pix: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement: string;
}
