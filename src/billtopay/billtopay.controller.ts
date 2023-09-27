import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Delete,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';
import { BillToPayService } from './billtopay.service';
import { PostBillToPayDto } from './dto/post-billtopay.dto';
import { PutBillToPayDto } from './dto/put-billtopay.dto';

@ApiTags('BillToPay')
@Controller({
  path: RouteVersion.route + 'billtopay',
  version: RouteVersion.version,
})
export class BillToPayController {
  constructor(private readonly billtopayService: BillToPayService) {}

  @Post('create-bill-to-pay')
  async create(@Body() postBillToPayDto: PostBillToPayDto, @Req() req: any) {
    return this.billtopayService.create(postBillToPayDto, req);
  }

  @Get('all')
  async findAll(@Req() req: any) {
    return this.billtopayService.findAll(req);
  }

  @Get()
  async findPagination(
    @Query('filters') filters: IFilter_bill_to_pay,
    @Query('onlyRowCount') onlyRowCount: boolean,
    @Query('onlyTotal') onlyTotal: boolean,
    @Req() req: any,
  ) {
    return await this.billtopayService.findPagination(
      filters,
      onlyRowCount,
      onlyTotal,
      req,
    );
  }

  @Get('rowCount')
  async countRows(@Req() req: any) {
    return await this.billtopayService.rowCount(req);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.billtopayService.findById(id);
  }

  @Get('byname/:name')
  async findByName(@Param('name') name: string) {
    return this.billtopayService.findByName(name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putBillToPayDto: PutBillToPayDto,
    @Req() req: any,
  ) {
    return this.billtopayService.update(id, putBillToPayDto, req);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.billtopayService.deactivate(id, req);
  }

  @Patch('paid/:id')
  async paid(@Param('id') id: string, @Req() req: any) {
    return this.billtopayService.paid(id, req);
  }

  @Patch(':id/invoice')
  @UseInterceptors(FileInterceptor('file'))
  async updateInvoice(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const result = await this.billtopayService.uploadInvoice(
      id,
      file.buffer,
      file.originalname,
    );
    return result;
  }
}
