import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BillToPay } from '../entities/billtopay.entity';

export class PostBillToPayDto extends BillToPay {
  @IsString()
  name: string;

  @IsString()
  payment_info?: string = '';

  @IsString()
  reference_month?: string;

  @IsDateString()
  issue_date?: Date;

  @IsDateString()
  due_date?: Date;

  @IsDateString()
  scheduling?: Date;

  @IsString()
  supplier_id?: string;

  @IsBoolean()
  dda?: boolean;

  @IsNumber()
  price_approved?: number;

  @IsNumber()
  price_updated?: number = 0;

  @IsString()
  invoice_attachment?: string;

  @IsString()
  comment?: string;

  @IsString()
  company_id?: string;

  @IsBoolean()
  is_duty?: boolean;

  @IsOptional()
  @IsString()
  purchaserequest_id: number;
}
