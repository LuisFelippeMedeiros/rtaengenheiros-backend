import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/PrismaService";

@Injectable()
export class RowCountService {
  constructor(private readonly prisma: PrismaService) {}

  async rowCount(paginator: IPaginator) {
    const where = {
      active: paginator.active,
      name: {
        contains: paginator.filter
      }
    }

    switch (paginator.module) {
      case 'supplier':
        return await this.prisma.supplier.count({
          where: {
            active: paginator.active,
            OR: [
              {
                cnpj: {
                  contains: paginator.filter
                },
              },
              {
                name: {
                  contains: paginator.filter
                },
              }
            ]
          }
        });

      case 'category':
        return await this.prisma.category.count({where});

      case 'product':
        return await this.prisma.product.count({
          where: {
            active: paginator.active,
            OR: [
              {
                name: {
                  contains: paginator.filter
                }
              },
              {
                Category: {
                  name: {
                    contains: paginator.filter
                  }
                }
              }
            ]
          }
        });

      case 'company':
        return await this.prisma.company.count({
          where: {
            active: paginator.active,
            OR: [
              {
                name: {
                  contains: paginator.filter
                },
              },
              {
                cnpj: {
                  contains: paginator.filter
                },
              },
              {
                ie: {
                  contains: paginator.filter
                },
              },
              {
                City: {
                  name: {
                    contains: paginator.filter
                  }
                }
              }
            ]
          }
        });

      case 'groups':
        return await this.prisma.group.count({where});

      case 'user':
        return await this.prisma.user.count({where});

      case 'purchaserequest':
        return await this.prisma.purchaseRequest.count({
          where :{
            active: paginator.active,
            reason: paginator.filter
          }
        });

      case 'unit':
        return await this.prisma.unit.count({
          where: {
            active: paginator.active,
            OR: [
              {
                description: {
                  contains: paginator.filter
                } 
              },
              {
                initials: {
                  contains: paginator.filter
                }
              }
            ]
          }
        });
    }
  }
}