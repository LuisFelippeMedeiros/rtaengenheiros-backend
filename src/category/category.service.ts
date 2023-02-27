import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostCategoryDto } from './dto/post-category.dto';
import { PutCategoryDto } from './dto/put-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postCategoryDto: PostCategoryDto, @Req() req: any) {
    const data = {
      name: postCategoryDto.name,
      created_by: req.user.id,
    };

    const categoryExists = await this.findByName(data.name);

    if (categoryExists) {
      return {
        status: false,
        message:
          'Categoria já cadastrada em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.category.create({ data });

    return {
      status: true,
      message: `A categoria ${postCategoryDto.name}, foi criada com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findPagination(page = 1, active: boolean, filter = '') {
    const categories = await this.prisma.category.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        name: {
          contains: filter,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  async rowCount(active = true) {
    return await this.prisma.category.count({
      where: { active },
    });
  }

  async findById(id: string) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return await this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, putCategoryDto: PutCategoryDto, @Req() req: any) {
    const update = {
      where: {
        id: id,
      },
      data: {
        name: putCategoryDto.name,
        active: putCategoryDto.active,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const updatedCategory = await this.findByName(update.data.name);

    if (updatedCategory == undefined || updatedCategory == null) {
      await this.prisma.category.update(update);

      return {
        status: true,
        message: `A categoria ${putCategoryDto.name}, foi alterada com sucesso.`,
      };
    }

    if (updatedCategory.name == update.data.name && id !== updatedCategory.id) {
      return {
        status: false,
        message:
          'O nome da categoria que está tentando alterar já se encontra cadastrada em nossa base de dados, favor verificar.',
      };
    }

    await this.prisma.category.update(update);

    return {
      status: true,
      message: `A categoria ${putCategoryDto.name}, foi alterada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      return {
        status: false,
        message: 'Esta categoria não existe em nossa base de dados.',
      };
    } else {
      category.active = false;
      (category.deleted_at = new Date()), (category.deleted_by = req.user.id);
    }

    await this.prisma.category.update({
      where: { id },
      data: category,
    });

    return {
      status: true,
      message: `A categoria ${category.name}, foi desativada com sucesso.`,
    };
  }
}
