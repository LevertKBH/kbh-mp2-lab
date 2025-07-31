// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = new PrismaClient();

async function main() {
  const now = new Date();
  const password = 'testpassword!';
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      emailVerified: true,
      role: 'admin',
      updatedAt: now,
    },
    create: {
      id: randomUUID(),
      email: 'admin@example.com',
      name: 'Admin',
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
      role: 'admin',
      accounts: {
        create: {
          id: randomUUID(),
          providerId: 'credentials',
          accountId: 'admin@example.com',
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
  });

  console.log(`Seeded user admin@example.com with password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
