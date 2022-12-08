import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostBillToPayDto } from './dto/post-billtopay.dto';
import { EBillStatus } from '../common/enum/billstatus.enum';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class BillToPayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postBillToPayDto: PostBillToPayDto, @Req() req: any) {
    let data = {
      name: postBillToPayDto.name,
      payment_info: postBillToPayDto.payment_info,
      type: 'CP',
      dda: postBillToPayDto.dda,
      reference_month: postBillToPayDto.reference_month,
      issue_date: postBillToPayDto.issue_date,
      due_date: postBillToPayDto.due_date,
      scheduling: postBillToPayDto.scheduling,
      supplier_id: postBillToPayDto.supplier_id,
      price_approved: postBillToPayDto.price_approved,
      price_updated: postBillToPayDto.price_approved,
      invoice_attachment: postBillToPayDto.invoice_attachment,
      comment: postBillToPayDto.comment,
      company_id: req.user.company_id,
      created_by: req.user.id,
      bill_status: postBillToPayDto.dda ? EBillStatus.fechada : EBillStatus.aberta
    };

    await this.prisma.billToPay.create({ data });

    return {
      status: true,
      message: `A conta ${postBillToPayDto.name}, foi criada com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.billToPay.findMany({
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        identifier: 'desc',
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
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

  async update(id: string, putBillToPayDto: PostBillToPayDto, @Req() req: any) {
    const billToPay = await this.prisma.billToPay.findFirst({
      where: { id },
    });

    console.log(id)

    if (!billToPay) {
      return {
        status: false,
        message: `Conta não encontrada`,
      };
    }

    if (billToPay.bill_status !== EBillStatus.aberta) {
      return {
        status: false,
        message: `Não será possível alterar contas que estejam Fechadas/Canceladas`,
      };
    }

    const update = {
      where: { id },
      data: {
        id: id,
        payment_info: putBillToPayDto.payment_info,
        reference_month: putBillToPayDto.reference_month,
        issue_date: putBillToPayDto.issue_date,
        comment: putBillToPayDto.comment,
        due_date: putBillToPayDto.due_date,
        scheduling: putBillToPayDto.scheduling,
        price_updated: putBillToPayDto.price_updated,
        invoice_attachment: putBillToPayDto.invoice_attachment,
        updated_by: req.user.id,
        updated_at: new Date()
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
      where: { id },
    });

    if (!billToPay) {
      return {
        status: false,
        message:
          'Esta conta a pagar não existe em nossa base de dados, favor verificar',
      };
    }

    if (
      billToPay.bill_status === EBillStatus.fechada ||
      billToPay.bill_status === EBillStatus.cancelada
    ) {
      return {
        status: false,
        message:
          'Esta conta a pagar se encontra fechada/cancelada, sendo impossibilitada de ser desativada.',
      };
    } else {
      billToPay.active = false;
      (billToPay.bill_status = EBillStatus.fechada),
        (billToPay.deleted_at = new Date()),
        (billToPay.deleted_by = req.user.id);
    }

    billToPay.active = false;
    billToPay.bill_status = EBillStatus.cancelada;
    (billToPay.deleted_at = new Date());
    (billToPay.deleted_by = req.user.id);

    await this.prisma.billToPay.update({
      where: { id },
      data: billToPay,
    });

    return {
      status: true,
      message: `A conta ${billToPay.name}, foi desativada com sucesso.`,
    };
  }

  async uploadInvoice(id: string, dataBuffer: Buffer, filename: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: 'rtaengenheiros-backend',
          Body: dataBuffer,
          Key: `${uuidv4()}-${filename}`,
        })
        .promise();
      const billAttachment = {
        where: {
          id,
        },
        data: {
          invoice_attachment: uploadResult.Location,
        },
      };

      await this.prisma.billToPay.update(billAttachment);
    } catch (err) {
      return { key: 'error', url: err.message };
    }

    return {
      status: true,
      message: `O cupom/nota fiscal foi inserida com sucesso.`,
    };
  }
}
