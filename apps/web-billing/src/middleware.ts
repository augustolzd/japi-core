import { defineMiddleware } from 'astro:middleware';
import { PrismaClient } from '@japi/database';
import * as jose from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'auth-service-secret-key');

export const onRequest = defineMiddleware(async (context, next) => {
  // Ignorar rutas de API si es necesario, o protegerlas también
  // En este caso, protegemos TODO el portal de billing
  
  const url = new URL(context.url);
  const tokenFromUrl = url.searchParams.get('token');
  let token = context.cookies.get('japi_token')?.value;

  // SSO Handshake: Capturar el token de la URL si viene del portal de Auth
  if (tokenFromUrl) {
    context.cookies.set('japi_token', tokenFromUrl, { 
      path: '/', 
      maxAge: 86400,
      secure: false, // Cambiar a true en producción
      sameSite: 'lax'
    });
    token = tokenFromUrl;
    
    // Limpiar la URL para que el token no sea visible/compartible
    url.searchParams.delete('token');
    return context.redirect(url.pathname + url.search);
  }

  const returnTo = encodeURIComponent(url.toString());
  const loginUrl = `http://localhost:4323/login?returnTo=${returnTo}`;

  // 1. Verificación básica de presencia
  if (!token) {
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return context.redirect(loginUrl);
  }

  try {
    // 2. Verificación de firma JWT
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    // 3. Verificación de existencia en Base de Datos
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub as string || payload.id as string }
    });

    if (!dbUser) {
      context.cookies.delete('japi_token', { path: '/' });
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ message: 'User not found in DB' }), { status: 401 });
      }
      return context.redirect(loginUrl);
    }

    // Guardar usuario en locals para uso en páginas
    context.locals.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role
    };

    // 4. Forzar headers anti-cache en todas las respuestas
    const response = await next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err) {
    context.cookies.delete('japi_token', { path: '/' });
    return context.redirect(loginUrl);
  }
});
