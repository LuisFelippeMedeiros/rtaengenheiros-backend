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
      type: postGroupDto.type,
      created_by: req.user.id,
      created_at: new Date(),
    };

    const groupExist = await this.findByName(data.name);

    if (groupExist) {
      return {
        status: false,
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

  async findAll(page = 1, active: boolean = true, filter = '') {
    const groups = await this.prisma.group.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active: active,
        OR: [
          {
            name: {
              contains: filter
            }
          },
          {
            description: {
              contains: filter
            }
          }
        ]
      },
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
      where: { id },
      data: {
        name: putGroupDto.name,
        type: putGroupDto.type,
        description: putGroupDto.description,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const updatedGroup = await this.findByName(update.data.name);
    if (updatedGroup.name === update.data.name && id !== updatedGroup.id) {
      return {
        status: false,
        message:
          'O nome do grupo que está tentando alterar já se encontra cadastrado em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.group.update(update);
    return {
      status: true,
      message: `O grupo foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const group = await this.prisma.group.findFirst({ where: { id } });

    if (!group) {
      return {
        status: false,
        message: 'Este grupo de permissão não existe no sistema',
      };
    } else {
      group.active = false;
      (group.deleted_at = new Date()), (group.deleted_by = req.body.id);
    }

    await this.prisma.group.update({
      where: { id },
      data: group,
    });

    return {
      status: true,
      message: `O grupo ${group.name}, foi desativado com sucesso.`,
    };
  }
}
