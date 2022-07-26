import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

const include = {
  group: {
    select: {
      id: true,
      name: true,
    },
  },
  City: {
    select: {
      id: true,
      name: true,
    },
  },
  State: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const cpfExists = await this.findByCPF(data.cpf);

    if (cpfExists) {
      return {
        status: true,
        message:
          'Este CPF já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }

    const emailExists = await this.findByEmail(data.email);

    if (emailExists) {
      return {
        status: true,
        message:
          'Este e-mail já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }

    const createdUser = await this.prisma.user.create({ data });

    return {
      status: true,

      message: `O Usuário ${createdUser.name} foi criado com sucesso.`,
    };
  }

  async findAll(status: boolean) {
    return await this.prisma.user.findMany({ 
      include,
      where: {
        active: {
          equals: status
        }
      }, 
      orderBy: {
        name: 'asc'
      }
    });
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

  async findByCPF(cpf: string) {
    return await this.prisma.user.findUnique({
      where: { cpf },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      include,
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
        date_of_birth: updateUserDto.date_of_birth,
        password: await bcrypt.hash(updateUserDto.password, 10),
        bank: updateUserDto.bank,
        agency: updateUserDto.agency,
        account: updateUserDto.account,
        pix: updateUserDto.pix,
        address: updateUserDto.address,
        district: updateUserDto.district,
        number: updateUserDto.number,
        complement: updateUserDto.complement,
        active: updateUserDto.active,
        group_id: updateUserDto.group_id,

        id: updateUserDto.id,


      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${updateUserDto.name} foi alterado com sucesso.`,

    };
  }

  async deactivate(id: string, updateUserDto: UpdateUserDto) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: updateUserDto.active,
      },
    };


    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${updateUserDto.name} foi desativado com sucesso.`,

    };
  }
}
