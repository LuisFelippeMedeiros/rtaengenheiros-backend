export class Status {
  id?: string;
  name: string;
  active: boolean;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  // company_id?: string;
}
