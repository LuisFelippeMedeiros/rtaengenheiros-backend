import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [UnitController],
  providers: [UnitService, PrismaService],
})
export class UnitModule {}
