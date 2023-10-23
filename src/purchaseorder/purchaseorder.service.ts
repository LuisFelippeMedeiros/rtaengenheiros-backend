import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EGroupType } from 'src/common/enum/grouptype.enum';
import * as fs from 'fs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SendGridService } from '@anchan828/nest-sendgrid';

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

  async getOrder(id: string, res: any) {
    const logoPath = 'src/assets/sem-fundo.png';

    let base64Data = '';

    fs.readFile(logoPath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

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

    doc.addImage(base64Data, 'PNG', 10, 10, 40, 20, '', 'FAST');

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
            content: `ORDEM DE COMPRA`,
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
            content: `Nº DA ORDEM: # ${ordemCompra.identifier}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [
        [
          {
            content: 'FATURADO POR: ',
            styles: { halign: 'left', textColor: 'white' },
          },
        ],
      ],
      body: [
        [
          {
            content: `${supplier.name}\n${supplier.cnpj}\n${supplier.telephone}\n${supplier.address}, \n${supplier.district}`,
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
      headStyles: {
        fillColor: '#1b2e62',
      },
    });
    autoTable(doc, {
      head: [
        [
          {
            content: 'FATURADO PARA: ',
            styles: { halign: 'left', textColor: 'white' },
          },
        ],
      ],
      body: [
        [
          {
            content: `${company.internal_name}\n${company.cnpj}\n${company.telephone}\n${city.name} - ${city.State.name} \n${company.address} \n${company.zip_code}`,
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
      headStyles: {
        fillColor: '#1b2e62',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'PRODUTOS E SERVIÇOS',
            styles: {
              halign: 'left',
              fontSize: 18,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    let totalAmount = 0;

    const data = new Date(ordemCompra.created_at);

    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    const dataFormatada =
      dia.toString().padStart(2, '0') +
      '/' +
      mes.toString().padStart(2, '0') +
      '/' +
      ano;

    autoTable(doc, {
      head: [
        [
          { content: 'ITEM', styles: { halign: 'left' } },
          { content: 'QUANTIDADE', styles: { halign: 'right' } },
          { content: 'VALOR UNITÁRIO', styles: { halign: 'right' } },
          { content: 'FRETE', styles: { halign: 'right' } },
          { content: 'VALOR TOTAL', styles: { halign: 'right' } },
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
        fillColor: '#1b2e62',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'TOTAL:',
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
            content: `DATA DA SOLICITAÇÃO: ${dataFormatada}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    const buffer = doc.output();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=OrdemDeCompra-${id}.pdf`,
    );
    res.setHeader('Content-Type', 'application/pdf');

    res.end(buffer, 'binary');
  }

  async sendPdf(id: string, res: any) {
    const logoPath = 'src/assets/sem-fundo.png';

    let base64Data = '';

    fs.readFile(logoPath, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

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

    if (
      supplier.email === null ||
      supplier.email === undefined ||
      supplier.email === ''
    ) {
      return res.status(400).json({
        message: 'Email do fornecedor não encontrado.',
      });
    }

    const doc = new jsPDF();

    doc.addImage(base64Data, 'PNG', 10, 10, 40, 20, '', 'FAST');

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
            content: `ORDEM DE COMPRA`,
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
            content: `Nº DA ORDEM: # ${ordemCompra.identifier}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [
        [
          {
            content: 'FATURADO POR: ',
            styles: { halign: 'left', textColor: 'white' },
          },
        ],
      ],
      body: [
        [
          {
            content: `${supplier.name}\n${supplier.cnpj}\n${supplier.telephone}\n${supplier.address}, \n${supplier.district}`,
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
      headStyles: {
        fillColor: '#1b2e62',
      },
    });
    autoTable(doc, {
      head: [
        [
          {
            content: 'FATURADO PARA: ',
            styles: { halign: 'left', textColor: 'white' },
          },
        ],
      ],
      body: [
        [
          {
            content: `${company.internal_name}\n${company.cnpj}\n${company.telephone}\n${city.name} - ${city.State.name} \n${company.address} \n${company.zip_code}`,
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
      headStyles: {
        fillColor: '#1b2e62',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'PRODUTOS E SERVIÇOS',
            styles: {
              halign: 'left',
              fontSize: 18,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    let totalAmount = 0;

    const data = new Date(ordemCompra.created_at);

    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();

    const dataFormatada =
      dia.toString().padStart(2, '0') +
      '/' +
      mes.toString().padStart(2, '0') +
      '/' +
      ano;

    autoTable(doc, {
      head: [
        [
          { content: 'ITEM', styles: { halign: 'left' } },
          { content: 'QUANTIDADE', styles: { halign: 'right' } },
          { content: 'VALOR UNITÁRIO', styles: { halign: 'right' } },
          { content: 'FRETE', styles: { halign: 'right' } },
          { content: 'VALOR TOTAL', styles: { halign: 'right' } },
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
        fillColor: '#1b2e62',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'TOTAL:',
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
            content: `DATA DA SOLICITAÇÃO: ${dataFormatada}`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    const buffer = doc.output('datauristring');

    try {
      const msg = {
        to: supplier.email,
        from: process.env.FROM_EMAIL,
        subject: `Ordem de Compra RTA Engenheiros Consultores`,
        text: `Segue em anexo a ordem de compra solicitada pela empresa RTA Engenheiros Consultores`,
        html: `Segue em anexo a ordem de compra solicitada pela empresa RTA Engenheiros Consultores`,
        attachments: [
          {
            filename: `OrdemDeCompra-${id}.pdf`,
            content: buffer.split('base64,')[1],
          },
        ],
      };

      setTimeout(() => 2000);
      await this.sendEmail(
        msg.to,
        msg.from,
        msg.subject,
        msg.text,
        msg.html,
        msg.attachments,
      );

      return res.status(200).json({ message: 'Email enviado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao enviar email.' });
    }
  }

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
    attachments: any[],
  ) {
    await this.sendGrid.send({
      to,
      from,
      subject,
      text,
      html,
      attachments,
    });
  }
}
