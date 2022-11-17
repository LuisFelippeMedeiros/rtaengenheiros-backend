import { IsBoolean, IsString, IsArray } from 'class-validator';
import { PurchaseRequest } from '../entities/purchaserequest.entity';
export class PostPurchaseRequestDto extends PurchaseRequest {
  @IsArray()
  product_id: Array<string>;

  @IsString()
  reason: string;

  @IsBoolean()
  active = true;

  @IsString()
  comment = '';

  @IsString()
  company_id?: string;
}
