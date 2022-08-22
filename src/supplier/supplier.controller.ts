import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create-supplier')
  create(@Body() postSupplierDto: PostSupplierDto, @Req() req: any) {
    return this.supplierService.create(postSupplierDto, req);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('active') active: boolean) {
    return this.supplierService.findAll(page, active);
  }

  @Get('rowCount')
  async countRows() {
    return await this.supplierService.rowCount();
  }

  @Get(':id')
  findOne(@Param('cnpj') cnpj: string) {
    return this.supplierService.findByCNPJ(cnpj);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() putSupplierDto: PutSupplierDto,
    @Req() req: any,
  ) {
    return this.supplierService.update(id, putSupplierDto, req);
  }

  @Patch('deactivate:id')
  deactivate(
    @Param('id') id: string,
    @Body() putSupplierDto: PutSupplierDto,
    @Req() req: any,
  ) {
    return this.supplierService.deactivate(id, putSupplierDto, req);
  }
}
