import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestProductDto } from './dto/post-purchaserequestproduct.dto';
import { PutPurchaseRequestProductDto } from './dto/put-purchaserequestproduct.dto';

@Injectable()
export class PurchaseRequestProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postPurchaseRequestProductDto: PostPurchaseRequestProductDto) {
    const data = {
      purchaserequest_id: postPurchaseRequestProductDto.purchaserequest_id,
      product_id: postPurchaseRequestProductDto.product_id,
    };

    await this.prisma.purchaseRequestProduct.create({ data });
  }

  async findAll() {
    return this.prisma.purchaseRequestProduct.findMany();
  }

  async findOne(purchaserequest_id: string) {
    return this.prisma.purchaseRequestProduct.findMany({
      where: { purchaserequest_id },
      include: {
        Product: {
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
    putPurchaseRequestProductDto: PutPurchaseRequestProductDto,
  ) {
    const update = {
      where: {
        id,
      },
      data: {
        purchaserequest_id: putPurchaseRequestProductDto.purchaserequest_id,
        product_id: putPurchaseRequestProductDto.product_id,
      },
    };

    await this.prisma.purchaseRequestProduct.update(update);
  }
}
