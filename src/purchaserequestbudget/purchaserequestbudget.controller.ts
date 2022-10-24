import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
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
    @Body() postPurchaseRequestBudgetDto: PostPurchaseRequestBudgetDto,
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.purchaseRequestBudgetService.findOne(id);
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
