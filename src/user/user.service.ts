import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostUserDto } from './dto/post-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { PatchUserDto } from './dto/patch-user.dto';

const include = {
  group: {
    select: {
      id: true,
      name: true,
    },
  },
  Company: {
    select: {
      id: true,
      name: true,
      cnpj: true,
      ie: true,
      active: true,
    },
  },
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postUserDto: PostUserDto, @Req() req: any) {
    const data = {
      name: postUserDto.name,
      email: postUserDto.email,
      password: await bcrypt.hash(postUserDto.password, 10),
      group_id: postUserDto.group_id,
      company_id: postUserDto.company_id,
      created_by: req.user.id,
      created_at: new Date(),
    };

    const emailExists = await this.findByEmail(data.email);

    if (emailExists) {
      return {
        status: false,
        message:
          'Este e-mail já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }
    await this.prisma.user.create({ data });

    return {
      status: true,
      message: `O Usuário ${postUserDto.name} foi criado com sucesso.`,
    };
  }

  async rowCount(active = true) {
    return await this.prisma.user.count({
      where: { active },
    });
  }

  async findAll(page = 1, active: boolean) {
    const users = await this.prisma.user.findMany({
      take: 5,
      skip: 5 * (page - 1),
      // include,
      include,
      where: {
        active: active,
      },
      orderBy: {
        name: 'asc',
      },
    });

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
      where: { id },
      data: {
        name: putUserDto.name,
        group_id: putUserDto.group_id,
        company_id: putUserDto.company_id,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${putUserDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id_user: string, @Req() req: any) {
    const user = await this.prisma.user.findFirst({ where: { id: id_user } });

    if (!user) {
      return {
        status: false,
        message: 'Este usuário não existe no sistema',
      };
    } else {
      user.active = false;
      (user.deleted_by = req.body.id), (user.deleted_at = new Date());
    }

    await this.prisma.user.update({
      where: { id: id_user },
      data: user,
    });

    return {
      status: true,
      message: `O usuário ${user.name} foi desativado com sucesso.`,
    };
  }

  async password(id: string, patchUserDto: PatchUserDto, @Req() req: any) {
    const update = {
      where: { id },
      data: {
        password: await bcrypt.hash(patchUserDto.password, 10),
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    if (patchUserDto.password !== patchUserDto.password_confirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `A senha foi alterada com sucesso.`,
    };
  }

  async uploadAvatar(id: string, dataBuffer: Buffer, filename: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${uuidv4()}-${filename}`,
        })
        .promise();
      const userAvatar = {
        where: {
          id,
        },
        data: {
          avatar: uploadResult.Location,
        },
      };

      await this.prisma.user.update(userAvatar);
    } catch (err) {
      return { key: 'error', url: err.message };
    }

    return {
      status: true,
      message: `A foto de perfil do usuário foi atualizada com sucesso.`,
    };
  }
}
