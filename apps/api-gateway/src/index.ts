import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono();

// Middlewares mandatorios según Skills
app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: ['https://admin.japi.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

export default {
  port: Number(Bun.env.PORT) || 3000,
  fetch: app.fetch,
};
