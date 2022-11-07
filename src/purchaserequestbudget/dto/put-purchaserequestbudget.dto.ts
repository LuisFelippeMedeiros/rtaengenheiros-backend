import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { PostPurchaseRequestBudgetDto } from './post-purchaserequestbudget.dto';

export class PutPurchaseRequestBudgetDto extends PartialType(
  PostPurchaseRequestBudgetDto,
) {
  @IsNumber()
  quantity?: number;

  @IsNumber()
  budget: number;

  @IsString()
  supplier_id: string;

  @IsString()
  purchaserequest_id: string;

  @IsString()
  unit_id?: string;

  @IsBoolean()
  to_be_approved?: boolean;
}
