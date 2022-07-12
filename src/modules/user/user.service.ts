import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserDTO) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    if (userExists) {
      throw new Error(
        'Usuário já se encontra cadastrado em nossa base de dados.',
      );
    }

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}
