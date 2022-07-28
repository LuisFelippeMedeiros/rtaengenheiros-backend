import { Exclude } from "class-transformer";

export class User {
  id?: string;
  name: string;
  email: string;
  active: boolean;

  @Exclude()
  password: string;

  @Exclude()
  group_id: string;

  constructor (partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
