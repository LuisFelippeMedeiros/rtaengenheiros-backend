import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostCompanyDto } from './dto/post-company.dto';
import { PutCompanyDto } from './dto/put-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postCompanyDto: PostCompanyDto, @Req() req: any) {
    const data = {
      name: postCompanyDto.name,
      cnpj: postCompanyDto.cnpj,
      ie: postCompanyDto.ie,
      created_by: req.user.id,
      city_id: postCompanyDto.city_id,
    };

    const companyExists = await this.findByCnpj(data.cnpj);

    if (companyExists) {
      return {
        status: false,
        message: `Este local de trabalho já se encontra cadastrado em nossa base de dados, favor verificar!`,
      };
    }

    await this.prisma.company.create({ data });

    return {
      status: true,
      message: `Local de trabalho criado com sucesso.`,
    };
  }

  async update(id: string, putCompanyDto: PutCompanyDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putCompanyDto.name,
        ie: putCompanyDto.ie,
        active: putCompanyDto.active,
        city_id: putCompanyDto.city_id,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const updatedCompany = await this.findByIe(update.data.ie);

    if (updatedCompany == undefined || updatedCompany == null) {
      await this.prisma.company.update(update);

      return {
        status: true,
        message: `Local de trabalho alterado com sucesso.`,
      };
    }

    await this.prisma.company.update(update);

    return {
      status: true,
      message: `Local de trabalho alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
      },
    });

    if (!company) {
      return {
        status: false,
        message: `Este local de trabalho não existe em nossa base de dados.`,
      };
    } else {
      company.active = false;
      (company.deleted_at = new Date()), (company.deleted_by = req.user.id);
    }

    await this.prisma.company.update({
      where: { id },
      data: company,
    });

    return {
      status: true,
      message: `Local de trabalho desativado com sucesso.`,
    };
  }

  async findPagination(page = 1, active: boolean, filter = '') {
    return await this.prisma.company.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        OR: [
          {
            name: {
              contains: filter
            },
          },
          {
            cnpj: {
              contains: filter
            },
          },
          {
            ie: {
              contains: filter
            },
          },
          {
            City: {
              name: {
                contains: filter
              }
            }
          }
        ]
      },
      include: {
        City: {
          select: {
            id: true,
            name: true,
            State: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
    });
  }

  async rowCount(active = true) {
    return await this.prisma.company.count({
      where: { active },
    });
  }

  findAll() {
    return this.prisma.company.findMany();
  }

  findByCnpj(cnpj: string) {
    return this.prisma.company.findUnique({
      where: {
        cnpj,
      },
    });
  }

  findByIe(ie: string) {
    return this.prisma.company.findFirst({
      where: {
        ie,
      },
    });
  }

  findById(id: string) {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        City: {
          select: {
            id: true,
            name: true,
            State: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
    });
  }
}
