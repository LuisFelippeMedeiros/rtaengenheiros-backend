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
      },
    });
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
      },
    };

    await this.prisma.purchaseRequestBudget.update(update);
  }
}
