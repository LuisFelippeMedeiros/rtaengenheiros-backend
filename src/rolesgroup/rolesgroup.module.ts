import { Module } from '@nestjs/common';
import { RolesGroupService } from './rolesgroup.service';
import { RolesGroupController } from './rolesgroup.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [RolesGroupController],
  providers: [RolesGroupService, PrismaService],
})
export class RolesgroupModule {}
