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
      throw new Error(
        'Função já cadastrada em nossa base de dados, favor verificar!',
      );
    }

    await this.prisma.role.create({ data });

    return data;
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findByName(name: string) {
    return this.prisma.role.findUnique({
      where: {
        name,
      },
    });
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
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

    return this.prisma.role.update(update);
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

    return this.prisma.role.update(update);
  }
}
