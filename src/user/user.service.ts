import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StateService } from 'src/state/state.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stateService: StateService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // const state = await this.stateService.findByState(createUserDto.stateId);

    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const cpfExists = await this.findByCPF(data.cpf);

    if (cpfExists) {
      throw new Error(
        'Este CPF já se encontra cadastrado em nossa base de dados, favor verificar!',
      );
    }

    const emailExists = await this.findByEmail(data.email);

    if (emailExists) {
      throw new Error(
        'Este e-mail já se encontra cadastrado em nossa base de dados, favor verificar!',
      );
    }

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByName(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }

  findByCPF(cpf: string) {
    return this.prisma.user.findUnique({
      where: { cpf },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
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
        dateOfBirth: updateUserDto.dateOfBirth,
        bank: updateUserDto.bank,
        agency: updateUserDto.agency,
        account: updateUserDto.account,
        pix: updateUserDto.pix,
        address: updateUserDto.address,
        district: updateUserDto.district,
        number: updateUserDto.number,
        complement: updateUserDto.complement,
        active: updateUserDto.active,
        groupId: updateUserDto.groupId,
      },
    };

    return this.prisma.user.update(update);
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

    return this.prisma.user.update(update);
  }
}
