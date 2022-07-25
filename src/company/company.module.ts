import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
})
export class CompanyModule {}
