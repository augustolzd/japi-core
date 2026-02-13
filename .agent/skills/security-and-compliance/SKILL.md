# Skill: Seguridad Defensiva y OWASP Top 10 (Japi Core)

## 1. Prevención de Inyección (SQL, NoSQL, Command)
Japi Core utiliza **Prisma ORM**, lo que previene por defecto la mayoría de las inyecciones SQL al usar consultas parametrizadas.

* **Regla de Oro:** Prohibido el uso de `prisma.$queryRawUnsafe` o concatenación de strings en queries.
* **Validación de Entrada:** Todo dato externo (body, query, params) DEBE ser validado con **Valibot** antes de tocar cualquier lógica de negocio o base de datos.
* **Sanitización:** Utilizar funciones de escape para cualquier dato que se renderice en el dashboard de Astro para evitar XSS.



## 2. Broken Access Control (A01:2021)
* **Principio de Menor Privilegio:** Cada API Key en `japi-core` debe tener un `scope` limitado (ej: `sms:send`, `billing:read`).
* **Validación de Propiedad:** En cada petición al `admin-dashboard`, el middleware debe verificar que el `costCenterId` solicitado pertenezca a la `companyId` de la sesión activa.

## 3. Cryptographic Failures (A02:2021)
* **Tránsito:** Forzar TLS 1.3 en todas las comunicaciones entre servicios y hacia el exterior.
* **Repositorio:** Las API Keys y secretos de Carriers en la DB deben estar cifrados en reposo (AES-256).
* **Hashing:** Usar `Argon2id` (vía Bun.password) para cualquier contraseña de usuario en los portales web.

## 4. Seguridad en Hono (Middlewares)
Cada servicio de API debe implementar los siguientes middlewares de seguridad de forma mandatoria:

```typescript
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

app.use('*', secureHeaders()); // HSTS, CSP, X-Frame-Options
app.use('*', csrf());          // Protección contra Cross-Site Request Forgery
app.use('/api/*', cors({
  origin: ['[https://admin.japi.com](https://admin.japi.com)'],
  allowMethods: ['GET', 'POST'],
}));