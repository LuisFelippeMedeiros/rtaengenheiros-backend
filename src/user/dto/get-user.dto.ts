import { User } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

export class GetUserDto extends User {
  name: string;
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  group_id: string;
  @Exclude()
  company_id: string;
}
