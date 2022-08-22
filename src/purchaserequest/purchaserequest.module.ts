import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchaserequest.service';
import { PurchaseRequestController } from './purchaserequest.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService, PrismaService],
})
export class PurchaserequestModule {}
