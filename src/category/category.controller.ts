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

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.categoryService.findById(id);
  }

  @Get('byname/:name')
  async findByName(@Param('name') name: string) {
    return await this.categoryService.findByName(name);
  }

  @Patch(':id')
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
