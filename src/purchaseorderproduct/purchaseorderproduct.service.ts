import { Injectable } from '@nestjs/common';
import { CreatePurchaseorderproductDto } from './dto/create-purchaseorderproduct.dto';
import { UpdatePurchaseorderproductDto } from './dto/update-purchaseorderproduct.dto';

@Injectable()
export class PurchaseorderproductService {
  create(createPurchaseorderproductDto: CreatePurchaseorderproductDto) {
    return 'This action adds a new purchaseorderproduct';
  }

  findAll() {
    return `This action returns all purchaseorderproduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseorderproduct`;
  }

  update(id: number, updatePurchaseorderproductDto: UpdatePurchaseorderproductDto) {
    return `This action updates a #${id} purchaseorderproduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseorderproduct`;
  }
}
