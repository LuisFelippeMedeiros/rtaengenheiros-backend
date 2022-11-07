import { PartialType } from '@nestjs/swagger';
import { PostUnitDto } from './post-unit.dto';
import { IsBoolean, IsString } from 'class-validator';

export class PutUnitDto extends PartialType(PostUnitDto) {
  @IsString()
  initials: string;

  @IsString()
  description: string;

  @IsBoolean()
  active: boolean;
}
