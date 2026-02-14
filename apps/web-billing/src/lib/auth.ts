import { PrismaClient } from '@japi/database';
import * as jose from 'jose';
import type { AstroCookies } from 'astro';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'auth-service-secret-key');

export async function protectPage(cookies: AstroCookies, returnTo: string) {
  const token = cookies.get('japi_token')?.value;

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    // Verificación profunda con BD
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub as string || payload.id as string }
    });

    if (!dbUser) {
      cookies.delete('japi_token', { path: '/' });
      throw new Error('UNAUTHORIZED');
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role
    };
  } catch (err) {
    throw new Error('UNAUTHORIZED');
  }
}
