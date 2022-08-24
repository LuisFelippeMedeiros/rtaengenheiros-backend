import { Injectable, Req } from '@nestjs/common';
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
      ie: postSupplierDto.ie,
      telephone: postSupplierDto.telephone,
      email: postSupplierDto.email,
      account: postSupplierDto.account,
      agency: postSupplierDto.agency,
      bank: postSupplierDto.bank,
      pix: postSupplierDto.pix,
      pix2: postSupplierDto.pix2,
      address: postSupplierDto.address,
      district: postSupplierDto.district,
      number: postSupplierDto.number,
      complement: postSupplierDto.complement,
      created_by: req.user.id,
    };

    const supplierExists = await this.findByCNPJ(data.cnpj);

    if (supplierExists) {
      return {
        status: true,
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

  async findAll(page = 1, active: boolean) {
    const suppliers = await this.prisma.supplier.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active: active,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return suppliers;
  }

  async rowCount (active: boolean = true) {
    return await this.prisma.supplier.count({
      where: { active }
    })
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
        agency: putSupplierDto.agency,
        cnpj: putSupplierDto.cnpj,
        ie: putSupplierDto.ie,
        bank: putSupplierDto.bank,
        pix: putSupplierDto.pix,
        pix2: putSupplierDto.pix2,
        address: putSupplierDto.address,
        district: putSupplierDto.district,
        number: putSupplierDto.number,
        complement: putSupplierDto.complement,
        updated_by: req.user.id,
      },
    };

    await this.prisma.supplier.update(update);

    return {
      status: true,
      message: `O fornecedor ${putSupplierDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id } })

    if (!supplier) {
      return {
        status: false,
        message: 'Este usuário não existe no sistema'
      }
    } else {
      supplier.active = false;
      (supplier.deleted_at = new Date()),
      (supplier.deleted_by = req.body.id)
    }

    await this.prisma.supplier.update({
      where: { id },
      data: supplier
    });

    return {
      status: true,
      message: `O fornecedor ${supplier.name} foi desativado com sucesso.`,
    };
  }
}
