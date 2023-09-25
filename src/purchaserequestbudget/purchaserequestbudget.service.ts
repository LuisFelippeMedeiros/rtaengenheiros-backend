import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestBudgetDto } from './dto/post-purchaserequestbudget.dto';
import { PutPurchaseRequestBudgetDto } from './dto/put-purchaserequestbudget.dto';

@Injectable()
export class PurchaseRequestBudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    postPurchaseRequestBudgetDto: Array<PostPurchaseRequestBudgetDto>,
  ) {
    try {
      postPurchaseRequestBudgetDto.forEach(
        async (value: PostPurchaseRequestBudgetDto) => {
          await this.prisma.purchaseRequestBudget.createMany({
            data: {
              quantity: value.quantity,
              budget: value.budget,
              shipping_fee: value.shipping_fee,
              purchaserequest_id: value.purchaserequest_id,
              supplier_id: value.supplier_id,
              to_be_approved: null,
              product_id: value.product_id,
            },
          });
        },
      );

      return {
        status: true,
        message: `Orçamento(s) criado(s) com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `erro ao criar orçamento(s)`,
      };
    }
  }

  async findAll() {
    return this.prisma.purchaseRequestBudget.findMany();
  }

  async findMany(purchaserequest_id: string) {
    const result = this.prisma.purchaseRequestBudget.findMany({
      where: { purchaserequest_id: purchaserequest_id },
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        Product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return result;
  }

  async findById(id: string) {
    return this.prisma.purchaseRequestBudget.findFirst({
      where: { id },
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        Product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async approvalReproval(id: string, action: boolean) {
    try {
      await this.prisma.purchaseRequestBudget.update({
        where: { id },
        data: {
          to_be_approved: action,
        },
      });
      const message = action ? 'aprovado' : 'reprovado';

      return {
        status: true,
        message: `Orçamento ${message} com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível fazer a alteração do orçamento`,
        inner: ex,
      };
    }
  }

  async update(
    id: string,
    putPurchaseRequestBudgetDto: PutPurchaseRequestBudgetDto,
  ) {
    try {
      await this.prisma.purchaseRequestBudget.update({
        where: {
          id: id,
        },
        data: {
          product_id: putPurchaseRequestBudgetDto.product_id,
          quantity: putPurchaseRequestBudgetDto.quantity,
          budget: putPurchaseRequestBudgetDto.budget,
          shipping_fee: putPurchaseRequestBudgetDto.shipping_fee,
          purchaserequest_id: putPurchaseRequestBudgetDto.purchaserequest_id,
          supplier_id: putPurchaseRequestBudgetDto.supplier_id,
          to_be_approved: putPurchaseRequestBudgetDto.to_be_approved,
        },
      });
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível realizar a alteração`,
        error: ex.message,
      };
    }

    return {
      status: true,
      message: `A orçamento foi alterado com sucesso`,
    };
  }
}
