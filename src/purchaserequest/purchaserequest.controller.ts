import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Req,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { PurchaseRequestService } from './purchaserequest.service';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { PatchPurchaseRequestDto } from './dto/patch-purchaserequest.dto';
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
    return await this.purchaseRequestService.create(
      postPurchaserequestDto,
      req,
    );
  }

  @Get()
  async findPagination(
    @Query('page') page: number,
    @Query('active') active: boolean,
  ) {
    return await this.purchaseRequestService.findPagination(page, active);
  }

  @Get('rowCount')
  async countRows(@Query('active') active: boolean) {
    return await this.purchaseRequestService.rowCount(active);
  }

  @Get()
  async findAll() {
    return await this.purchaseRequestService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.purchaseRequestService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.update(
      id,
      putPurchaseRequestDto,
      req,
    );
  }

  @Patch('approve/:id')
  async approve(
    @Param('id') id: string,
    @Body() patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.approve(
      id,
      patchPurchaseRequestDto,
      req,
    );
  }

  @Patch('reject/:id')
  async reject(
    @Param('id') id: string,
    @Body() patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.reject(
      id,
      patchPurchaseRequestDto,
      req,
    );
  }

  @Delete('deactivate/:id')
  async deactivate(@Param('id') id: string, @Req() req: any) {
    return await this.purchaseRequestService.deactivate(id, req);
  }
}
