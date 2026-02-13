# Skill: Estándar de Validación de Datos (Valibot)

## 1. Filosofía de Validación
Japi Core utiliza [Valibot](https://valibot.dev/) para todas las validaciones de esquema (Runtime Validation). Se prefiere Valibot sobre Zod por su capacidad de tree-shaking y ligereza en entornos de alto rendimiento como Bun y Astro.

## 2. Ubicación de Esquemas
* **Contratos Compartidos:** Los esquemas de eventos de Kafka y respuestas de API deben vivir en `packages/events-schema`.
* **Validación Local:** Los esquemas específicos de un formulario de Astro o un endpoint de Hono pueden vivir en la carpeta `lib/schemas` de la respectiva app.

## 3. Patrones de Uso en Hono (Backend)
Se debe utilizar el middleware oficial de Valibot para Hono para validar `json`, `query` y `param`.

```typescript
import { vValidator } from '@hono/valibot-validator';
import * as v from 'valibot';

const smsSchema = v.object({
  to: z.string([v.minLength(10)]),
  content: z.string([v.maxLength(160)]),
});

app.post('/send', vValidator('json', smsSchema), (c) => {
  const data = c.req.valid('json');
  return c.json({ success: true });
});