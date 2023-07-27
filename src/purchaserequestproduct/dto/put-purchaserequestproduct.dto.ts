import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PostPurchaseRequestProductDto } from './post-purchaserequestproduct.dto';

export class PutPurchaseRequestProductDto extends PartialType(
  PostPurchaseRequestProductDto,
) {
  @IsString()
  product_id?: string;

  @IsString()
  purchaserequest_id?: string;

  @IsString()
  supplier_id?: string;
}
