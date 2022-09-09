import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { PostCategoryDto } from './dto/post-category.dto';
import { PutCategoryDto } from './dto/put-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { RouteVersion } from 'src/statics/route.version';

@ApiTags('Categories')
@Controller({
  path: RouteVersion.route + 'category',
  version: RouteVersion.version,
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() postCategoryDto: PostCategoryDto, @Req() req: any) {
    return await this.categoryService.create(postCategoryDto, req);
  }

  @Get('all')
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get()
  async findPagination(@Query('page') page: number, @Query('active') active: boolean) {
    return await this.categoryService.findPagination(page, active);
  }

  @Get('rowCount')
  async countRows(@Query('active') active: boolean) {
    return await this.categoryService.rowCount(active);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.categoryService.findById(id);
  }

  @Get('byname/:name')
  async findByName(@Param('name') name: string) {
    return await this.categoryService.findByName(name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() putCategoryDto: PutCategoryDto,
    @Req() req: any,
  ) {
    return await this.categoryService.update(id, putCategoryDto, req);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.categoryService.deactivate(id, req);
  }
}
