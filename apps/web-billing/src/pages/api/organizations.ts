import type { APIRoute } from 'astro';
import { PrismaClient } from '@japi/database';

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, taxId, serviceProviderId } = data;

    if (!name || !taxId || !serviceProviderId) {
      return new Response(JSON.stringify({ message: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const org = await prisma.organization.create({
      data: {
        name,
        taxId,
        serviceProviderId,
      },
    });

    return new Response(JSON.stringify(org), { status: 201 });
  } catch (error: any) {
    console.error('Error creating organization:', error);
    return new Response(JSON.stringify({ message: error.message || 'Error interno' }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  const providers = await prisma.serviceProvider.findMany({
    select: { id: true, name: true }
  });
  return new Response(JSON.stringify(providers), { status: 200 });
};
