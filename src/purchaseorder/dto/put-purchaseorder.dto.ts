import { PartialType } from '@nestjs/swagger';
import { PostPurchaseOrderDto } from './post-purchaseorder.dto';

export class PutPurchaseOrderDto extends PartialType(PostPurchaseOrderDto) {}
