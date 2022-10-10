import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { BillToPay } from '../entities/billtopay.entity';

export class PostBillToPayDto extends BillToPay {
  @IsString()
  name: string;

  @IsString()
  payment_info?: string;

  @IsString()
  type?: string;

  @IsString()
  authorized?: string;

  @IsString()
  invoice?: string;

  @IsString()
  reference_month?: string;

  @IsDate()
  issue_date?: Date;

  @IsString()
  comment?: string;

  @IsDate()
  due_date?: Date;

  @IsDate()
  scheduling?: Date;

  @IsString()
  supplier_id?: string;

  @IsBoolean()
  dda?: boolean;

  @IsNumber()
  price?: number;

  @IsString()
  invoice_attachment?: string;

  // @IsString()
  // company_id?: string;
}
