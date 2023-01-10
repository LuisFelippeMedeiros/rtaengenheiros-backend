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
import { GetPurchaseRequestFilterDto } from './dto/get-purchaserequest-filter.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('PurchaseRequest')
@Controller({
  path: RouteVersion.route + 'purchaserequest',
  version: RouteVersion.version,
})
export class PurchaseRequestController {
  constructor(
    private readonly purchaseRequestService: PurchaseRequestService,
  ) {}

  @Post('create-purchase-request')
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
    @Query('status') status: string,
  ) {
    return await this.purchaseRequestService.findPagination(
      page,
      active,
      status,
    );
  }

  @Get('rowCount')
  async countRows(
    @Query('active') active: boolean,
    @Query('status') status: string,
  ) {
    return await this.purchaseRequestService.rowCount(active, status);
  }

  // @Get('all')
  // async findAll() {
  //   return await this.purchaseRequestService.findAll();
  // }

  @Get('byid/:id')
  async findById(@Param('id') id: string) {
    return await this.purchaseRequestService.findById(id);
  }

  @Get('all')
  async findFilter(@Query() filterDto: GetPurchaseRequestFilterDto) {
    return await this.purchaseRequestService.filtered(filterDto);
  }

  @Put('update/:id')
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

  @Patch('approvegestor/:id')
  async approveGestor(
    @Param('id') id: string,
    @Body() patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.approveGestor(
      id,
      patchPurchaseRequestDto,
      req,
    );
  }
  @Patch('approvediretor/:id')
  async approveDiretor(
    @Param('id') id: string,
    @Body() patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    return await this.purchaseRequestService.approveDiretor(
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
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.purchaseRequestService.deactivate(id, req);
  }

  @IsPublic()
  @Post('send-email/:email')
  async sendEmail(@Param('email') email: string): Promise<void> {
    await this.purchaseRequestService.sendEmail(email);
  }
}
