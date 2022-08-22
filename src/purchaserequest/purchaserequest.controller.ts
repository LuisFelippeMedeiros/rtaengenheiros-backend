import { Controller, Get, Post, Body, Put, Param, Req } from '@nestjs/common';
import { PurchaseRequestService } from './purchaserequest.service';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('PurchaseRequest')
@Controller({
  path: RouteVersion.route + 'purchaserequest',
  version: RouteVersion.version,
})
export class PurchaseRequestController {
  constructor(
    private readonly purchaseRequestService: PurchaseRequestService,
  ) {}

  @Post('create-purchaserequest')
  async create(
    @Body() postPurchaserequestDto: PostPurchaseRequestDto,
    @Req() req: any,
  ) {
    return this.purchaseRequestService.create(postPurchaserequestDto, req);
  }

  @Get()
  findAll() {
    return this.purchaseRequestService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.purchaseRequestService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    return this.purchaseRequestService.update(id, putPurchaseRequestDto, req);
  }

  @Put('deactivate/:id')
  async deactivate(
    @Param('id') id: string,
    @Body() putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.deactivate(
      id,
      putPurchaseRequestDto,
      req,
    );
  }
}
