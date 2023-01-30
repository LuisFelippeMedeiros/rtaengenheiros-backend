import { PartialType } from '@nestjs/swagger';
import { PostUnitDto } from './post-unit.dto';
import { IsString } from 'class-validator';

export class PutUnitDto extends PartialType(PostUnitDto) {
  @IsString()
  initials: string;

  @IsString()
  description: string;
}
