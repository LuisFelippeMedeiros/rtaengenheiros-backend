import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostUserDto } from './dto/post-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

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

  async create(putUserDto: PostUserDto, @Req() req: any) {
    const data = {
      name: putUserDto.name,
      email: putUserDto.email,
      password: await bcrypt.hash(putUserDto.password, 10),
      group_id: putUserDto.group_id,
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
      message: `O Usuário ${putUserDto.name} foi criado com sucesso.`,
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

  async update(id: string, putUserDto: PutUserDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putUserDto.name,
        password: await bcrypt.hash(putUserDto.password, 10),
        active: putUserDto.active,
        group_id: putUserDto.group_id,
        updated_by: req.user.id,
      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${putUserDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, putUserDto: PutUserDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: putUserDto.active,
        deleted_by: req.user.id,
      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${putUserDto.name} foi desativado com sucesso.`,
    };
  }
}
