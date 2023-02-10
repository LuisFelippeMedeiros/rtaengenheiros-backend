import { Supplier } from '../entities/supplier.entity';
import { IsOptional, IsString } from 'class-validator';

export class PostSupplierDto extends Supplier {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  email: string;

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

  @IsString()
  company_id: string;
}
