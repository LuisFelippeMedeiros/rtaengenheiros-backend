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
      product_id: postPurchaseRequestDto.product_id,
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
    const purchaseRequests = await this.prisma.purchaseRequest.findMany();

    return purchaseRequests;
  }

  async findById(id: string) {
    return await this.prisma.purchaseRequest.findUnique({
      where: {
        id,
      },
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
        status: putPurchaseRequestDto.status,
        comment: putPurchaseRequestDto.comment,
        updated_by: req.user.id,
      },
    };

    const productName = await this.prisma.product.findFirst({
      where: { id: putPurchaseRequestDto.product_id },
    });

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `A solicitação de compra ${productName}, foi alterado com sucesso.`,
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
        status: patchPurchaseRequestDto.status,
        comment: patchPurchaseRequestDto.comment,
        approved_by: req.user.id,
        approved_at: new Date(),
      },
    };

    const productName = await this.prisma.product.findFirst({
      where: { id: patchPurchaseRequestDto.product_id },
    });

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `A solicitação de compra ${productName}, foi rejeitado com sucesso.`,
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
        status: patchPurchaseRequestDto.status,
        comment: patchPurchaseRequestDto.comment,
        rejected_by: req.user.id,
        rejected_at: new Date(),
      },
    };

    const productName = await this.prisma.product.findFirst({
      where: { id: patchPurchaseRequestDto.product_id },
    });

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `A solicitação de compra ${productName}, foi aprovado com sucesso.`,
    };
  }

  async deactivate(
    id: string,
    putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    const deactivate = {
      where: {
        id: id,
      },
      data: {
        active: putPurchaseRequestDto.active,
        deleted_by: req.user.id,
        deleted_at: new Date(),
      },
    };

    const productName = await this.prisma.product.findFirst({
      where: { id: putPurchaseRequestDto.product_id },
    });

    await this.prisma.purchaseRequest.update(deactivate);

    return {
      status: true,
      message: `O grupo ${productName}, foi desativado com sucesso.`,
    };
  }
}
