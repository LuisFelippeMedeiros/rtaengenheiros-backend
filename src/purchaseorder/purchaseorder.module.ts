import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { PurchaseOrderController } from './purchaseorder.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PrismaService],
})
export class PurchaseorderModule {}
