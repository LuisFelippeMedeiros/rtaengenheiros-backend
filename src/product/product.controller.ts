import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PostProductDto } from './dto/post-product.dto';
import { PutProductDto } from './dto/put-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('Products')
@Controller({
  path: RouteVersion.route + 'products',
  version: RouteVersion.version,
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() postProductDto: PostProductDto, @Req() req: any) {
    return await this.productService.create(postProductDto, req);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findProduct(@Param('id') id: string) {
    return await this.productService.findById(id);
  }

  @Get('byname/:name')
  async findOne(@Param('name') name: string) {
    return await this.productService.findByName(name);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() putProductDto: PutProductDto,
    @Req() req: any,
  ) {
    return await this.productService.update(id, putProductDto, req);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.productService.deactivate(id, req);
  }
}
