import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { PostPurchaseOrderDto } from './dto/post-purchaseorder.dto';

@Controller('purchaseorder')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: PostPurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(id);
  }
}
