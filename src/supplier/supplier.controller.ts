import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { PostSupplierDto } from './dto/post-supplier.dto';
import { PutSupplierDto } from './dto/put-supplier.dto';
import { RouteVersion } from 'src/statics/route.version';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suppliers')
@Controller({
  path: RouteVersion.route + 'supplier',
  version: RouteVersion.version,
})
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create-supplier')
  async create(@Body() postSupplierDto: PostSupplierDto, @Req() req: any) {
    return await this.supplierService.create(postSupplierDto, req);
  }

  @Get('filter')
  async findFilter(@Query('filter') filter: string, @Req() req: any) {
    return await this.supplierService.findFilter(filter, req);
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('active') active: boolean,
    @Query('filter') filter: string,
    @Req() req: any,
  ) {
    return await this.supplierService.findAll(page, active, filter, req);
  }

  @Get('all')
  async getAll(@Req() req: any) {
    return await this.supplierService.getAll(req);
  }

  @Get('rowCount')
  async countRows(@Query('active') active: boolean, @Req() req: any) {
    return await this.supplierService.rowCount(active, req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.supplierService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putSupplierDto: PutSupplierDto,
    @Req() req: any,
  ) {
    return await this.supplierService.update(id, putSupplierDto, req);
  }

  @Delete('deactivate/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.supplierService.deactivate(id, req);
  }
}
