import { states } from './seeds/states';
import { cities } from './seeds/cities';
import { PrismaClient } from '@prisma/client';
import { users } from './seeds/users';
import { groups } from './seeds/groups';
import { roles } from './seeds/roles';
import { rolesgroups } from './seeds/rolesgroups';

const prisma = new PrismaClient();

async function main() {
  // for (const state of states) {
  //   await prisma.state.create({
  //     data: state,
  //   });
  // }

  // for (const city of cities) {
  //   await prisma.city.create({
  //     data: city,
  //   });
  // }

  // for (const group of groups) {
  //   await prisma.group.create({
  //     data: group,
  //   });
  // }

  // for (const role of roles) {
  //   await prisma.role.create({
  //     data: role,
  //   });
  // }

  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user,
  //   });
  // }

  for (const rolesgroup of rolesgroups) {
    await prisma.rolesGroup.create({
      data: rolesgroup,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
