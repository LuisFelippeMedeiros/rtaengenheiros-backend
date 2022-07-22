import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    const data = {
      ...createGroupDto,
    };

    const groupExist = await this.findByName(data.name);

    if (groupExist) {
      throw new Error(
        'Grupo de função já cadastrado em nossa base de dados, favor verificar!',
      );
    }

    await this.prisma.group.create({ data });

    return data;
  }

  async findAll() {
    return this.prisma.group.findMany();
  }

  findByName(name: string) {
    return this.prisma.group.findUnique({
      where: {
        name,
      },
    });
  }

  findById(name: string) {
    return this.prisma.group.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: updateGroupDto.name,
        active: updateGroupDto.active,
      },
    };

    const updatedGroup = await this.findByName(update.data.name);

    if (updatedGroup == undefined || updatedGroup == null) {
      return this.prisma.group.update(update);
    }

    if (updatedGroup.name == update.data.name && id !== updatedGroup.id) {
      throw new Error(
        'O nome do grupo modificado já se encontra cadastrado em nossa base de dados, favor verificar!',
      );
    }

    return this.prisma.group.update(update);
  }

  async deactivate(id: string, updateGroupDto: UpdateGroupDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: updateGroupDto.active,
      },
    };

    return this.prisma.group.update(update);
  }
}
