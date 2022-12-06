import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { BillToPay } from '../entities/billtopay.entity';

export class PostBillToPayDto extends BillToPay {
  @IsString()
  name: string;

  @IsString()
  payment_info?: string;

  @IsString()
  invoice?: string;

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

  @IsString()
  invoice_attachment?: string;

  @IsString()
  comment?: string;

  // @IsString()
  // company_id?: string;
}
