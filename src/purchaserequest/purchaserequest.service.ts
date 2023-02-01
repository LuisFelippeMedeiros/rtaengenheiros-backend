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
    const sizeArrayProductId = postPurchaseRequestDto.product_id.length;

    if (sizeArrayProductId === 0) {
      return {
        status: false,
        message: `Não há nenhum produto nesta solicitação`,
      };
    }

    const data = {
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
      const statusWaiting = await this.prisma.status.findFirst({
        where: { name: EStatus.waiting },
      });
      data.status_id = statusWaiting.id;

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
          console.log(ex);
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
                `Nova Solicitação de compra para aprovação (${statusWaiting.name})`,
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

    const purchaseRequestApproved =
      await this.prisma.purchaseRequest.findUnique({
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

    if (purchaseRequestApproved.Status.name === EStatus.approvedDiretor) {
      return {
        status: false,
        message: `Essa solicitação de compra se encontra com o status de APROVADA, não podendo ser alterada`,
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

    const purchaseRequest = await this.prisma.purchaseRequest.findUnique({
      where: { id },
    });

    const statusPurchaseRequest = await this.prisma.status.findFirst({
      where: { id: purchaseRequest.status_id },
    });

    if (statusPurchaseRequest.name === EStatus.approvedDiretor) {
      return {
        status: false,
        message: `A solicitação de compra já se encontra aprovada, não sendo possível realizar alteração`,
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
          is_approved_gestor: patchPurchaseRequestDto.is_approved,
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
        message: `A solicitação de compra foi aprovada pelo Gestor, agora precisa da aprovação do Diretor.`,
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
          is_approved_diretor: patchPurchaseRequestDto.is_approved,
        },
      };

      const diretor = await this.prisma.user.findUnique({
        where: {
          id: update.data.approveddiretor_by,
        },
      });

      const status = await this.prisma.status.findFirst({
        where: {
          name: update.data.status_id,
        },
      });

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
            `Nova Solicitação de compra para aprovação ()`,
            `Olá ${userAdministrativo.name}, há uma nova solicitação de compra aprovada pelo(a) ${diretor.name}, aprovada com sucesso. Para visualizar acesse: https://sistema.rta.eng.br`,
            `<strong>Olá ${userAdministrativo.name}, há uma nova solicitação de compra aprovada pelo(a) ${diretor.name}, aprovada com sucesso. Para visualizar acesse: https://sistema.rta.eng.br</strong><br><br><br><br>
                Obs: Favor não responder este e-mail`,
          );
          await this.prisma.purchaseRequest.update(update);
        }
      }

      const findBudget = await this.prisma.purchaseRequestBudget.findFirst({
        where: {
          id: req.query.id,
          to_be_approved: true,
        },
      });

      const productName = await this.prisma.purchaseRequestProduct.findMany({
        where: {
          id: req.query.id,
        },
        include: {
          Product: {
            select: {
              name: true,
            },
          },
        },
      });

      let nameNewBillToPay = '';

      if (productName.length > 0) {
        for (let i = 0; i < productName.length; i++) {
          if (i < 1) {
            nameNewBillToPay = productName[i].Product.name;
          } else {
            nameNewBillToPay =
              nameNewBillToPay + '/' + productName[i].Product.name;
          }
        }
      }

      const data = {
        name: nameNewBillToPay,
        type: 'SC',
        supplier_id: findBudget.supplier_id,
        price_approved: findBudget.budget,
        price_updated: findBudget.budget,
        created_by: req.user.id,
        bill_status: 'A',
        payment_info: '',
        comment: '',
        invoice_attachment: '',
        company_id: purchaseRequest.company_id,
      };

      await this.prisma.billToPay.create({ data });

      return {
        status: true,
        message: `A solicitação de compra, foi aprovado com sucesso. Acesse contas a pagar para terminar de editar a nova conta criada.`,
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
    const { id, initial_date, final_date, created_by } = filterDto;
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
    // if (company_id) {
    //   purchases = purchases.filter(
    //     (purchase) => purchase.company_id === company_id,
    //   );
    // }

    return purchases;
  }

  async findAll() {
    const purchaseRequests = await this.prisma.purchaseRequest.findMany({
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

    return purchaseRequests;
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

    const purchaseRequest = await this.prisma.purchaseRequest.findMany({
      take: 5,
      skip: 5 * (page - 1),
      where: {
        active,
        status_id: status.id,
      },
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
