import { Module } from '@nestjs/common';
import { PurchaseorderproductService } from './purchaseorderproduct.service';
import { PurchaseorderproductController } from './purchaseorderproduct.controller';

@Module({
  controllers: [PurchaseorderproductController],
  providers: [PurchaseorderproductService]
})
export class PurchaseorderproductModule {}
