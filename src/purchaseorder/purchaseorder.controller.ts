import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { Response } from 'express';
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

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const nomeArquivo = await this.purchaseOrderService.generatePdf(id);

      res.setHeader('Content-Type', 'application/pdf');

      res.send(nomeArquivo);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Erro ao gerar o PDF da ordem de compra.' });
    }
  }

  @Post(':id/enviar-ordem')
  async sendOrder(@Param('id') id: string) {
    return await this.purchaseOrderService.sendOrder(id);
  }

  @IsPublic()
  @Get('get/:id')
  async getOrder(@Param('id') id: string) {
    return await this.purchaseOrderService.getOrder(id);
  }
}
