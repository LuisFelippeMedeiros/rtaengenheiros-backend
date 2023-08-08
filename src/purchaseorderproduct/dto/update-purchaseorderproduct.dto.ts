import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseorderproductDto } from './create-purchaseorderproduct.dto';

export class UpdatePurchaseorderproductDto extends PartialType(CreatePurchaseorderproductDto) {}
