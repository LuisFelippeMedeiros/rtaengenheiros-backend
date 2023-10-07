import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PostPurchaseRequestDto } from './dto/post-purchaserequest.dto';
import { PutPurchaseRequestDto } from './dto/put-purchaserequest.dto';
import { PatchPurchaseRequestDto } from './dto/patch-purchaserequest.dto';
import { GetPurchaseRequestFilterDto } from './dto/get-purchaserequest-filter.dto';
import { EStatus } from '../common/enum/status.enum';
import { ERole } from '../common/enum/role.enum';
import { EGroupType } from '../common/enum/grouptype.enum';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class PurchaseRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendGrid: SendGridService,
  ) {}

  async create(
    postPurchaseRequestDto: PostPurchaseRequestDto,
    @Req() req: any,
  ) {
    const bill = await this.prisma.billToPay.findFirst({
      orderBy: { identifier: 'desc' },
    });

    let nextId: number;

    if (bill?.identifier === null || bill?.identifier === undefined) {
      nextId = 1;
    } else {
      nextId = bill.identifier + 1;
    }
    const sizeArrayProductId = postPurchaseRequestDto.product_id.length;

    if (sizeArrayProductId === 0) {
      return {
        status: false,
        message: `Não há nenhum produto nesta solicitação`,
      };
    }

    const data = {
      identifier: nextId,
      reason: postPurchaseRequestDto.reason,
      status_id: '',
      active: postPurchaseRequestDto.active,
      comment: postPurchaseRequestDto.comment,
      company_id: postPurchaseRequestDto.company_id,
      created_at: new Date(),
      created_by: req.user.id,
    };

    const userCreateReq = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    try {
      const { id: status_id, name: status_name } =
        await this.prisma.status.findFirst({
          where: { name: EStatus.waiting },
        });

      data.status_id = status_id;

      const result = await this.prisma.purchaseRequest.create({ data });

      for (let i = 0; i < sizeArrayProductId; i++) {
        try {
          await this.prisma.purchaseRequestProduct.create({
            data: {
              product_id: postPurchaseRequestDto.product_id[i],
              purchaserequest_id: result.id,
            },
          });
        } catch (ex) {
          await this.prisma.purchaseRequest.delete({
            where: {
              id: result.id,
            },
          });
        }
      }

      if (process.env.NODE_ENV === 'production') {
        const managerGroups = await this.prisma.group.findMany({
          where: {
            type: EGroupType.manager,
          },
        });

        if (managerGroups.length > 0) {
          for (let g = 0; g < managerGroups.length; g++) {
            const userGestor = await this.prisma.user.findFirst({
              where: {
                group_id: managerGroups[g].id,
                company_id: userCreateReq.company_id,
              },
            });

            if (userGestor) {
              await this.sendEmail(
                userGestor.email,
                process.env.FROM_EMAIL,
                `Nova Solicitação de compra para aprovação (${status_name})`,
                `Olá ${userGestor.name}, há uma nova solicitação de compra criada pelo(a) ${userCreateReq.name}, aguardando aprovação. Para visualizar acesse: https://sistema.rta.eng.br`,
                `<strong>Olá ${userGestor.name}, há uma nova solicitação de compra criada pelo(a) ${userCreateReq.name}, aguardando aprovação. Para visualizar acesse: https://sistema.rta.eng.br</strong><br><br><br><br>
                Obs: Favor não responder este e-mail`,
              );
            }
          }
        }
      }

      return {
        status: true,
        message: `A Solicitação de compra foi criada com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível criar uma nova solicitação`,
        warning: ex.message,
      };
    }
  }

  async update(
    id: string,
    putPurchaseRequestDto: PutPurchaseRequestDto,
    @Req() req: any,
  ) {
    const sizeArrayProductId = putPurchaseRequestDto.product_id.length;

    if (sizeArrayProductId === 0) {
      return {
        status: false,
        message: `Não há nenhum produto selecionado, escolha ao menos um produto`,
      };
    }

    const { Status } = await this.prisma.purchaseRequest.findUnique({
      where: {
        id,
      },
      include: {
        Status: {
          select: {
            name: true,
          },
        },
      },
    });

    if (Status.name === EStatus.approvedDiretor) {
      return {
        status: false,
        message: `A solicitação encontra-se aprovada, não sendo possível realizar alteração`,
      };
    }

    const data = {
      id,
      reason: putPurchaseRequestDto.reason,
      comment: putPurchaseRequestDto.comment,
      statud_id: putPurchaseRequestDto.status_id,
      company_id: putPurchaseRequestDto.company_id,
      updated_by: req.user.id,
      updated_at: new Date(),
    };

    try {
      await this.prisma.purchaseRequest.update({
        where: { id },
        data,
      });

      try {
        const { has_budget } = await this.prisma.purchaseRequest.findFirst({
          where: {
            id,
          },
        });

        if (has_budget === true) {
          return {
            status: false,
            message:
              'O produto não pode ser excluído, pois já existe orçamento lançado para esta ordem.',
          };
        }

        await this.prisma.purchaseRequestProduct.deleteMany({
          where: {
            purchaserequest_id: id,
          },
        });

        for (let i = 0; i < sizeArrayProductId; i++) {
          await this.prisma.purchaseRequestProduct.create({
            data: {
              product_id: putPurchaseRequestDto.product_id[i],
              purchaserequest_id: id,
            },
          });
        }
      } catch (ex) {
        return {
          status: false,
          message: `Não foi possível realizar a alteração`,
          error: ex.message,
        };
      }

      return {
        status: true,
        message: `A solicitação de compra foi alterada com sucesso`,
      };
    } catch (ex) {
      return {
        status: false,
        message: `Não foi possível realizar a alteração`,
        error: ex.message,
      };
    }
  }

  async approveGestor(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        group: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    if (user.group.type === EGroupType.administrator) {
      return {
        status: false,
        message: `Você não tem permissão para realizar essa ação`,
      };
    }

    const { Status } = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // const statusPurchaseRequest = await this.prisma.status.findFirst({
    //   where: { id: purchaseRequest.status_id },
    // });

    if (Status.name === EStatus.approvedDiretor) {
      return {
        status: false,
        message: `A solicitação encontra-se aprovada, não sendo possível realizar alteração`,
      };
    }

    if (user.group.type === EGroupType.manager) {
      const statusApproved = await this.prisma.status.findFirst({
        where: {
          name: EStatus.approvedGestor,
        },
      });

      const update = {
        where: { id },
        data: {
          status_id: statusApproved.id,
          comment: patchPurchaseRequestDto.comment,
          approvedgestor_at: new Date(),
          approvedgestor_by: req.user.id,
          is_approved_gestor: true,
        },
      };

      await this.prisma.purchaseRequest.update(update);

      if (process.env.NODE_ENV === 'production') {
        const status = await this.prisma.status.findFirst({
          where: {
            id: update.data.status_id,
          },
        });

        const diretorGroup = await this.prisma.group.findFirst({
          where: {
            type: EGroupType.director,
          },
        });

        const userDiretor = await this.prisma.user.findFirst({
          where: {
            group_id: diretorGroup.id,
          },
        });

        if (status.name === EStatus.approvedGestor) {
          const gestor = await this.prisma.user.findFirst({
            where: {
              id: req.user.id,
            },
          });

          await this.sendEmail(
            userDiretor.email,
            process.env.FROM_EMAIL,
            `Nova Solicitação de compra para aprovação (${status.name})`,
            `Olá ${userDiretor.name}, há uma nova solicitação de compra aprovada pelo(a) ${gestor.name}, aguardando aprovação do diretor. Para visualizar acesse: https://sistema.rta.eng.br`,
            `<strong>Olá ${userDiretor.name}, há uma nova solicitação de compra aprovada pelo(a) ${gestor.name}, aguardando aprovação do diretor. Para visualizar acesse: https://sistema.rta.eng.br</strong><br><br><br><br>
            Obs: Favor não responder este e-mail`,
          );
        }
      }

      return {
        status: true,
        message: `A solicitação de compra foi aprovada pelo Gestor, necessitando da aprovação do Diretor.`,
      };
    }
  }

  async approveDiretor(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        group: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    if (user.group.type !== EGroupType.director) {
      return {
        status: false,
        message: `Você não tem permissão para realizar essa ação`,
      };
    }

    const purchaseRequest = await this.prisma.purchaseRequest.findUnique({
      where: {
        id,
      },
    });

    if (
      purchaseRequest.is_approved_gestor === false ||
      purchaseRequest.is_approved_gestor === null
    ) {
      return {
        status: false,
        message: `A solicitação não foi aprovada pelo gestor.`,
      };
    }

    if (purchaseRequest.is_approved_gestor === true) {
      const statusApprovedDirector = await this.prisma.status.findFirst({
        where: {
          name: EStatus.approvedDiretor,
        },
      });

      const update = {
        where: { id },
        data: {
          status_id: statusApprovedDirector.id,
          comment: patchPurchaseRequestDto.comment,
          approveddiretor_at: new Date(),
          approveddiretor_by: req.user.id,
          is_approved_diretor: true,
        },
      };

      await this.prisma.purchaseRequest.update(update);

      if (process.env.NODE_ENV === 'production') {
        const administrativoGroup = await this.prisma.group.findFirst({
          where: {
            type: EGroupType.administrator,
          },
        });

        if (administrativoGroup) {
          const userAdministrativo = await this.prisma.user.findFirst({
            where: {
              group_id: administrativoGroup.id,
              company_id: purchaseRequest.company_id,
            },
          });

          await this.sendEmail(
            userAdministrativo.email,
            process.env.FROM_EMAIL,
            `Nova Solicitação de compra para aprovação (${statusApprovedDirector.name})`,
            `Olá ${userAdministrativo.name}, há uma nova solicitação de compra aprovada pelo(a) ${user.name}, aprovada com sucesso. Para visualizar acesse: https://sistema.rta.eng.br`,
            `<strong>Olá ${userAdministrativo.name}, há uma nova solicitação de compra aprovada pelo(a) ${user.name}, aprovada com sucesso. Para visualizar acesse: https://sistema.rta.eng.br</strong><br><br><br><br>
                Obs: Favor não responder este e-mail`,
          );
          // await this.prisma.purchaseRequest.update(update);
        }
      }

      const findBudgets = await this.prisma.purchaseRequestBudget.findMany({
        where: {
          purchaserequest_id: id,
          to_be_approved: true,
        },
        include: {
          Product: {
            select: {
              name: true,
            },
          },
        },
      });

      const comprasPorFornecedor = new Map();

      for (const compra of findBudgets) {
        const {
          supplier_id,
          product_id,
          Product,
          to_be_approved,
          budget,
          shipping_fee,
          quantity,
        } = compra;

        if (!comprasPorFornecedor.has(supplier_id)) {
          comprasPorFornecedor.set(supplier_id, {
            fornecedor: supplier_id,
            produtosAprovados: [],
            produtosData: [], // Array para armazenar dados de produtos
            totalValue: 0,
          });
        }

        if (to_be_approved === true) {
          const fornecedorData = comprasPorFornecedor.get(supplier_id);
          fornecedorData.produtosAprovados.push(product_id);

          fornecedorData.produtosData.push({
            nomeProduto: Product.name,
            product_id,
            budget,
            quantity,
            shipping_fee,
          });

          fornecedorData.totalValue += budget * quantity + shipping_fee;
        }
      }

      for (const compra of comprasPorFornecedor.values()) {
        const { fornecedor, produtosData, totalValue } = compra;

        let nomeProduto = '';

        if (produtosData.length > 0) {
          for (let i = 0; i < produtosData.length; i++) {
            if (i < 1) {
              nomeProduto = produtosData[i].nomeProduto.trim();
            } else {
              nomeProduto =
                nomeProduto + '/' + produtosData[i].nomeProduto.trim();
            }
          }
        }

        const order = await this.prisma.purchaseOrder.create({
          data: {
            supplier_id: fornecedor,
            purchaserequest_id: purchaseRequest.id,
          },
        });

        const data = await this.prisma.billToPay.create({
          data: {
            name: nomeProduto,
            type: 'SC',
            supplier_id: fornecedor,
            price_approved: totalValue,
            price_updated: totalValue,
            created_by: req.user.id,
            bill_status: 'A',
            payment_info: '',
            comment: '',
            invoice_attachment: '',
            dda: false,
            company_id: purchaseRequest.company_id,
            purchaserequest_identifier: purchaseRequest.identifier,
          },
        });

        if (data.identifier) {
          await this.prisma.purchaseOrder.update({
            where: {
              id: order.id,
            },
            data: {
              billtopay_id: data.identifier,
            },
          });
        }

        for (const produtoData of produtosData) {
          await this.prisma.purchaseOrderProduct.create({
            data: {
              quantity: produtoData.quantity,
              price: produtoData.budget,
              shipping_fee: produtoData.shipping_fee,
              purchaseorder_id: order.id,
              product_id: produtoData.product_id,
            },
          });

          await this.prisma.productPrice.create({
            data: {
              product_id: produtoData.product_id,
              price: produtoData.budget,
              created_by: req.user.id,
            },
          });
        }
      }

      return {
        status: true,
        message: `A solicitação de compra foi aprovada com sucesso. Acesse contas a pagar para terminar de editar a nova conta criada.`,
      };
    }
  }

  async reject(
    id: string,
    patchPurchaseRequestDto: PatchPurchaseRequestDto,
    @Req() req: any,
  ) {
    const statusRejected = await this.prisma.status.findFirst({
      where: {
        name: {
          equals: EStatus.reject,
        },
      },
    });
    const update = {
      where: { id },
      data: {
        status_id: statusRejected.id,
        comment: patchPurchaseRequestDto.comment,
        rejected_by: req.user.id,
        rejected_at: new Date(),
      },
    };

    const purchaseRequest = await this.prisma.purchaseRequest.findUnique({
      where: {
        id,
      },
    });

    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    const status = await this.prisma.status.findFirst({
      where: { name: update.data.status_id },
    });

    await this.prisma.purchaseRequest.update(update);

    if (status.name === EStatus.reject) {
      if (process.env.NODE_ENV === 'production') {
        const administrativoGroup = await this.prisma.group.findFirst({
          where: {
            name: ERole.administrativo,
          },
        });

        const userAdministrativo = await this.prisma.user.findFirst({
          where: {
            group_id: administrativoGroup.id,
            company_id: purchaseRequest.company_id,
          },
        });

        await this.sendEmail(
          userAdministrativo.email,
          process.env.FROM_EMAIL,
          `Nova Solicitação de compra para aprovação (${status.name})`,
          `Olá ${userAdministrativo.name}, há uma nova solicitação de compra rejeitada pelo ${user.name}. Para visualizar acesse: https://sistema.rta.eng.br`,
          `<strong>Olá ${userAdministrativo.name}, há uma nova solicitação de compra rejeitada pelo ${user.name}. Para visualizar acesse: https://sistema.rta.eng.br</strong><br><br><br><br>
          Obs: Favor não responder este e-mail`,
        );
      }
    }

    return {
      status: true,
      message: `A solicitação de compra, foi rejeitada com sucesso.`,
    };
  }

  async deactivate(id: string, @Req() req: any) {
    const deactivate = {
      where: { id },
      data: {
        active: false,
        deleted_by: req.user.id,
        deleted_at: new Date(),
      },
    };

    const purchaseRequest = await this.prisma.purchaseRequest.findUnique({
      where: { id },
    });

    const statusApproved = await this.prisma.status.findFirst({
      where: { id: purchaseRequest.status_id },
    });

    if (statusApproved.name === EStatus.approvedDiretor) {
      return {
        status: false,
        message: `A solicitação de compra já se encontra aprovada, não sendo possível realizar alteração`,
      };
    }

    await this.prisma.purchaseRequest.update(deactivate);

    return {
      status: true,
      message: `O pedido de compra foi desativada com sucesso.`,
    };
  }

  async filtered(filterDto: GetPurchaseRequestFilterDto) {
    const { id, initial_date, final_date, created_by, company_id } = filterDto;
    let purchases = await this.prisma.purchaseRequest.findMany({
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (id) {
      purchases = purchases.filter((purchase) => purchase.id === id);
    }
    if (created_by) {
      purchases = purchases.filter(
        (purchase) => purchase.created_by === created_by,
      );
    }
    if (initial_date && final_date) {
      purchases = purchases.filter(
        (purchase) =>
          purchase.created_at.toISOString <= initial_date.toISOString &&
          purchase.created_at.toISOString >= final_date.toISOString,
      );
    }
    if (company_id) {
      purchases = purchases.filter(
        (purchase) => purchase.company_id === company_id,
      );
    }

    return purchases;
  }

  async findAll(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const group = await this.prisma.group.findUnique({
      where: {
        id: user.group_id,
      },
    });

    const whereClause =
      group.type === EGroupType.director
        ? { active: true }
        : { company_id: user.company_id, active: true };

    return await this.prisma.purchaseRequest.findMany({
      where: whereClause,
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
        Company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            ie: true,
            active: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const purchase: any = await this.prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
        Company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            ie: true,
            active: true,
          },
        },
      },
    });

    const purchaseProduct = await this.prisma.purchaseRequestProduct.findMany({
      where: {
        purchaserequest_id: purchase.id,
      },
    });

    const products = [];

    for (let i = 0; i < purchaseProduct.length; i++) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: purchaseProduct[i].product_id,
        },
      });
      products.push(product);
    }

    purchase.products = products;

    return purchase;
  }

  async findPagination(page = 1, active = true, statusName = '') {
    const status = await this.prisma.status.findFirst({
      where: {
        name: statusName,
      },
      select: {
        id: true,
      },
    });

    if (statusName === 'TODOS') {
      status.id = null;
    }

    let where = {};

    if (!status.id) {
      where = {
        active,
      };
    } else {
      where = {
        active,
        status_id: status.id,
      };
    }

    const purchaseRequest = await this.prisma.purchaseRequest.findMany({
      take: 9,
      skip: 9 * (page - 1),
      orderBy: {
        identifier: 'desc',
      },
      where,
      include: {
        Status: {
          select: {
            id: true,
            name: true,
          },
        },
        Company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            ie: true,
            active: true,
          },
        },
      },
    });

    return purchaseRequest;
  }

  async rowCount(active = true, name: string) {
    const status = await this.prisma.status.findFirst({
      where: { name },
      select: {
        id: true,
      },
    });

    if (name === 'TODOS') {
      status.id = null;
    }

    let where = {};

    if (!status.id) {
      where = {
        active,
      };
    } else {
      where = {
        active,
        status_id: status.id,
      };
    }

    return await this.prisma.purchaseRequest.count({
      where: { active, status_id: status.id },
    });
  }

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
  ) {
    await this.sendGrid.send({
      to,
      from,
      subject,
      text,
      html,
    });
  }
}
