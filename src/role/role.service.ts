import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const data = {
      ...createRoleDto,
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
      message: `A regra ${createRoleDto.name} foi criada com sucesso.`,
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

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: updateRoleDto.name,
        active: updateRoleDto.active,
        action: updateRoleDto.action,
      },
    };

    await this.prisma.role.update(update);

    return {
      status: true,
      message: `A regra ${updateRoleDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, updateRoleDto: UpdateRoleDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: updateRoleDto.active,
      },
    };

    await this.prisma.role.update(update);

    return {
      status: true,
      message: `A regra ${updateRoleDto.name} foi desativada com sucesso.`,
    };
  }
}
