import { IsBoolean, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PatchPurchaseRequestDto extends PartialType(
  PostPurchaseRequestDto,
) {
  @IsString()
  quantity?: string;

  @IsString()
  status: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  comment: string;
}
