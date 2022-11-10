import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostUnitDto } from './dto/post-unit.dto';
import { PutUnitDto } from './dto/put-unit.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postUnitDto: PostUnitDto, @Req() req: any) {
    const data = {
      initials: postUnitDto.initials,
      description: postUnitDto.description,
      created_by: req.user.id,
    };

    await this.prisma.unit.create({ data });

    return {
      status: true,
      message: `A unidade de medida ${postUnitDto.initials}, foi criada com sucesso`,
    };
  }

  async findAll() {
    const units = await this.prisma.unit.findMany();

    return units;
  }

  async findByName(initials: string) {
    const unit = await this.prisma.unit.findMany({
      where: {
        initials: {
          contains: initials,
        },
      },
    });
    return unit;
  }

  async findPagination(page = 1, active = true) {
    const unit = await this.prisma.unit.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
      },
    });

    return unit;
  }

  async rowCount(active = true) {
    return await this.prisma.unit.count({
      where: { active },
    });
  }

  async update(id: string, putUnitDto: PutUnitDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        initials: putUnitDto.initials,
        description: putUnitDto.description,
        updated_by: req.user.id,
      },
    };

    await this.prisma.unit.update(update);
    return {
      status: true,
      message: `A unidade de medida foi alterada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const unit = await this.prisma.unit.findFirst({ where: { id: id } });

    if (!unit) {
      return {
        status: false,
        message: 'Esta unidade de medida não existe no sistema',
      };
    } else {
      unit.active = false;
      (unit.deleted_by = req.body.id), (unit.deleted_at = new Date());
    }

    await this.prisma.unit.update({
      where: { id: id },
      data: unit,
    });

    return {
      status: true,
      message: `A unidade de medida: ${unit.initials} foi desativada com sucesso.`,
    };
  }
}