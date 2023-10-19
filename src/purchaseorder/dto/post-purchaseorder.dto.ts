import { IsString, IsNumber } from 'class-validator';
import { PurchaseOrder } from '../entities/purchaseorder.entity';

export class PostPurchaseOrderDto extends PurchaseOrder {
  @IsString()
  supplier_id?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  purchaseorderproduct_id?: string;
}
