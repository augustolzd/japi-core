# Japi Core Infrastructure

Este repositorio contiene el motor central de infraestructura para **Japifon**.

## Stack Tecnológico
* **Runtime:** [Bun](https://bun.sh/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) via Prisma
* **Cache/Real-time:** [Redis](https://redis.io/)
* **Messaging:** [Kafka](https://kafka.apache.org/)
* **Frameworks:** [Astro](https://astro.build/) (Web) & [Hono](https://hono.dev/) (API)

## Requisitos Previos
1. Instalación de [Bun](https://bun.sh/).
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine.

## Configuración de Desarrollo

### 1. Levantar Infraestructura (Docker)
Para iniciar la base de datos, Redis y Kafka en modo detached:
```bash
bun run infra:up
```

Para detener los servicios:
```bash
bun run infra:down
```

### 2. Servicios Disponibles
* **PostgreSQL:** `localhost:5432` (user/password/japi_core)
* **Redis:** `localhost:6379`
* **Kafka:** `localhost:9094` (External Listener)
* **Kafka UI:** `http://localhost:8080` (Para visualizar topics y mensajes)

### 3. Instalación de Dependencias
```bash
bun install
```

### 4. Base de Datos (Prisma)
Generar el cliente y aplicar migraciones:
```bash
cd packages/database
bunx prisma generate
bunx prisma db push
```

## Estructura del Monorepo
* `apps/api-gateway`: Punto de entrada Hono para tráfico Carrier.
* `apps/admin-dashboard`: Panel administrativo Astro + React.
* `apps/billing-engine`: Consumidor de Kafka para lógica de saldos.
* `packages/ui-system`: Sistema de diseño con CSS puro (Zero Tailwind).
* `packages/database`: Esquema único de datos y cliente Prisma.
* `packages/telecom-logic`: Inteligencia de rutas y zonas 2-9.
