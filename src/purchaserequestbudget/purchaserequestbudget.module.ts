import { Module } from '@nestjs/common';
import { PurchaseRequestBudgetService } from './purchaserequestbudget.service';
import { PurchaserequestbudgetController } from './purchaserequestbudget.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [PurchaserequestbudgetController],
  providers: [PurchaseRequestBudgetService, PrismaService],
})
export class PurchaserequestbudgetModule {}
