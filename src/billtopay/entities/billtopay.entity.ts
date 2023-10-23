export class BillToPay {
  id: string;
  type?: string;
  name: string;
  identifier: number;
  payment_info?: string;
  due_date?: Date;
  scheduling?: Date;
  reference_month?: string;
  issue_date?: Date;
  comment?: string;
  bill_status?: string;
  dda?: boolean;
  price_approved?: number;
  price_updated?: number;
  invoice_attachment?: string;
  supplier_id?: string;
  active: boolean;
  created_at: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  company_id?: string;
  purchaserequest_identifier?: number;
}
