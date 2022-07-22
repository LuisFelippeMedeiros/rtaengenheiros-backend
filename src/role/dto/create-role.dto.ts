import { Role } from '../entities/role.entity';
import { IsBoolean, IsString } from 'class-validator';

export class CreateRoleDto extends Role {
  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsBoolean()
  active: boolean;
}
