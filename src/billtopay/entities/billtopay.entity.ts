export class BillToPay {
  id: string;
  identifier: number;
  name: string;
  payment_info: string;
  authorized: string;
  invoice: string;
  reference_month: string;
  issue_date?: Date;
  comment?: string;
  due_date: Date;
  scheduling?: Date;
  supplier_id?: string;
  dda: boolean;
  price: number;
  invoice_attachment?: string;
  active: boolean;
  created_at: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;
  company_id?: string;
}
