import { Injectable } from '@nestjs/common';
import { PostRoleDto } from './dto/post-role.dto';
import { PutRoleDto } from './dto/put-role.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postRoleDto: PostRoleDto) {
    const data = {
      name: postRoleDto.name,
      action: postRoleDto.action,
      module: postRoleDto.module,
    };

    const roleExist = await this.findByName(data.name);

    if (roleExist) {
      return {
        status: true,
        message:
          'Função já cadastrada em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.role.create({ data });

    return {
      status: true,
      message: `A regra ${postRoleDto.name} foi criada com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.role.findMany();
  }

  async findByName(name: string) {
    return await this.prisma.role.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, putRoleDto: PutRoleDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putRoleDto.name,
        active: putRoleDto.active,
        action: putRoleDto.action,
        module: putRoleDto.module,
      },
    };

    await this.prisma.role.update(update);

    return {
      status: true,
      message: `A regra ${putRoleDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, putRoleDto: PutRoleDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: putRoleDto.active,
      },
    };

    await this.prisma.role.update(update);

    return {
      status: true,
      message: `A regra ${putRoleDto.name} foi desativada com sucesso.`,
    };
  }
}
