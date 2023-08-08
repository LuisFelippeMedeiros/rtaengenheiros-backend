import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestBudgetDto } from './dto/post-purchaserequestbudget.dto';
import { PutPurchaseRequestBudgetDto } from './dto/put-purchaserequestbudget.dto';

@Injectable()
export class PurchaseRequestBudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postPurchaseRequestBudgetDto: PostPurchaseRequestBudgetDto) {
    const products = await this.prisma.purchaseRequestProduct.findMany({
      where: {
        id: postPurchaseRequestBudgetDto.purchaserequest_id,
      },
    });

    const productArray = products.length;

    try {
      for (let i = 0; i < productArray; i++) {
        await this.prisma.purchaseRequestBudget.create({
          data: {
            quantity: postPurchaseRequestBudgetDto.quantity,
            budget: postPurchaseRequestBudgetDto.budget,
            shipping_fee: postPurchaseRequestBudgetDto.shipping_fee,
            purchaserequest_id: postPurchaseRequestBudgetDto.purchaserequest_id,
            supplier_id: postPurchaseRequestBudgetDto.supplier_id,
            to_be_approved: null, // postPurchaseRequestBudgetDto.to_be_approved,
            product_id: postPurchaseRequestBudgetDto.product_id,
          },
        });
      }
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível realizar a alteração`,
        error: ex.message,
      };
    }

    const data = {
      quantity: postPurchaseRequestBudgetDto.quantity,
      budget: postPurchaseRequestBudgetDto.budget,
      shipping_fee: postPurchaseRequestBudgetDto.shipping_fee,
      purchaserequest_id: postPurchaseRequestBudgetDto.purchaserequest_id,
      supplier_id: postPurchaseRequestBudgetDto.supplier_id,
      to_be_approved: null, // postPurchaseRequestBudgetDto.to_be_approved,
      product_id: postPurchaseRequestBudgetDto.product_id,
    };

    await this.prisma.purchaseRequestBudget.create({ data });

    return {
      status: true,
      message: `Orçamento criado com sucesso`,
    };
  }

  async findAll() {
    return this.prisma.purchaseRequestBudget.findMany();
  }

  async findOne(purchaserequest_id: string) {
    return this.prisma.purchaseRequestBudget.findMany({
      where: { purchaserequest_id },
      include: {
        Supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
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
    const products = await this.prisma.purchaseRequestProduct.findMany({
      where: {
        id,
      },
    });

    const productArray = products.length;

    try {
      for (let i = 0; i < productArray; i++) {
        await this.prisma.purchaseRequestBudget.update({
          where: {
            id: id,
          },
          data: {
            product_id: putPurchaseRequestBudgetDto.product_id[i],
            quantity: putPurchaseRequestBudgetDto.quantity,
            budget: putPurchaseRequestBudgetDto.budget,
            shipping_fee: putPurchaseRequestBudgetDto.shipping_fee,
            purchaserequest_id: putPurchaseRequestBudgetDto.purchaserequest_id,
            supplier_id: putPurchaseRequestBudgetDto.supplier_id,
            to_be_approved: putPurchaseRequestBudgetDto.to_be_approved,
          },
        });
      }
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
