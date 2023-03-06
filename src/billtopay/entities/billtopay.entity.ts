export class BillToPay {
  id: string;
  name: string;
  type?: string;
  payment_info?: string;
  reference_month?: string;
  issue_date?: Date;
  comment?: string;
  due_date?: Date;
  scheduling?: Date;
  supplier_id?: string;
  dda?: boolean;
  price_approved?: number;
  price_updated?: number;
  invoice_attachment?: string;
  active: boolean;
  created_at: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  company_id?: string;
  bill_status?: string;
}
