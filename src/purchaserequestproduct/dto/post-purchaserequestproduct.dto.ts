import { IsString } from 'class-validator';
import { PurchaseRequestProduct } from '../entities/purchaserequestproduct.entity';

export class PostPurchaseRequestProductDto extends PurchaseRequestProduct {
  @IsString()
  product_id?: string;

  @IsString()
  purchaserequest_id?: string;
}
