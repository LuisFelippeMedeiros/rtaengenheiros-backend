import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { PurchaseRequestProductService } from './purchaserequestproduct.service';
import { PostPurchaseRequestProductDto } from './dto/post-purchaserequestproduct.dto';
import { PutPurchaseRequestProductDto } from './dto/put-purchaserequestproduct.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('PurchaseRequestProduct')
@Controller({
  path: RouteVersion.route + 'purchaserequestproduct',
  version: RouteVersion.version,
})
export class PurchaseRequestProductController {
  constructor(
    private readonly purchaseRequestProductService: PurchaseRequestProductService,
  ) {}

  @Post('create-purchase-request-product')
  async create(
    @Body() postPurchaseRequestProductDto: PostPurchaseRequestProductDto,
  ) {
    return this.purchaseRequestProductService.create(
      postPurchaseRequestProductDto,
    );
  }

  @Get('all')
  async findAll() {
    return this.purchaseRequestProductService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.purchaseRequestProductService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putPurchaseRequestProductDto: PutPurchaseRequestProductDto,
  ) {
    return this.purchaseRequestProductService.update(
      id,
      putPurchaseRequestProductDto,
    );
  }
}
