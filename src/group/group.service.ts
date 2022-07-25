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
      return {
        status: true,
        message:
          'Grupo de função já cadastrado em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.group.create({ data });

    return {
      status: true,
      message: `O grupo ${createGroupDto.name}, foi criado com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.group.findMany();
  }

  async findByName(name: string) {
    return await this.prisma.group.findUnique({
      where: {
        name,
      },
    });
  }

  async findById(name: string) {
    return await this.prisma.group.findUnique({
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
      await this.prisma.group.update(update);

      return {
        status: true,
        message: `O grupo ${updateGroupDto.name} foi alterado com sucesso.`,
      };
    }

    if (updatedGroup.name == update.data.name && id !== updatedGroup.id) {
      return {
        status: true,
        message:
          'O nome do grupo que está tentando alterar já se encontra cadastrado em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.group.update(update);

    return {
      status: true,
      message: `O grupo ${updateGroupDto.name} foi alterado com sucesso.`,
    };
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

    await this.prisma.group.update(update);

    return {
      status: true,
      message: `O grupo ${updateGroupDto.name}, foi desativado com sucesso.`,
    };
  }
}
