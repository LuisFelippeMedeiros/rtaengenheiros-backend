import { PartialType } from '@nestjs/swagger';
import { PurchaseRequestFilter } from '../entities/purchaserequest.entity';

export class GetPurchaseRequestFilterDto extends PartialType(
  PurchaseRequestFilter,
) {
  id?: string;
  initial_date?: Date;
  final_date?: Date;
  created_by?: string;
  company_id?: string;
  status_id?: string;
}
