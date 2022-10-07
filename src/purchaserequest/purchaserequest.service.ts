import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { PatchPurchaseRequestDto } from './dto/patch-purchaserequest.dto';

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    postPurchaseRequestDto: PostPurchaseRequestDto,
    @Req() req: any,
  ) {
    const data = {
      reason: postPurchaseRequestDto.reason,
      status_id: postPurchaseRequestDto.status,
      comment: postPurchaseRequestDto.comment,
      created_by: req.user.id,
    };

    await this.prisma.purchaseRequest.create({ data });

    return {
      status: true,
      message: `A Solicitação de compra foi criada com sucesso.`,
    };
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

  // async rowCount(active = true, status_id: string) {
  //   return await this.prisma.purchaseRequest.count({
  //     where: { active, status_id },
  //   });
  // }

  // async findPagination(page = 1, active: boolean, status = '') {
  //   const purchaseRequest = await this.prisma.purchaseRequest.findMany({
  //     take: 5,
  //     skip: 5 * (page - 1),
  //     where: {
  //       active,
  //       status_id: status,
  //     },
  //     include: {
  //       Product: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //       Status: {
  //         select: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });

  //   return purchaseRequest;
  // }

  async findById(id: string) {
    return await this.prisma.purchaseRequest.findUnique({
      where: {
        id,
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
  }

  async findPagination(page = 1, active: boolean, status = '') {
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
