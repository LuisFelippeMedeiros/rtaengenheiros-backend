import { IsBoolean, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

export class PostProductDto extends Product {
  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  category_id: string;

  // @IsString()
  // company_id?: string;
}
