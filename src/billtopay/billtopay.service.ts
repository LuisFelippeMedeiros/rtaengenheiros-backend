import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostBillToPayDto } from './dto/post-billtopay.dto';
import { EBillStatus } from '../common/enum/billstatus.enum';
import { EGroupType } from '../common/enum/grouptype.enum';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class BillToPayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postBillToPayDto: PostBillToPayDto, @Req() req: any) {
    const data = {
      name: postBillToPayDto.name,
      payment_info: postBillToPayDto.payment_info,
      type: postBillToPayDto.is_duty ? 'IMP' : 'CP',
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
      company_id: postBillToPayDto.company_id,
      created_by: req.user.id,
      bill_status: postBillToPayDto.dda
        ? EBillStatus.fechada
        : EBillStatus.aberta,
    };

    await this.prisma.billToPay.create({ data });

    return {
      status: true,
      message: `A conta ${postBillToPayDto.name}, foi criada com sucesso.`,
    };
  }

  async findAll(@Req() req: any) {
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
      group.name === EGroupType.director
        ? { active: true }
        : { company_id: user.company_id, active: true };

    return await this.prisma.billToPay.findMany({
      where: whereClause,
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        due_date: 'desc',
      },
    });
  }

  async findPagination(
    filters: IFilter_bill_to_pay,
    onlyRowCount = false,
    onlyTotal = true,
    @Req() req: any,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        group: true,
        company_id: true,
      },
    });

    const whereClause =
      user.group.type === EGroupType.director
        ? { active: true }
        : { company_id: user.company_id, active: true };

    const filtersParameters = JSON.parse(String(filters));
    const where: any = {};
    let supplier = null;
    let datesFilter = null;

    if (filtersParameters.supplier_id_filter) {
      supplier = await this.prisma.supplier.findFirst({
        where: {
          id: filtersParameters.supplier_id_filter,
        },
      });

      if (!supplier) {
        return {
          status: false,
          message: 'Fornecedor não encontrado',
        };
      }
      where.supplier_id = supplier.id;
    }

    if (
      filtersParameters.date_filter &&
      filtersParameters.date_filter.length > 0
    ) {
      datesFilter = filtersParameters.date_filter.map((date) =>
        date ? new Date(date) : undefined,
      );

      if (filtersParameters.type_date_filter === 'dueDate') {
        const dateLTE = new Date(datesFilter[1]);
        dateLTE.setDate(dateLTE.getDate() + 1);

        where.due_date = {
          gte: datesFilter[0],
          lte: dateLTE,
        };
      }

      if (filtersParameters.type_date_filter === 'issueDate') {
        const dateLTE = new Date(datesFilter[1]);
        dateLTE.setDate(dateLTE.getDate() + 1);

        where.issue_date = {
          gte: datesFilter[0],
          lte: dateLTE,
        };
      }
    }

    if (filtersParameters.status) {
      where.bill_status = filtersParameters.status;
    }

    const whereAll = { ...where, ...whereClause };

    if (onlyRowCount) {
      const count = await this.prisma.billToPay.count({ where });
      return count;
    }

    if (onlyTotal) {
      const total = await this.prisma.billToPay.groupBy({
        by: ['bill_status'],
        where,
        _sum: {
          price_approved: true,
          price_updated: true,
        },
      });

      return total;
    }

    const billsToPay = await this.prisma.billToPay.findMany({
      take: 10,
      skip: 10 * (filtersParameters.page - 1),
      include: {
        Supplier: {
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
      },
      orderBy: {
        due_date: 'desc',
      },
      where: whereAll,
    });
    return billsToPay;
  }

  async rowCount(@Req() req: any) {
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

    return await this.prisma.billToPay.count({ where: whereClause });
  }

  async findById(id: string) {
    return await this.prisma.billToPay.findUnique({
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            pix: true,
            telephone: true,
            cnpj: true,
            agency: true,
            bank: true,
            account: true,
            account_type: true,
            operation: true,
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
        payment_info: putBillToPayDto.payment_info,
        issue_date: putBillToPayDto.issue_date,
        comment: putBillToPayDto.comment,
        due_date: putBillToPayDto.due_date,
        scheduling: putBillToPayDto.scheduling,
        price_approved: putBillToPayDto.price_approved,
        price_updated: putBillToPayDto.price_updated,
        invoice_attachment: putBillToPayDto.invoice_attachment,
        company_id: putBillToPayDto.company_id,
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
    }

    billToPay.active = false;
    billToPay.bill_status = EBillStatus.cancelada;
    billToPay.deleted_at = new Date();
    billToPay.deleted_by = req.user.id;

    await this.prisma.billToPay.update({
      where: { id },
      data: billToPay,
    });

    return {
      status: true,
      message: `A conta ${billToPay.name}, foi desativada com sucesso.`,
    };
  }

  async paid(id: string, @Req() req: any) {
    const billToPay = await this.prisma.billToPay.findFirst({
      where: { id },
    });

    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        group: true,
      },
    });

    if (!billToPay) {
      return {
        status: false,
        message:
          'Esta conta a pagar não existe em nossa base de dados, favor verificar',
      };
    }

    if (billToPay.active === false) {
      return {
        status: false,
        message:
          'Esta conta a pagar se encontra inativa, sendo impossibilitada de ser paga.',
      };
    }

    if (
      billToPay.bill_status === EBillStatus.fechada ||
      billToPay.bill_status === EBillStatus.cancelada
    ) {
      return {
        status: false,
        message:
          'Esta conta a pagar se encontra fechada/cancelada, sendo impossibilitada de ser paga.',
      };
    }

    if (user.group.type === EGroupType.director) {
      const update = {
        where: { id },
        data: {
          bill_status: EBillStatus.fechada,
        },
      };

      await this.prisma.billToPay.update(update);

      return {
        status: true,
        message: `A conta foi fechada com sucesso!`,
      };
    } else {
      return {
        status: false,
        message: `Você não tem permissão para fechar esta conta`,
      };
    }
  }

  async uploadInvoice(id: string, dataBuffer: Buffer, filename: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
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
