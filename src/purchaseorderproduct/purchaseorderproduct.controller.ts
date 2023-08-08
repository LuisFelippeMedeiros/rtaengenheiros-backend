import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseorderproductService } from './purchaseorderproduct.service';
import { CreatePurchaseorderproductDto } from './dto/create-purchaseorderproduct.dto';
import { UpdatePurchaseorderproductDto } from './dto/update-purchaseorderproduct.dto';

@Controller('purchaseorderproduct')
export class PurchaseorderproductController {
  constructor(private readonly purchaseorderproductService: PurchaseorderproductService) {}

  @Post()
  create(@Body() createPurchaseorderproductDto: CreatePurchaseorderproductDto) {
    return this.purchaseorderproductService.create(createPurchaseorderproductDto);
  }

  @Get()
  findAll() {
    return this.purchaseorderproductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseorderproductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseorderproductDto: UpdatePurchaseorderproductDto) {
    return this.purchaseorderproductService.update(+id, updatePurchaseorderproductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseorderproductService.remove(+id);
  }
}
