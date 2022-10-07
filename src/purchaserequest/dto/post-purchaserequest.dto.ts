import { IsBoolean, IsString } from 'class-validator';
import { PurchaseRequest } from '../entities/purchaserequest.entity';
export class PostPurchaseRequestDto extends PurchaseRequest {
  @IsString()
  reason: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  comment: string;
}
