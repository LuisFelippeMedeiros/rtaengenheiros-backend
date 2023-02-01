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
}
