import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { PatchPurchaseRequestDto } from './dto/patch-purchaserequest.dto';
import { GetPurchaseRequestFilterDto } from './dto/get-purchaserequest-filter.dto';
import { EStatus } from '../common/enum/status.enum';
import { ERole } from '../common/enum/role.enum';

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
        where: { name: EStatus.waiting },
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
    const sizeArrayProductId = putPurchaseRequestDto.product_id.length;

    if (sizeArrayProductId === 0) {
      return {
        status: false,
        message: `Não há nenhum produto, por favor, escolha ao menos um`,
      };
    }

    const purchaseRequestApproved =
      await this.prisma.purchaseRequest.findUnique({
        where: {
          id,
        },
        include: {
          Status: {
            select: {
              name: true,
            },
          },
        },
      });

    if (purchaseRequestApproved.Status.name === EStatus.approved) {
      return {
        status: false,
        message: `Essa solicitação de compra se encontra com o status de APROVADA, não podendo ser alterada`,
      };
    }

    const data = {
      id,
      reason: putPurchaseRequestDto.reason,
      comment: putPurchaseRequestDto.comment,
      statud_id: putPurchaseRequestDto.status_id,
      updated_by: req.user.id,
      updated_at: new Date(),
    };

    try {
      await this.prisma.purchaseRequest.update({
        where: { id },
        data,
      });

      try {
        await this.prisma.purchaseRequestProduct.deleteMany({
          where: {
            purchaserequest_id: id,
          },
        });

        for (let i = 0; i < sizeArrayProductId; i++) {
          await this.prisma.purchaseRequestProduct.create({
            data: {
              product_id: putPurchaseRequestDto.product_id[i],
              purchaserequest_id: id,
            },
          });
        }
      } catch (ex) {
        return {
          status: false,
          message: `Não foi possível fazer a alteração`,
          error: ex.message,
        };
      }

      return {
        status: true,
        message: `A solicitação de compra foi alterada com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível fazer a alteração`,
        error: ex.message,
      };
    }
  }

  async approve(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        group: {
          select: {
            name: true,
          },
        },
      },
    });

    if (user.group.name === ERole.gestor) {
      const update = {
        where: {
          id: id,
        },
        data: {
          status_id: patchPurchaseRequestDto.status,
          comment: patchPurchaseRequestDto.comment,
          approveddiretor_at: new Date(),
          approveddiretor_by: req.user.id,
        },
      };
      await this.prisma.purchaseRequest.update(update);

      return {
        status: true,
        message: `A solicitação de compra foi aprovado pelo Gestor com sucesso, agora precisa da aprovação do Diretor.`,
      };
    }

    if (user.group.name === ERole.diretor) {
      const update = {
        where: {
          id: id,
        },
        data: {
          status_id: patchPurchaseRequestDto.status,
          comment: patchPurchaseRequestDto.comment,
          approveddiretor_at: new Date(),
          approveddiretor_by: req.user.id,
        },
      };
      await this.prisma.purchaseRequest.update(update);
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
        type: 'SC',
        supplier_id: findBudget.supplier_id,
        price_approved: findBudget.budget,
        price_updated: findBudget.budget,
        created_by: req.user.id,
        company_id: req.user.company_id,
      };

      await this.prisma.billToPay.create({ data });

      return {
        status: true,
        message: `A solicitação de compra, foi aprovado com sucesso. Acesse contas a pagar para terminar de editar a nova conta criada.`,
      };
    }
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

  async filtered(filterDto: GetPurchaseRequestFilterDto) {
    const { id, initial_date, final_date, created_by, company_id } = filterDto;
    console.log(initial_date, final_date);
    let purchases = await this.prisma.purchaseRequest.findMany({
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (id) {
      purchases = purchases.filter((purchase) => purchase.id === id);
    }
    if (created_by) {
      purchases = purchases.filter(
        (purchase) => purchase.created_by === created_by,
      );
    }
    if (initial_date && final_date) {
      purchases = purchases.filter(
        (purchase) =>
          purchase.created_at.toISOString <= initial_date.toISOString &&
          purchase.created_at.toISOString >= final_date.toISOString,
      );
    }
    if (company_id) {
      purchases = purchases.filter(
        (purchase) => purchase.company_id === company_id,
      );
    }

    return purchases;
  }
}
