import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/playermaster"
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@playermaster.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-local-only";
  const name = process.env.SEED_ADMIN_NAME ?? "Local Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
      isActive: true
    },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true
    }
  });

  console.log(`Seeded local admin: ${email}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
