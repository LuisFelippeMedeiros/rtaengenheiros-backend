import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Order')
@Controller({
  path: RouteVersion.route + 'order',
  version: RouteVersion.version,
})
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get('all')
  findAll(@Req() req: any) {
    return this.purchaseOrderService.findAll(req);
  }

  @Get()
  async findPagination(@Query('page') page: number, @Req() req: any) {
    return await this.purchaseOrderService.findPagination(page, req);
  }

  @Get('rowCount')
  async countRows(@Req() req: any) {
    return await this.purchaseOrderService.rowCount(req);
  }

  @IsPublic()
  @Get('pdf/:id')
  async getOrder(@Res() res: any, @Param('id') id: string) {
    return await this.purchaseOrderService.getOrder(id, res);
  }

  @IsPublic()
  @Post('sendpdf/:id')
  async sendEmail(@Res() res: any, @Param('id') id: string) {
    return await this.purchaseOrderService.sendPdf(id, res);
  }
}
