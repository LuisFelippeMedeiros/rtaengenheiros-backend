import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { PostProductDto } from './post-product.dto';

export class PutProductDto extends PartialType(PostProductDto) {
  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;
}
