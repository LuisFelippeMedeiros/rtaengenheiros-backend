import { PartialType } from '@nestjs/swagger';
import { PostStatusDto } from './post-status.dto';
import { IsString } from 'class-validator';

export class PutStatusDto extends PartialType(PostStatusDto) {
  @IsString()
  name: string;
}
