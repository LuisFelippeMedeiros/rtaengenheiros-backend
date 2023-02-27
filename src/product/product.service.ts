import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostProductDto } from './dto/post-product.dto';
import { PutProductDto } from './dto/put-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postProductDto: PostProductDto, @Req() req: any) {
    const data = {
      name: postProductDto.name,
      category_id: postProductDto.category_id,
      created_by: req.user.id,
    };

    const productExists = await this.findByName(data.name);

    if (productExists) {
      return {
        status: false,
        message:
          'Produto já cadastrado em nossa base de dados, favor verificar!',
      };
    }

    await this.prisma.product.create({ data });

    return {
      status: true,
      message: `O produto ${postProductDto.name}, foi criado com sucesso.`,
    };
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findPagination(page = 1, active: boolean, filter = '') {
    const products = await this.prisma.product.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        OR: [
          {
            name: {
              contains: filter
            }
          },
          {
            Category: {
              name: {
                contains: filter
              }
            }
          }
        ]
      },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products;
  }

  async rowCount(active = true) {
    return await this.prisma.product.count({
      where: { active },
    });
  }

  async findById(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByName(name: string) {
    return await this.prisma.product.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, putProductDto: PutProductDto, @Req() req: any) {
    const update = {
      where: { id },
      data: {
        name: putProductDto.name,
        category_id: putProductDto.category_id,
        active: putProductDto.active,
        updated_by: req.user.id,
        updated_at: new Date(),
      },
    };

    const updatedProduct = await this.findByName(update.data.name);

    if (updatedProduct == undefined || updatedProduct == null) {
      await this.prisma.product.update(update);

      return {
        status: true,
        message: `O produto ${putProductDto.name} foi alterado com sucesso.`,
      };
    }

    if (updatedProduct.name == update.data.name && id !== updatedProduct.id) {
      return {
        status: false,
        message:
          'O nome do produto que está tentando alterar já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }
  }

  async deactivate(id: string, @Req() req: any) {
    const product = await this.prisma.product.findFirst({ where: { id } });

    if (!product) {
      return {
        status: false,
        message: 'Este produto não existe em nossa base de dados.',
      };
    } else {
      product.active = false;
      (product.deleted_at = new Date()), (product.deleted_by = req.body.id);
    }

    await this.prisma.product.update({
      where: { id },
      data: product,
    });

    return {
      status: true,
      message: `O produto ${product.name}, foi desativado com sucesso.`,
    };
  }
}
