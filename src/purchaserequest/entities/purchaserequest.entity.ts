export class PurchaseRequest {
  id: string;
  identifier: number;
  reason: string;
  status_id: string;
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
  approvedgestor_at?: Date;
  approvedgestor_by?: string;
  approveddiretor_at?: Date;
  approveddiretor_by?: string;
}

export class PurchaseRequestFilter {
  id?: string;
  initial_date?: Date;
  final_date?: Date;
  created_by?: string;
  company_id?: string;
}
