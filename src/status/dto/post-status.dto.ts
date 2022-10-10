import { Status } from '../entities/status.entity';
import { IsString } from 'class-validator';

export class PostStatusDto extends Status {
  @IsString()
  name: string;

  // @IsString()
  // company_id?: string;
}
