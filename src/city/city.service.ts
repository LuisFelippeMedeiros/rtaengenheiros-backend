import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  findByState(state_id: number, filter: string) {
    return this.prisma.city.findMany({
      where: {
        state_id,
        name: {
          mode: 'insensitive',
          contains: filter,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
