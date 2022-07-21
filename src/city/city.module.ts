import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  controllers: [CityController],
  providers: [CityService, PrismaService],
  exports: [CityService],
})
export class CityModule {}
