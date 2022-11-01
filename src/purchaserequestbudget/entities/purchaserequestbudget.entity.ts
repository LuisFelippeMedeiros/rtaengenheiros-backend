export class PurchaseRequestBudget {
  id?: string;
  quantity?: number;
  budget: number;
  supplier_id?: string;
  purchaserequest_id?: string;
  to_be_approved?: boolean;
  unit_id?: string;
}
