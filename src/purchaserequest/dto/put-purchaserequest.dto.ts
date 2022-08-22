import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PutPurchaseRequestDto extends PartialType(
  PostPurchaseRequestDto,
) {}
