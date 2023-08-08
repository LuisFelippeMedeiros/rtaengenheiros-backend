export class PurchaseRequestBudget {
  id?: string;
  quantity?: number;
  budget: number;
  shipping_fee?: number;
  supplier_id?: string;
  purchaserequest_id?: string;
  to_be_approved?: boolean;
  product_id?: string;
}
