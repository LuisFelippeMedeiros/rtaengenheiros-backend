import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestBudgetDto } from './dto/post-purchaserequestbudget.dto';
import { PutPurchaseRequestBudgetDto } from './dto/put-purchaserequestbudget.dto';

@Injectable()
export class PurchaseRequestBudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postPurchaseRequestBudgetDto: PostPurchaseRequestBudgetDto) {
    const data = {
      quantity: postPurchaseRequestBudgetDto.quantity,
      budget: postPurchaseRequestBudgetDto.budget,
      purchaserequest_id: postPurchaseRequestBudgetDto.purchaserequest_id,
      supplier_id: postPurchaseRequestBudgetDto.supplier_id,
      unit_id: postPurchaseRequestBudgetDto.unit_id,
      to_be_approved: null // postPurchaseRequestBudgetDto.to_be_approved,
    };

    await this.prisma.purchaseRequestBudget.create({ data });
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
        Unit: {
          select: {
            id: true,
            initials: true,
            description: true
          }
        }
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
        Unit: {
          select: {
            id: true,
            initials: true,
            description: true
          }
        }
      },
    });
  }

  async approval (id: string, action: boolean) {
    let data = await this.findById(id)

    console.log(action)

    if (data) {
      try {
        data.to_be_approved = action
        await this.prisma.purchaseRequestBudget.update({
          where: { id },
          data: {
            to_be_approved: data.to_be_approved,
            id: data.id,
            quantity: data.quantity,
            supplier_id: data.supplier_id,
            unit_id: data.unit_id,
            budget: data.budget
          }
        })
        let message = action ? 'aprovado' : 'desaprovado'

        return {
          status: true,
          message: `Orçamento ${message} com sucesso`,
        };
      } catch (ex) {
        return {
          status: false,
          message: `Não foi possível fazer a alteração do orçamento`,
          inner: ex
        };
      }
    } else {
      return {
        status: false,
        message: `Orçamento não encontrado`
      };
    }
  }

  async update(
    id: string,
    putPurchaseRequestBudgetDto: PutPurchaseRequestBudgetDto,
  ) {
    const update = {
      where: {
        id,
      },
      data: {
        quantity: putPurchaseRequestBudgetDto.quantity,
        budget: putPurchaseRequestBudgetDto.budget,
        purchaserequest_id: putPurchaseRequestBudgetDto.purchaserequest_id,
        supplier_id: putPurchaseRequestBudgetDto.supplier_id,
        unit_id: putPurchaseRequestBudgetDto.unit_id,
        to_be_approved: putPurchaseRequestBudgetDto.to_be_approved,
      },
    };

    try {
      await this.prisma.purchaseRequestBudget.update(update);
      return {
        status: false,
        message: `Orçamento alterado com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível fazer a alteração do orçamento`,
        inner: ex
      };
    }
  }
}
