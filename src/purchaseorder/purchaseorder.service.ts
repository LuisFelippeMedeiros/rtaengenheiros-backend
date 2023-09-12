import { Injectable } from '@nestjs/common';
import { PostPurchaseOrderDto } from './dto/post-purchaseorder.dto';

@Injectable()
export class PurchaseOrderService {
  create(postPurchaseOrderDto: PostPurchaseOrderDto) {
    return 'This action adds a new purchaseorder';
  }

  findAll() {
    return `This action returns all purchaseorder`;
  }

  findOne(id: string) {
    return `This action returns a #${id} purchaseorder`;
  }

  remove(id: string) {
    return `This action removes a #${id} purchaseorder`;
  }
}
