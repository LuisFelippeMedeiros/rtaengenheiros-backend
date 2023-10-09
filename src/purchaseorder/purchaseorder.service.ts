import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { EGroupType } from 'src/common/enum/grouptype.enum';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import base64 from 'base64-js';

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
      group.type === EGroupType.director ? {} : { company_id: user.company_id };

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

  async getOrder(id: string) {
    const logoPath = 'src/assets/sem-fundo.png';

    let base64Data = '';

    fs.readFile(logoPath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // Converte os dados do arquivo em base64.
      base64Data = Buffer.from(data).toString('base64');
    });

    const ordemCompra = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        Supplier: true,
      },
    });

    const produtos = await this.prisma.purchaseOrderProduct.findMany({
      where: {
        purchaseorder_id: id,
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

    const company = await this.prisma.company.findUnique({
      where: {
        id: ordemCompra.company_id,
      },
    });

    const city = await this.prisma.city.findUnique({
      where: {
        id: company.city_id,
      },
      include: {
        State: true,
      },
    });

    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: ordemCompra.supplier_id,
      },
    });

    function retornarFormatoMoeda(valor) {
      return parseFloat(valor).toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    const doc = new jsPDF();

    doc.addImage(base64Data, 'PNG', 10, 10, 40, 20);

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#fff',
            },
          },
          {
            content: `Ordem de compra`,
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#000',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Nº da ordem: #${ordemCompra.identifier}\nDate: 2022-01-27`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Faturado por: \n${supplier.name}\n${supplier.cnpj}\n${supplier.telephone}\n${supplier.address}, \n${supplier.district}`,
            styles: {
              halign: 'left',
            },
          },
          {
            content: `Faturado para: \n${company.internal_name}\n${company.cnpj}\n${city.name} ${city.State.name} \n${company.address} \n${company.telephone} \n${company.zip_code}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Produtos e Serviços',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    let totalAmount = 0;

    autoTable(doc, {
      head: [
        [
          { content: 'Item', styles: { halign: 'left' } },
          { content: 'Quantidade', styles: { halign: 'right' } },
          { content: 'Valor unitário', styles: { halign: 'right' } },
          { content: 'Frete', styles: { halign: 'right' } },
          { content: 'Valor Total', styles: { halign: 'right' } },
        ],
      ],
      body: produtos.map((produto) => {
        const amount = produto.quantity * produto.price + produto.shipping_fee;
        totalAmount += amount;
        return [
          { content: produto.Product.name, styles: { halign: 'left' } },
          { content: produto.quantity.toString(), styles: { halign: 'right' } },
          {
            content: retornarFormatoMoeda(produto.price),
            // )`R$${produto.price.toFixed(2)}`,
            styles: { halign: 'right' },
          },
          {
            content: retornarFormatoMoeda(produto.shipping_fee),
            styles: { halign: 'right' },
          },
          {
            content: retornarFormatoMoeda(amount),
            styles: { halign: 'right' },
          },
        ];
      }),
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Total:',
            styles: {
              halign: 'right',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: retornarFormatoMoeda(totalAmount),
            styles: {
              halign: 'right',
              fontSize: 14,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content: `Data da solicitação: ${ordemCompra.id}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    const fileName = `OrdemDeCompra#${ordemCompra.identifier}.pdf`;

    doc.save(fileName);
    doc.autoPrint();

    doc.output('dataurlnewwindow');
  }
}
