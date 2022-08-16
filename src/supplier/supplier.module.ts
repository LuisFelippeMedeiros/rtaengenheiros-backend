import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';

@Module({
  controllers: [SupplierController, PrismaService],
  providers: [SupplierService],
})
export class SupplierModule {}
