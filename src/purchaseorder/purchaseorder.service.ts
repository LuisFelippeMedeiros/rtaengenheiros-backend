import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { EGroupType } from 'src/common/enum/grouptype.enum';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendGrid: SendGridService,
  ) {}

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
      group.type === EGroupType.director
        ? { active: true }
        : { company_id: user.company_id, active: true };

    return this.prisma.purchaseOrder.findMany({
      where: whereClause,
    });
  }

  //

  async generatePdf(ordemCompraId: string): Promise<string> {
    const ordemCompra = await this.prisma.purchaseOrder.findUnique({
      where: { id: ordemCompraId },
      include: {
        Supplier: true,
      },
    });

    const produtos = await this.prisma.purchaseOrderProduct.findMany({
      where: {
        purchaseorder_id: ordemCompraId,
      },
      include: {
        Product: {
          select: {
            name: true,
            // Unit: true,
          },
        },
      },
    });

    if (!ordemCompra) {
      throw new Error('Ordem de compra não encontrada.');
    }

    const nomeArquivo = `ordem_compra_${ordemCompraId}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(nomeArquivo));

    // Adicione informações do fornecedor
    doc.fontSize(14).text('Informações do Fornecedor', { align: 'left' });

    doc.fontSize(12).text(`Nome do Fornecedor: ${ordemCompra.Supplier.name}`);
    doc.fontSize(12).text(`CNPJ: ${ordemCompra.Supplier.cnpj}`);
    doc.fontSize(12).text(`Telefone: ${ordemCompra.Supplier.telephone}`);

    // Adicione informações dos produtos
    doc.fontSize(14).text('Produtos', { align: 'left' });
    doc.fontSize(12).text('Produto       Quantidade');
    produtos.forEach((produto) => {
      doc
        .fontSize(12)
        .text(`${produto.Product.name}       ${produto.quantity}`);
    });

    // Finalize e salve o PDF
    doc.end();

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return nomeArquivo;
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

    return await this.prisma.purchaseOrder.count({
      where: whereClause,
      orderBy: {
        identifier: 'desc',
      },
    });
  }

  async findPagination(page = 1, @Req() req: any) {
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

    const purchaseRequest = await this.prisma.purchaseOrder.findMany({
      where: whereClause,
      take: 9,
      skip: 9 * (page - 1),
      orderBy: {
        identifier: 'desc',
      },
      include: {
        PurchaseOrderProduct: {
          select: {
            id: true,
            price: true,
            quantity: true,
            shipping_fee: true,
            Product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            cnpj: true,
          },
        },
        PurchaseRequest: {
          select: {
            id: true,
            identifier: true,
            reason: true,
            comment: true,
          },
        },
      },
    });

    return purchaseRequest;
  }

  async sendOrder(id: string) {
    await this.prisma.purchaseOrder.findUnique({
      where: {
        id,
      },
    });
    if (process.env.NODE_ENV === 'production') {
    }
  }

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
  ) {
    await this.sendGrid.send({
      to,
      from,
      subject,
      text,
      html,
    });
  }
}
