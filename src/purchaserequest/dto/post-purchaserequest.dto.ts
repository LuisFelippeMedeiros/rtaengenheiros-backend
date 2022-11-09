import { IsBoolean, IsString, IsArray } from 'class-validator';
import { PurchaseRequest } from '../entities/purchaserequest.entity';
export class PostPurchaseRequestDto extends PurchaseRequest {
  @IsArray()
  product_id: Array<string>;

  @IsString()
  reason: string;

  @IsBoolean()
  active: boolean = true;

  @IsString()
  comment: string = '';

  // @IsString()
  // company_id?: string;
}
