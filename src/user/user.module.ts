import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StateService } from 'src/state/state.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, StateService],
  exports: [UserService],
})
export class UserModule {}
