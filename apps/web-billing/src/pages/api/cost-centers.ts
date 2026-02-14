import type { APIRoute } from 'astro';
import { PrismaClient } from '@japi/database';

const prisma = new PrismaClient();

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, initialBalance, organizationId } = data;

    if (!name || organizationId === undefined) {
      return new Response(JSON.stringify({ message: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const cc = await prisma.costCenter.create({
      data: {
        name,
        balance: BigInt(Math.round(parseFloat(initialBalance) * 10000000)), // Convert to micro-units
        organizationId,
      },
    });

    // Convert BigInt to string for JSON serialization
    const responseData = {
      ...cc,
      balance: cc.balance.toString()
    };

    return new Response(JSON.stringify(responseData), { status: 201 });
  } catch (error: any) {
    console.error('Error creating cost center:', error);
    return new Response(JSON.stringify({ message: error.message || 'Error interno' }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true }
  });
  return new Response(JSON.stringify(organizations), { status: 200 });
};
