import { Injectable } from '@nestjs/common';
import { PostPurchaseOrderDto } from './dto/post-purchaseorder.dto';
import { PutPurchaseOrderDto } from './dto/put-purchaseorder.dto';

@Injectable()
export class PurchaseOrderService {
  create(postPurchaseOrderDto: PostPurchaseOrderDto) {
    return 'This action adds a new purchaseorder';
  }

  findAll() {
    return `This action returns all purchaseorder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseorder`;
  }

  update(id: number, putPurchaseOrderDto: PutPurchaseOrderDto) {
    return `This action updates a #${id} purchaseorder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseorder`;
  }
}
