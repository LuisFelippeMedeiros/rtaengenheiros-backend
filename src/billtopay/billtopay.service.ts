import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostBillToPayDto } from './dto/post-billtopay.dto';
import { PutBillToPayDto } from './dto/put-billtopay.dto';

@Injectable()
export class BillToPayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postBillToPayDto: PostBillToPayDto, @Req() req: any) {
    const data = {
      name: postBillToPayDto.name,
      payment_info: postBillToPayDto.payment_info,
      type: postBillToPayDto.type,
      authorized: postBillToPayDto.authorized,
      invoice: postBillToPayDto.invoice,
      reference_month: postBillToPayDto.reference_month,
      issue_date: postBillToPayDto.issue_date,
      comment: postBillToPayDto.comment,
      due_date: postBillToPayDto.due_date,
      scheduling: postBillToPayDto.scheduling,
      supplier_id: postBillToPayDto.supplier_id,
      dda: postBillToPayDto.dda,
      price: postBillToPayDto.price,
      invoice_attachment: postBillToPayDto.invoice_attachment,
      company_id: req.user.company_id,
      created_by: req.user.id,
    };

    await this.prisma.billToPay.create({ data });

    return {
      status: true,
      message: `A conta ${postBillToPayDto.name}, foi criada com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.billToPay.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findPagination(page = 1, active: boolean) {
    const categories = await this.prisma.billToPay.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: { active },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  async rowCount(active = true) {
    return await this.prisma.billToPay.count({
      where: { active },
    });
  }

  async findById(id: string) {
    return await this.prisma.billToPay.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return await this.prisma.billToPay.findFirst({
      where: {
        name,
      },
    });
  }

  async update(id: string, putBillToPayDto: PutBillToPayDto, @Req() req: any) {
    const update = {
      where: {
        id,
      },
      data: {
        payment_info: putBillToPayDto.payment_info,
        authorized: putBillToPayDto.authorized,
        invoice: putBillToPayDto.invoice,
        reference_month: putBillToPayDto.reference_month,
        issue_date: putBillToPayDto.issue_date,
        comment: putBillToPayDto.comment,
        due_date: putBillToPayDto.due_date,
        scheduling: putBillToPayDto.scheduling,
        supplier_id: putBillToPayDto.supplier_id,
        dda: putBillToPayDto.dda,
        price: putBillToPayDto.price,
        invoice_attachment: putBillToPayDto.invoice_attachment,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    await this.prisma.billToPay.update(update);

    return {
      status: true,
      message: `A conta ${putBillToPayDto.name}, foi alterada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const billToPay = await this.prisma.billToPay.findFirst({
      where: {
        id,
      },
    });

    if (!billToPay) {
      return {
        status: false,
        message:
          'Esta conta a pagar não existe em nossa base de dados, favor verificar',
      };
    } else {
      billToPay.active = false;
      (billToPay.deleted_at = new Date()), (billToPay.deleted_by = req.user.id);
    }

    await this.prisma.billToPay.update({
      where: { id },
      data: billToPay,
    });

    return {
      status: true,
      message: `A conta ${billToPay.name}, foi desativada com sucesso.`,
    };
  }
}
