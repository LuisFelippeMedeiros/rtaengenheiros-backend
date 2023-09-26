import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendGrid: SendGridService,
  ) {}

  findAll() {
    return this.prisma.purchaseOrder.findMany();
  }

  async gerarPdf(ordemCompraId: string): Promise<string> {
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

    return nomeArquivo;
  }

  async rowCount() {
    return await this.prisma.purchaseOrder.count({
      orderBy: {
        identifier: 'desc',
      },
    });
  }

  async findPagination(page = 1) {
    const purchaseRequest = await this.prisma.purchaseOrder.findMany({
      take: 9,
      skip: 9 * (page - 1),
      orderBy: {
        identifier: 'desc',
      },
    });

    return purchaseRequest;
  }

  async enviarOrdemCompra(id: string) {
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
