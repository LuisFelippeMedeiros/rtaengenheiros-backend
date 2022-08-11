import { Injectable } from '@nestjs/common';
import { PostRolesGroupDto } from './dto/post-rolesgroup.dto';
import { PutRolesGroupDto } from './dto/put-rolesgroup.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class RolesGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postRolesGroupDto: PostRolesGroupDto) {
    const data = {
      group_id: postRolesGroupDto.group_id,
      role_id: postRolesGroupDto.role_id,
    };

    await this.prisma.rolesGroup.create({ data });

    return;
  }

  findAll() {
    return this.prisma.rolesGroup.findMany();
  }

  findOne(id: string) {
    return this.prisma.rolesGroup.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, putRolesGroupDto: PutRolesGroupDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        group_id: putRolesGroupDto.group_id,
        role_id: putRolesGroupDto.role_id,
      },
    };

    await this.prisma.rolesGroup.update(update);

    return { update };
  }
}
