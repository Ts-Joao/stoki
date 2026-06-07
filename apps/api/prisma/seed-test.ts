import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { name: 'test' },
    update: {},
    create: {
      name: 'test',
      password: passwordHash,
      role: 'WAREHOUSE_STAFF',
    },
  });

  await prisma.user.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.category.upsert({
    where: { name: 'test' },
    update: {},
    create: {
      name: 'test',
    },
  });

  await prisma.location.upsert({
    where: { name: 'test' },
    update: {},
    create: {
      name: 'test',
    },
  });

  console.log('Seed concluído.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());