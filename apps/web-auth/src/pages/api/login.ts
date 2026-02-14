import type { APIRoute } from 'astro';
import { PrismaClient } from '@japi/database';
import * as v from 'valibot';
import { LoginSchema } from '@japi/events-schema';
import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auth-service-secret-key'
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = v.parse(LoginSchema, body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: result.email }
    });
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(result.password, user.passwordHash);
    
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate JWT
    const token = await new jose.SignJWT({ 
        sub: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return new Response(JSON.stringify({ 
      message: 'Login exitoso',
      token 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `japi_token=${token}; Path=/; SameSite=Lax; Max-Age=86400`
      }
    });
    
  } catch (err: unknown) {
    console.error('Login Error:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
