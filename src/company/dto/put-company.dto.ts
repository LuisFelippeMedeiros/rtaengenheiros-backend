import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { PostCompanyDto } from './post-company.dto';

export class PutCompanyDto extends PartialType(PostCompanyDto) {
  @IsString()
  ie: string;

  @IsBoolean()
  active: boolean;

  @IsInt()
  city_id?: number;
}
