import { Module } from '@nestjs/common';
import { BillToPayService } from './billtopay.service';
import { BillToPayController } from './billtopay.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [BillToPayController],
  providers: [BillToPayService, PrismaService],
})
export class BillToPayModule {}
