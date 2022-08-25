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
      created_by: req.user.id,
    };

    const productExists = await this.findById(data.name);

    if (productExists) {
      return {
        status: true,
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
    const products = await this.prisma.product.findMany();

    return products;
  }

  async findById(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id,
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
      where: {
        id: id,
      },
      data: {
        name: putProductDto.name,
        active: putProductDto.active,
        updated_by: req.user.id,
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
        status: true,
        message:
          'O nome do produto que está tentando alterar já se encontra cadastrado em nossa base de dados, favor verificar.',
      };
    }

    await this.prisma.product.update(update);

    return {
      status: true,
      message: `O produto ${putProductDto.name} foi alterado com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const product = await this.prisma.product.findFirst({ where: { id } });

    if (!product) {
      return {
        status: false,
        message: 'Este produto não existe em nossa base de dados',
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
