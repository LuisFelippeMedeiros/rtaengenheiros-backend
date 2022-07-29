import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostGroupDto } from './dto/post-group.dto';
import { PutGroupDto } from './dto/put-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postGroupDto: PostGroupDto) {
    const data = {
      ...postGroupDto,
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
      message: `O grupo ${postGroupDto.name}, foi criado com sucesso.`,
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

  async findById(id: string) {
    return await this.prisma.group.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, putGroupDto: PutGroupDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putGroupDto.name,
        active: putGroupDto.active,
      },
    };

    const updatedGroup = await this.findByName(update.data.name);

    if (updatedGroup == undefined || updatedGroup == null) {
      await this.prisma.group.update(update);

      return {
        status: true,
        message: `O grupo ${putGroupDto.name} foi alterado com sucesso.`,
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
      message: `O grupo ${putGroupDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, putGroupDto: PutGroupDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: putGroupDto.active,
      },
    };

    await this.prisma.group.update(update);

    return {
      status: true,
      message: `O grupo ${putGroupDto.name}, foi desativado com sucesso.`,
    };
  }
}
