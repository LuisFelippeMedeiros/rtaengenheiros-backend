import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseorder.service';
import { Response } from 'express';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller({
  path: RouteVersion.route + 'order',
  version: RouteVersion.version,
})
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get('all')
  findAll() {
    return this.purchaseOrderService.findAll();
  }

  @Get()
  async findPagination(@Query('page') page: number) {
    return await this.purchaseOrderService.findPagination(page);
  }

  @Get('rowCount')
  async countRows() {
    return await this.purchaseOrderService.rowCount();
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const nomeArquivo = await this.purchaseOrderService.generatePdf(id);

      res.download(nomeArquivo);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao gerar o PDF da ordem de compra.' });
    }
  }

  @Post(':id/enviar-ordem')
  async sendOrder(@Param('id') id: string) {
    return await this.purchaseOrderService.sendOrder(id);
  }
}
