export class PostPurchaseRequestDto {
  id?: string;
  product: string;
  quantity?: string;
  budge1?: string;
  budge2?: string;
  budge3?: string;
  reason: string;
  status: string;
  active: boolean;

  comment: string;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  rejected_at?: Date;
  rejected_by?: string;
}
