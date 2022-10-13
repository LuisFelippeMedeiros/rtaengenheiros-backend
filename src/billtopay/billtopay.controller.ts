import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
  async findAll() {
    return this.billtopayService.findAll();
  }

  @Get()
  async findPagination(
    @Query('page') page: number,
    @Query('active') active: boolean,
  ) {
    return await this.billtopayService.findPagination(page, active);
  }

  @Get('rowCount')
  async countRows(@Query('active') active: boolean) {
    return await this.billtopayService.rowCount(active);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.billtopayService.findById(id);
  }

  @Get('byname/:name')
  async findByName(@Param('name') name: string) {
    return this.billtopayService.findByName(name);
  }

  @Patch(':id')
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
