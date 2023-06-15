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
import { EGroupType } from 'src/common/enum/grouptype.enum';

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
    const { name, email, password, group_id, company_id } = postUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      name,
      email,
      password: hashedPassword,
      group_id,
      company_id,
      created_by: req.user.id,
      created_at: new Date(),
    };

    const emailExists = await this.findByEmail(email);

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
      message: `O Usuário ${name} foi criado com sucesso.`,
    };
  }

  async rowCount(active = true, @Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const group = await this.prisma.group.findUnique({
      where: {
        id: user.group_id,
      },
    });

    const whereClause =
      group.type === EGroupType.director
        ? { active }
        : { company_id: user.company_id, active };

    return await this.prisma.user.count({
      where: whereClause,
    });
  }

  async findAll(page = 1, active: boolean, @Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const group = await this.prisma.group.findUnique({
      where: {
        id: user.group_id,
      },
    });

    const whereClause =
      group.type === EGroupType.director
        ? { active: active }
        : { company_id: user.company_id, active: true };

    const users = await this.prisma.user.findMany({
      take: 10,
      skip: 10 * (page - 1),
      include,
      where: whereClause,
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
    const { name, group_id, company_id } = putUserDto;

    const update = {
      where: { id },
      data: {
        name,
        group_id,
        company_id,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    await this.prisma.user.update(update);

    return {
      status: true,
      message: `O usuário ${name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id_user: string, @Req() req: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });

    if (!user) {
      return {
        status: false,
        message: 'Este usuário não existe no sistema',
      };
    }

    const data = {
      active: false,
      deleted_by: req.user.id,
      deleted_at: new Date(),
    };

    await this.prisma.user.update({
      where: { id: id_user },
      data,
    });

    return {
      status: true,
      message: `O usuário ${user.name} foi desativado com sucesso.`,
    };
  }

  async password(id: string, patchUserDto: PatchUserDto, @Req() req: any) {
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

    const passwordHash = await bcrypt.hash(patchUserDto.password, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: passwordHash,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    });

    return {
      status: true,
      message: `A senha foi alterada com sucesso.`,
    };
  }

  async uploadAvatar(id: string, dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    try {
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${uuidv4()}-${filename}`,
        })
        .promise();
      const user = await this.prisma.user.update({
        where: { id },
        data: { avatar: uploadResult.Location },
      });
      return {
        status: true,
        message: `A foto de perfil do usuário ${user.name} foi atualizada com sucesso.`,
      };
    } catch (err) {
      return { status: false, message: err.message };
    }
  }
}
