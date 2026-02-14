import { PrismaClient } from '@japi/database';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a Default Service Provider
  const sp = await prisma.serviceProvider.upsert({
    where: { taxId: 'JAP010101AA1' },
    update: {},
    create: {
      name: 'Japifon S.A. de C.V.',
      taxId: 'JAP010101AA1',
    },
  });
  console.log('Created Service Provider:', sp.name);

  // 2. Create an Organization
  const org = await prisma.organization.upsert({
    where: { taxId: 'ORG010101BB2' },
    update: {},
    create: {
      name: 'Cliente Corporativo Demo',
      taxId: 'ORG010101BB2',
      serviceProviderId: sp.id,
    },
  });
  console.log('Created Organization:', org.name);

  // 3. Create a Cost Center
  const cc = await prisma.costCenter.create({
    data: {
      name: 'Marketing Dept - CDMX',
      balance: BigInt(5000000000), // 500.0000000 (assuming 10^-7)
      organizationId: org.id,
    },
  });
  console.log('Created Cost Center:', cc.name);

  // 4. Create or Update a Root User
  const adminEmail = 'admin@japi.im';
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'japi_admin' },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'Japi',
      role: 'japi_admin',
    },
  });

  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: org.id,
      },
    },
    update: { role: 'org_admin' },
    create: {
      userId: user.id,
      organizationId: org.id,
      role: 'org_admin',
    },
  });
  console.log('Admin user ready:', adminEmail);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
