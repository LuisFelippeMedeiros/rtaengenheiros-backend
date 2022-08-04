import { PartialType } from '@nestjs/mapped-types';
import { PostGroupDto } from './post-group.dto';
import { IsBoolean, IsString } from 'class-validator';

export class PutGroupDto extends PartialType(PostGroupDto) {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  description?: string;
}
