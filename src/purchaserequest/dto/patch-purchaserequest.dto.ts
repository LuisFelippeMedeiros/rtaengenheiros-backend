import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PatchPurchaseRequestDto extends PartialType(PostPurchaseRequestDto) {
  @IsString()
  comment: string;
}
