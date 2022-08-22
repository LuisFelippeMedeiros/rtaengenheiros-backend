import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    postPurchaseRequestDto: PostPurchaseRequestDto,
    @Req() req: any,
  ) {
    return {
      status: true,
      message: `A Solicitação de compra ${postPurchaseRequestDto.product}, foi criada com sucesso.`,
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
    return {
      status: true,
      message: `A solicitação de compra ${putPurchaseRequestDto.product}, foi alterado com sucesso.`,
    };
  }

  async deactivate(
    id: string,
    putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    const update = {
      where: {
        id: id,
      },
      data: {
        active: putPurchaseRequestDto.active,
        rejected_by: req.user.id,
      },
    };

    await this.prisma.purchaseRequest.update(update);

    return {
      status: true,
      message: `O grupo ${putPurchaseRequestDto.product}, foi desativado com sucesso.`,
    };
  }
}
