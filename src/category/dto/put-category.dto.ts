import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { PostCategoryDto } from './post-category.dto';

export class PutCategoryDto extends PartialType(PostCategoryDto) {
  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;
}
