import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostCompanyDto } from './dto/post-company.dto';
import { PutCompanyDto } from './dto/put-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postCompanyDto: PostCompanyDto, @Req() req: any) {
    const data = {
      cnpj: postCompanyDto.cnpj,
      ie: postCompanyDto.ie,
      created_by: req.user.id,
      city_id: postCompanyDto.city_id,
    };

    const city = await this.prisma.city.findFirst({
      where: {
        id: data.city_id,
      },
    });

    const companyExists = await this.findByCnpj(data.cnpj);

    if (companyExists) {
      return {
        status: false,
        message:
          'Empresa já cadastrada em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.company.create({ data });

    return {
      status: true,
      message: `A empresa com sede em ${city.name}, foi criada com sucesso.`,
    };
  }

  async update(id: string, putCompanyDto: PutCompanyDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        ie: putCompanyDto.ie,
        active: putCompanyDto.active,
        city_id: putCompanyDto.city_id,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const city = await this.prisma.city.findFirst({
      where: {
        id: update.data.city_id,
      },
    });

    const updatedCompany = await this.findByIe(update.data.ie);

    if (updatedCompany == undefined || updatedCompany == null) {
      await this.prisma.company.update(update);

      return {
        status: true,
        message: `A empresa com sede em ${city}, foi alterada com sucesso.`,
      };
    }

    await this.prisma.company.update(update);

    return {
      status: true,
      message: `A empresa com sede em ${city}, foi alterada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
      },
    });

    const city = await this.prisma.city.findFirst({
      where: {
        id: company.city_id,
      },
    });

    if (!company) {
      return {
        status: false,
        message: 'Esta empresa não existe em nossa base de dados.',
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
      message: `A empresa com sede em ${city}, foi desativada com sucesso.`,
    };
  }

  async findPagination(page = 1, active: boolean) {
    const companies = await this.prisma.company.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: { active },
    });

    return companies;
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
    });
  }
}
