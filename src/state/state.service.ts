import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class StateService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.state.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }
}
