import { states } from './states';
import { cities } from './cities';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const state of states) {
    await prisma.state.create({
      data: state,
    });
  }

  for (const city of cities) {
    await prisma.city.create({
      data: city,
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
