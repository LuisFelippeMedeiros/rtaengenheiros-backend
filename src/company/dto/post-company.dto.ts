import { IsInt, IsString } from 'class-validator';
import { Company } from '../entities/company.entity';

export class PostCompanyDto extends Company {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  ie: string;

  @IsInt()
  city_id: number;
}
