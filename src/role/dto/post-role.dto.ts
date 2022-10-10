import { Role } from '../entities/role.entity';
import { IsString } from 'class-validator';

export class PostRoleDto extends Role {
  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsString()
  type: string;

  @IsString()
  module: string;

  // @IsString()
  // company_id?: string;
}
