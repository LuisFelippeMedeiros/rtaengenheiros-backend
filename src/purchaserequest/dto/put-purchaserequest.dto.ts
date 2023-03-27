import { IsBoolean, IsString, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PutPurchaseRequestDto extends PartialType(PostPurchaseRequestDto) {
  @IsArray()
  product_id: Array<string>;

  @IsString()
  reason: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  comment: string;

  @IsString()
  status_id?: string;

  @IsString()
  company_id?: string;

  @IsString()
  purchaserequest_id: number;
}
