import { Group } from '../entities/group.entity';
import { IsString } from 'class-validator';

export class PostGroupDto extends Group {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}
