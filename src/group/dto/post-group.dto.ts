import { Group } from '../entities/group.entity';
import { IsArray, IsString } from 'class-validator';

export class PostGroupDto extends Group {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsArray()
  roles: Array<string>;

  // @IsString()
  // company_id?: string;
}
