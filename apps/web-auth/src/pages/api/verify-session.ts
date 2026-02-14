import type { APIRoute } from 'astro';
import * as jose from 'jose';
import { PrismaClient } from '@japi/database';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'auth-service-secret-key');

export const GET: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('japi_token')?.value;

  const origin = request.headers.get('origin') || '*';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
  };

  console.log(`[VerifySession] Call from ${origin}. Token present: ${!!token}`);

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401, headers });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    // VERIFICACIÓN CON BASE DE DATOS: El usuario debe existir
    const user = await prisma.user.findUnique({
      where: { id: (payload.sub || payload.id) as string }
    });

    if (!user) {
      return new Response(JSON.stringify({ authenticated: false, message: 'User deleted' }), { status: 401, headers });
    }

    return new Response(JSON.stringify({ authenticated: true, user: { email: user.email } }), { status: 200, headers });
  } catch (_e) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401, headers });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
};
