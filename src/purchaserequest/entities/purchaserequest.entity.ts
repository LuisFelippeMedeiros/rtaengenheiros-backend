export class PurchaseRequest {
  id: string;
  identifier: number;
  reason: string;
  status: string;
  active: boolean;
  comment: string;
  created_at: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  rejected_at?: Date;
  rejected_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  company_id?: string;
}
