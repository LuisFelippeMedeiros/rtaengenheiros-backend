import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { PatchPurchaseRequestDto } from './dto/patch-purchaserequest.dto';

const statusPurchaseRequest = {
  waiting: 'AGUARDANDO',
  approved: 'APROVADO',
  reject: 'REJEITADO',
};

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    postPurchaseRequestDto: PostPurchaseRequestDto,
    @Req() req: any,
  ) {
    const sizeArrayProductId = postPurchaseRequestDto.product_id.length;

    if (sizeArrayProductId === 0) {
      return {
        status: false,
        message: `Não há nenhum produto nesta solicitação`,
      };
    }

    const data = {
      reason: postPurchaseRequestDto.reason,
      status_id: '',
      comment: postPurchaseRequestDto.comment,
      created_by: req.user.id,
      company_id: req.user.company_id,
    };

    try {
      const statusWaiting = await this.prisma.status.findFirst({
        where: { name: statusPurchaseRequest.waiting },
      });
      data.status_id = statusWaiting.id;

      const result = await this.prisma.purchaseRequest.create({ data });

      for (let i = 0; i < sizeArrayProductId; i++) {
        await this.prisma.purchaseRequestProduct.create({
          data: {
            product_id: postPurchaseRequestDto.product_id[i],
            purchaserequest_id: result.id,
          },
        });
      }

      return {
        status: true,
        message: `A Solicitação de compra foi criada com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível criar uma nova solicitação`,
        warning: ex.message,
      };
    }
  }

  async findAll() {
    const purchaseRequests = await this.prisma.purchaseRequest.findMany({
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return purchaseRequests;
  }

  async findById(id: string) {
    const purchase: any = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const purchaseProduct = await this.prisma.purchaseRequestProduct.findMany({
      where: {
        purchaserequest_id: purchase.id,
      },
    });

    const products = [];

    for (let i = 0; i < purchaseProduct.length; i++) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: purchaseProduct[i].product_id,
        },
      });
      products.push(product);
    }

    purchase.products = products;

    return purchase;
  }

  async findPagination(page = 1, active = true, status = '') {
    const purchaseRequest = await this.prisma.purchaseRequest.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        status_id: status,
      },
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return purchaseRequest;
  }

  async rowCount(active = true, status_id: string) {
    return await this.prisma.purchaseRequest.count({
      where: { active, status_id },
    });
  }

  async update(
    id: string,
    putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    const update = {
      where: {
        id: id,
      },
      data: {
        reason: putPurchaseRequestDto.reason,
        status_id: putPurchaseRequestDto.status,
        comment: putPurchaseRequestDto.comment,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `A solicitação de compra, foi alterada com sucesso.`,
    };
  }

  async approve(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const update = {
      where: {
        id: id,
      },
      data: {
        status_id: patchPurchaseRequestDto.status,
        comment: patchPurchaseRequestDto.comment,
        approved_by: req.user.id,
        approved_at: new Date(),
      },
    };

    const findBudget = await this.prisma.purchaseRequestBudget.findFirst({
      where: {
        id: req.query.id,
      },
    });

    const productName = await this.prisma.purchaseRequestProduct.findFirst({
      where: {
        id: req.query.id,
      },
      include: {
        Product: {
          select: {
            name: true,
          },
        },
      },
    });

    const data = {
      name: productName.Product.name,
      type: req.params.type,
      supplier_id: findBudget.supplier_id,
      price: findBudget.budget,
      created_by: req.user.id,
      company_id: req.user.company_id,
    };

    await this.prisma.purchaseRequest.update(update);

    await this.prisma.billToPay.create({ data });

    return {
      status: true,
      message: `A solicitação de compra, foi aprovado com sucesso. Acesse contas a pagar para terminar de editar a nova conta criada.`,
    };
  }

  async reject(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const update = {
      where: {
        id: id,
      },
      data: {
        status_id: patchPurchaseRequestDto.status,
        comment: patchPurchaseRequestDto.comment,
        rejected_by: req.user.id,
        rejected_at: new Date(),
      },
    };

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `A solicitação de compra, foi rejeitada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const deactivate = {
      where: { id },
      data: {
        active: false,
        deleted_by: req.user.id,
        deleted_at: new Date(),
      },
    };

    await this.prisma.purchaseRequest.update(deactivate);

    return {
      status: true,
      message: `O pedido de compra foi desativada com sucesso.`,
    };
  }
}
