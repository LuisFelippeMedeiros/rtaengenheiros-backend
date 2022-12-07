import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { PostBillToPayDto } from './post-billtopay.dto';

export class PutBillToPayDto extends PartialType(PostBillToPayDto) {
  @IsString()
  payment_info: string;

  @IsString()
  type?: string;

  @IsString()
  reference_month: string;

  @IsDate()
  issue_date?: Date;

  @IsString()
  comment?: string;

  @IsDate()
  due_date: Date;

  @IsDate()
  scheduling?: Date;

  @IsString()
  supplier_id?: string;

  @IsNumber()
  price_approved?: number;

  @IsNumber()
  price_updated?: number;

  @IsString()
  invoice_attachment?: string;

  @IsString()
  bill_status?: string;
}
