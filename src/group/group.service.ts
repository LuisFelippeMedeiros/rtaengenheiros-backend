import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostRolesGroupDto } from 'src/rolesgroup/dto/post-rolesgroup.dto';
import { PostGroupDto } from './dto/post-group.dto';
import { PutGroupDto } from './dto/put-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postGroupDto: PostGroupDto, @Req() req: any) {
    const data = {
      name: postGroupDto.name,
      description: postGroupDto.description,
      created_by: req.user.id,
    };

    const groupExist = await this.findByName(data.name);

    if (groupExist) {
      return {
        status: true,
        message:
          'Grupo de função já cadastrado em nossa base de dados, favor verificar!',
      };
    }

    const group = await this.prisma.group.create({ data });

    if (postGroupDto.roles.length > 0) {
      for (const i in postGroupDto.roles) {
        const data: PostRolesGroupDto = {
          group_id: group.id,
          role_id: postGroupDto.roles[i],
        };
        await this.prisma.rolesGroup.create({ data });
      }
    }

    return {
      status: true,
      message: `O grupo ${postGroupDto.name}, foi criado com sucesso.`,
    };
  }

  async findAll() {
    const groups = await this.prisma.group.findMany({
      include: {
        roles: {
          select: {
            Role: {
              select: {
                module: true,
                action: true,
                type: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return groups;
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
      include: {
        roles: {
          select: {
            Role: {
              select: {
                module: true,
                action: true,
                type: true,
                name: true,
              },
            },
          },
        },
      },
      where: { id },
    });
  }

  async findRolesById(group_id: string) {
    return await this.prisma.rolesGroup.findMany({
      where: { group_id },
    });
  }

  async update(id: string, putGroupDto: PutGroupDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putGroupDto.name,
        active: putGroupDto.active,
        description: putGroupDto.description,
        updated_by: req.user.id,
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

  async deactivate(id: string, putGroupDto: PutGroupDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: putGroupDto.active,
        deleted_by: req.user.id,
      },
    };

    await this.prisma.group.update(update);

    return {
      status: true,
      message: `O grupo ${putGroupDto.name}, foi desativado com sucesso.`,
    };
  }
}
