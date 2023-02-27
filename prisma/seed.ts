import { states } from './seeds/states';
import { cities } from './seeds/cities';
import { PrismaClient } from '@prisma/client';
import { users } from './seeds/users';
import { groups } from './seeds/groups';
import { roles } from './seeds/roles';
import { rolesgroups } from './seeds/rolesgroups';
import { suppliers } from './seeds/suppliers';

const prisma = new PrismaClient();

async function main() {
  // for (const supplier of suppliers) {
  //   await prisma.supplier.upsert({
  //     where: { id: supplier.id },
  //     update: {
  //       name: supplier.name.toUpperCase(),
  //     },
  //     create: {
  //       id: supplier.id,
  //       name: supplier.name.toUpperCase(),
  //       cnpj: supplier.cnpj,
  //       telephone: supplier.telephone,
  //       address: supplier.address,
  //       number: supplier.number,
  //       district: supplier.district,
  //       complement: supplier.complement,
  //       agency: supplier.agency,
  //       bank: supplier.bank,
  //       account: supplier.account,
  //       account_type: supplier.account_type,
  //       operation: supplier.operation,
  //       company_id: supplier.company_id,
  //     },
  //   });
  // }
  // for (const state of states) {
  //   await prisma.state.upsert({
  //     where: { id: state.id },
  //     update: {
  //       initials: state.initials.toUpperCase(),
  //       name: state.name.toUpperCase(),
  //     },
  //     create: {
  //       id: state.id,
  //       initials: state.initials.toUpperCase(),
  //       name: state.name.toUpperCase(),
  //       active: state.active,
  //     },
  //   });
  // }
  // for (const city of cities) {
  //   await prisma.city.upsert({
  //     where: { id: city.id },
  //     update: {
  //       id: city.id,
  //       state_id: city.state_id,
  //       name: city.name.toUpperCase(),
  //       active: city.active,
  //     },
  //     create: {
  //       id: city.id,
  //       state_id: city.state_id,
  //       name: city.name.toUpperCase(),
  //       active: city.active,
  //     },
  //   });
  // }
  // for (const group of groups) {
  //   await prisma.group.upsert({
  //     where: { id: group.id },
  //     update: {
  //       name: group.name.toUpperCase(),
  //     },
  //     create: {
  //       id: group.id,
  //       name: group.name.toUpperCase(),
  //       active: group.active,
  //       created_at: group.created_at,
  //       description: group.description,
  //     },
  //   });
  // }
  // for (const role of roles) {
  //   await prisma.role.upsert({
  //     where: { id: role.id },
  //     update: {
  //       name: role.name.toUpperCase(),
  //     },
  //     create: {
  //       id: role.id,
  //       name: role.name.toUpperCase(),
  //       active: role.active,
  //       created_at: role.created_at,
  //       action: role.action,
  //       module: role.module,
  //       type: role.type,
  //     },
  //   });
  // }
  //   for (const user of users) {
  //     await prisma.user.upsert({
  //       data: user,
  //     });
  //   }
  //   for (const rolesgroup of rolesgroups) {
  //     await prisma.rolesGroup.upsert({
  //       data: rolesgroup,
  //     });
  //   }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
