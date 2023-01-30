import { Supplier } from '../entities/supplier.entity';
import { IsString } from 'class-validator';

export class PostSupplierDto extends Supplier {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  telephone: string;

  @IsString()
  email: string;

  @IsString()
  account: string;

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

  @IsString()
  ie: string;

  // @IsString()
  // company_id?: string;
}
