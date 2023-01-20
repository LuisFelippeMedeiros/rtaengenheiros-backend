import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostStatusDto } from './dto/post-status.dto';
import { PutStatusDto } from './dto/put-status.dto';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postStatusDto: PostStatusDto, @Req() req: any) {
    const data = {
      name: postStatusDto.name,
      created_by: req.user.id,
    };

    const statusExists = await this.findByName(data.name);

    if (statusExists) {
      return {
        status: false,
        message: 'Status já cadastrado em nossa base de dados, favor verificar',
      };
    }

    await this.prisma.status.create({ data });

    return {
      status: true,
      message: `O status ${postStatusDto.name}, foi criado com sucesso.`,
    };
  }

  async findAll() {
    const status = await this.prisma.status.findMany();

    return status;
  }

  async findByName(name: string) {
    return await this.prisma.status.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        active: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.status.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, putStatusDto: PutStatusDto, @Req() req: any) {
    const update = {
      where: {
        id,
      },
      data: {
        name: putStatusDto.name,
        active: putStatusDto.active,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const updatedStatus = await this.findByName(update.data.name);

    if (updatedStatus == undefined || updatedStatus == null) {
      await this.prisma.status.update(update);

      return {
        status: true,
        message: `O status ${putStatusDto.name}, foi alterado com sucesso.`,
      };
    }

    if (updatedStatus.name == update.data.name && id !== updatedStatus.id) {
      return {
        status: false,
        message:
          'O status que está tentando alterar já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }

    await this.prisma.status.update(update);

    return {
      status: true,
      message: `O status ${putStatusDto.name}, foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const status = await this.prisma.status.findFirst({
      where: {
        id,
      },
    });

    if (!status) {
      return {
        status: false,
        message: 'Este status não existe no sistema, favor verificar.',
      };
    } else {
      status.active = false;
      (status.deleted_at = new Date()), (status.deleted_by = req.body.id);
    }

    await this.prisma.status.update({
      where: { id },
      data: status,
    });

    return {
      status: true,
      message: `O status ${status.name}, foi desativado com sucesso.`,
    };
  }
}
