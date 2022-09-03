export class PurchaseRequest {
  id: string;
  quantity?: string;
  reason: string;
  status: string;
  active: boolean;
  comment: string;
  product_id?: string;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  rejected_at?: Date;
  rejected_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
}
