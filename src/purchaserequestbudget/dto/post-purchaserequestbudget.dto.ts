import { PurchaseRequestBudget } from '../entities/purchaserequestbudget.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostPurchaseRequestBudgetDto extends PurchaseRequestBudget {
  @IsNumber()
  quantity?: number;

  @IsNumber()
  budget: number;

  @IsString()
  supplier_id: string;

  @IsString()
  purchaserequest_id: string;

  @IsOptional()
  @IsNumber()
  shipping_fee?: number;

  // @IsBoolean()
  // to_be_approved?: boolean;

  @IsString()
  product_id?: string;
}
