import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { RowCountService } from './rowcount.service';
import { RowCountController } from './rowcount.controller';

@Module({
  controllers: [RowCountController],
  providers: [RowCountService, PrismaService],
  exports: [RowCountService],
})
export class RowCountModule {}
