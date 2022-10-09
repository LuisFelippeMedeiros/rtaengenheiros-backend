import { PurchaseRequestBudget } from '../entities/purchaserequestbudget.entity';
import { IsNumber, IsString } from 'class-validator';

export class PostPurchaseRequestBudgetDto extends PurchaseRequestBudget {
  @IsNumber()
  quantity?: number;

  @IsNumber()
  budget: number;

  @IsString()
  supplier_id: string;

  @IsString()
  purchaserequest_id: string;
}