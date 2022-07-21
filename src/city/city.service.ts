import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  findByState(state_id: number) {
    return this.prisma.city.findMany({
      where: {
        state_id,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
