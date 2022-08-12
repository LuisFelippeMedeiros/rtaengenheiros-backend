import { RolesGroup } from '../entities/rolesgroup.entity';
import { IsString } from 'class-validator';

export class PostRolesGroupDto extends RolesGroup {
  @IsString()
  group_id: string;

  @IsString()
  role_id: string;
}
