import { IsString } from 'class-validator';
import { Unit } from '../entities/unit.entity';

export class PostUnitDto extends Unit {
  @IsString()
  initials: string;

  @IsString()
  description: string;
}
