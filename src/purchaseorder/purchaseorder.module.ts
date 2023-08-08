import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { PurchaseOrderController } from './purchaseorder.controller';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseorderModule {}
