import { Exclude } from 'class-transformer';
export class Group {
  id?: string;
  name: string;
  description?: string;
  active: boolean;
  delete_at: Date;
}

export class GroupExclude {
  id: string;
  name: string;
  @Exclude()
  description: string;
  @Exclude()
  active: boolean;
  @Exclude()
  created_at: Date;
  @Exclude()
  created_by: string;
  @Exclude()
  updated_at: Date;
  @Exclude()
  updated_by: string;
  @Exclude()
  deleted_at: Date;
  @Exclude()
  deleted_by: string;

  constructor(partial: Partial<Group>) {
    Object.assign(this, partial);
  }
}
