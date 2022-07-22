import { Group } from '../entities/group.entity';
import { IsBoolean, IsString } from 'class-validator';

export class CreateGroupDto extends Group {
  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;
}
