import { IsBoolean, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class PostCategoryDto extends Category {
  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;
}
