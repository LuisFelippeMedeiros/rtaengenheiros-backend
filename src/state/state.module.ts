import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StateService } from './state.service';
import { StateController } from './state.controller';

@Module({
  controllers: [StateController],
  providers: [StateService, PrismaService],
  exports: [StateService],
})
export class StateModule {}
