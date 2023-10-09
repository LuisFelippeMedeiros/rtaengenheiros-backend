import { IsInt, IsOptional, IsString } from 'class-validator';
import { Company } from '../entities/company.entity';

export class PostCompanyDto extends Company {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  @IsOptional()
  ie: string;

  @IsInt()
  city_id: number;

  @IsString()
  telephone?: string;

  @IsString()
  zip_code?: string;

  @IsString()
  address?: string;

  @IsString()
  internal_name?: string;
}
