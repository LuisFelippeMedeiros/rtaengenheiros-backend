import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

const include = {
  group: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, @Req() req: any) {
    const data = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      group_id: createUserDto.group_id,
      created_by: req.user.id,
    };

    const emailExists = await this.findByEmail(data.email);

    if (emailExists) {
      return {
        status: true,
        message:
          'Este e-mail já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }
    await this.prisma.user.create({ data });

    return {
      status: true,
      message: `O Usuário ${createUserDto.name} foi criado com sucesso.`,
    };
  }

  async findAll(pagination: IPagination, status: boolean) {
    // eslint-disable-next-line prefer-const
    let { pageIndex, pageSize, onlyRowCount } = pagination;
    let users: Array<User> = []

    if (isNaN(pageSize)) {
      pageSize = 5;
    }

    if (onlyRowCount) {
      return {
        rowCount: await this.prisma.user.count()
      };
    }

    if (isNaN(pageIndex)) {
      users = await this.prisma.user.findMany({
        where: {
          active: {
            equals: Boolean(status),
          },
        },
        include,
        take: pageSize,
      })
    } else {
      users = await this.prisma.user.findMany({
        where: {
          active: {
            equals: Boolean(status),
          },
        },
        include,
        skip: pageIndex - 1,
        take: pageSize,
        orderBy: {
          name: 'asc',
        },
      })
    }

    if (users.length > 0) {
      for (var i = 0; i < users.length; i++) {
        users[i] = new User(users[i])
      }
    }

    return users;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByName(name: string) {
    return await this.prisma.user.findFirst({
      where: { name },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      include,
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
        password: await bcrypt.hash(updateUserDto.password, 10),
        active: updateUserDto.active,
        group_id: updateUserDto.group_id,
        updated_by: req.user.id,
      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${updateUserDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, updateUserDto: UpdateUserDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: updateUserDto.active,
        deleted_by: req.user.id,
      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${updateUserDto.name} foi desativado com sucesso.`,
    };
  }
}
