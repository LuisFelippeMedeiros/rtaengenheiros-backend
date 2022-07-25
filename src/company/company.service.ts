import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.company.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }
}
