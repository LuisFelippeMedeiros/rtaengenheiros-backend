import { Injectable, Req } from '@nestjs/common';
import { EGroupType } from 'src/common/enum/grouptype.enum';
import { PrismaService } from 'src/database/PrismaService';
import { PostSupplierDto } from './dto/post-supplier.dto';
import { PutSupplierDto } from './dto/put-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postSupplierDto: PostSupplierDto, @Req() req: any) {
    const data = {
      name: postSupplierDto.name,
      cnpj: postSupplierDto.cnpj,
      telephone: postSupplierDto.telephone,
      email: postSupplierDto.email,
      account: postSupplierDto.account,
      account_type: postSupplierDto.account_type,
      operation: postSupplierDto.operation,
      agency: postSupplierDto.agency,
      bank: postSupplierDto.bank,
      pix: postSupplierDto.pix,
      address: postSupplierDto.address,
      district: postSupplierDto.district,
      number: postSupplierDto.number,
      complement: postSupplierDto.complement,
      created_by: req.user.id,
      company_id: postSupplierDto.company_id,
    };

    const supplierExists = await this.findByCNPJ(data.cnpj);

    if (supplierExists) {
      return {
        status: false,
        message:
          'Este fornecedor já se encontra cadastrado em nossa base de dados, favor verificar',
      };
    }

    await this.prisma.supplier.create({ data });

    return {
      status: true,
      message: `O fornecedor ${postSupplierDto.name} foi criado com sucesso.`,
    };
  }

  async findAll(page = 1, active: boolean, filter = '') {
    const suppliers = await this.prisma.supplier.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        OR: [
          {
            cnpj: {
              contains: filter,
            },
          },
          {
            name: {
              contains: filter,
            },
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });
    return suppliers;
  }

  async findFilter(filter = '', @Req() req: any) {
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
        ? { active: true }
        : { company_id: user.company_id, active: true };

    if (filter === '') {
      return await this.prisma.supplier.findMany({
        take: 10,
        where: whereClause,
        orderBy: {
          name: 'asc',
        },
      });
    }

    return await this.prisma.supplier.findMany({
      where: {
        name: {
          contains: filter.toUpperCase(),
        },
        ...whereClause,
      },
    });
  }

  async getAll(@Req() req: any) {
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
        ? { active: true }
        : { company_id: user.company_id, active: true };

    return await this.prisma.supplier.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
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

    return await this.prisma.supplier.count({
      where: whereClause,
    });
  }

  async findById(id: string) {
    return await this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  async findByCNPJ(cnpj: string) {
    return await this.prisma.supplier.findUnique({
      where: { cnpj },
    });
  }

  async findByName(name: string) {
    return await this.prisma.supplier.findFirst({
      where: { name },
    });
  }

  async update(id: string, putSupplierDto: PutSupplierDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putSupplierDto.name,
        telephone: putSupplierDto.telephone,
        email: putSupplierDto.email,
        account: putSupplierDto.account,
        account_type: putSupplierDto.account_type,
        operation: putSupplierDto.operation,
        agency: putSupplierDto.agency,
        cnpj: putSupplierDto.cnpj,
        bank: putSupplierDto.bank,
        pix: putSupplierDto.pix,
        address: putSupplierDto.address,
        district: putSupplierDto.district,
        number: putSupplierDto.number,
        complement: putSupplierDto.complement,
        updated_by: req.user.id,
        updated_at: new Date(),
        company_id: putSupplierDto.company_id,
      },
    };

    await this.prisma.supplier.update(update);

    return {
      status: true,
      message: `O fornecedor ${putSupplierDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id } });

    if (!supplier) {
      return {
        status: false,
        message: 'Este fornecedor não existe no sistema',
      };
    } else {
      supplier.active = false;
      (supplier.deleted_at = new Date()), (supplier.deleted_by = req.body.id);
    }

    await this.prisma.supplier.update({
      where: { id },
      data: supplier,
    });

    return {
      status: true,
      message: `O fornecedor ${supplier.name} foi desativado com sucesso.`,
    };
  }
}
