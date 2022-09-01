import { IsBoolean, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PutPurchaseRequestDto extends PartialType(PostPurchaseRequestDto) {
  @IsString()
  quantity?: string;

  @IsString()
  reason: string;

  @IsString()
  status: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  comment: string;
}
