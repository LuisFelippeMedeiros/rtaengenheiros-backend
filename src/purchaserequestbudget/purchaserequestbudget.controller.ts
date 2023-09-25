import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { PurchaseRequestBudgetService } from './purchaserequestbudget.service';
import { PostPurchaseRequestBudgetDto } from './dto/post-purchaserequestbudget.dto';
import { PutPurchaseRequestBudgetDto } from './dto/put-purchaserequestbudget.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('PurchaseRequestBudget')
@Controller({
  path: RouteVersion.route + 'purchaserequestbudget',
  version: RouteVersion.version,
})
export class PurchaserequestbudgetController {
  constructor(
    private readonly purchaseRequestBudgetService: PurchaseRequestBudgetService,
  ) {}

  @Post('create-purchase-request-budget')
  async create(
    @Body() postPurchaseRequestBudgetDto: Array<PostPurchaseRequestBudgetDto>,
  ) {
    return this.purchaseRequestBudgetService.create(
      postPurchaseRequestBudgetDto,
    );
  }

  // Não poderá ter essa rota, devido a ser retornado somente quando possui um orçamento vínculado
  // @Get('all')
  // async findAll() {
  //   return this.purchaseRequestBudgetService.findAll();
  // }

  @Get('byid/:id')
  async findById(@Param('id') id: string) {
    return this.purchaseRequestBudgetService.findById(id);
  }

  @Get(':purchaserequest_id')
  async findMany(@Param('purchaserequest_id') purchaserequest_id: string) {
    return this.purchaseRequestBudgetService.findMany(purchaserequest_id);
  }

  @Put('approval/:id')
  async approval(@Param('id') id: string) {
    return this.purchaseRequestBudgetService.approvalReproval(id, true);
  }

  @Put('reproval/:id')
  async reproval(@Param('id') id: string) {
    return this.purchaseRequestBudgetService.approvalReproval(id, false);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putPurchaseRequestBudgetDto: PutPurchaseRequestBudgetDto,
  ) {
    return this.purchaseRequestBudgetService.update(
      id,
      putPurchaseRequestBudgetDto,
    );
  }
}
