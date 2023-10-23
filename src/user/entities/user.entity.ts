import { Exclude } from 'class-transformer';

export class User {
  id?: string;
  name: string;
  email: string;
  active: boolean;
  @Exclude()
  password: string;
  @Exclude()
  group_id: string;
  // @Exclude()
  company_id?: string;
  avatar?: string;
  is_responsible?: boolean;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class UserPost {
  id?: string;
  name: string;
  email: string;
  password: string;
  group_id: string;
  company_id?: string;
  is_responsible?: boolean;
  // avatar?: string;
}
