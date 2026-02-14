import { defineMiddleware } from 'astro:middleware';
import { PrismaClient } from '@japi/database';
import * as jose from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'auth-service-secret-key');

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.url);
  const tokenFromUrl = url.searchParams.get('token');
  let token = context.cookies.get('japi_token')?.value;

  // SSO Handshake
  if (tokenFromUrl) {
    context.cookies.set('japi_token', tokenFromUrl, { 
      path: '/', 
      maxAge: 86400,
      sameSite: 'lax'
    });
    token = tokenFromUrl;
    
    url.searchParams.delete('token');
    return context.redirect(url.pathname + url.search);
  }

  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub as string || payload.id as string }
      });

      if (dbUser) {
        context.locals.user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role
        };
      } else {
        context.cookies.delete('japi_token', { path: '/' });
      }
    } catch {
      context.cookies.delete('japi_token', { path: '/' });
    }
  }

  const response = await next();
  
  // Anti-Cache
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
});
