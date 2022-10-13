import { Module } from '@nestjs/common';
import { PurchaseRequestProductService } from './purchaserequestproduct.service';
import { PurchaseRequestProductController } from './purchaserequestproduct.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [PurchaseRequestProductController],
  providers: [PurchaseRequestProductService, PrismaService],
})
export class PurchaseRequestProductModule {}
