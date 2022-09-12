import { PurchaseRequestBudget } from '../entities/purchaserequestbudget.entity';
import { IsNumber, IsString } from 'class-validator';

export class PostPurchaseRequestBudgetDto extends PurchaseRequestBudget {
  @IsString()
  quantity?: string;

  @IsNumber()
  budget: number;

  @IsString()
  supplier_id: string;

  @IsString()
  purchaserequest_id: string;
}
