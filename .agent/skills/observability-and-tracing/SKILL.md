# Skill: Observabilidad y Trazabilidad Distribuida (Japi Core)

## 1. El Concepto de Correlation ID (X-Correlation-ID)
Cada petición que entra a Japi Core (vía HTTP o Evento) debe generar o heredar un `correlationId` único (UUID v4). Este ID debe viajar en:
* **Headers de HTTP:** `X-Correlation-ID`.
* **Metadata de Kafka:** En los headers del mensaje.
* **Logs:** Cada línea de log debe incluir este ID.


## 2. Logging Estructurado con Biome y Bun
Prohibido usar `console.log` plano. Se debe utilizar un logger estructurado (como `pino` o un helper propio en `shared-utils`) que genere archivos en formato JSON.

* **Campos Obligatorios:** `timestamp`, `level`, `serviceName`, `correlationId`, `message`.
* **Campos Contextuales:** `costCenterId`, `transactionId`, `carrierId`.

## 3. Monitoreo de Salud (Health Checks)
Cada servicio en `/apps` debe exponer un endpoint de salud en Hono:
* `GET /health`: Debe retornar el estado del servicio y sus conexiones (DB, Redis, Kafka).
* **Métrica de Latencia:** El Gateway SMS debe loguear el tiempo transcurrido desde que recibe el mensaje hasta que el Carrier confirma el envío (End-to-End Latency).

## 4. Alertas de Negocio (Business Events)
El agente debe proponer logs específicos para eventos críticos que no son errores de código pero sí de negocio:
* `BALANCE_EXHAUSTED`: Cuando un cliente intenta enviar sin saldo.
* `CARRIER_TIMEOUT`: Cuando un carrier no responde en el tiempo pactado.
* `RATE_LIMIT_REACHED`: Cuando un cliente excede su cuota de TPS (Transacciones por Segundo).

## 5. Reglas para el Agente
1. **Trace Everywhere:** Al crear un nuevo servicio o consumidor de Kafka, el primer paso es asegurar que el `correlationId` se propague.
2. **Error Handling:** Cada bloque `catch` debe loguear el stack trace completo y los datos contextuales que causaron el fallo, siempre incluyendo el `transactionId` si está disponible.
3. **Métricas en Astro:** El Dashboard debe loguear errores de hidratación o fallos en las llamadas al API de Hono para monitorear la experiencia del usuario (Frontend Observability).