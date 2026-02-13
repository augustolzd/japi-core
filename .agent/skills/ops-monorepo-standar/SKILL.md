# Skill: Estándar de Monorepo y Stack Tecnológico (Japi Core)

## 1. Identidad del Proyecto
* **Nombre del Proyecto:** Japi Core
* **Visión:** Motor central de infraestructura para Japifon (Carrier) y Japi Connect (Plataforma).
* **Guía de Estilo:** Código limpio, tipado estricto y alto rendimiento (Zero-Node).

## 2. Stack Tecnológico Mandatorio (Stack "Japi")
El agente NO debe sugerir herramientas fuera de esta lista:
* **Runtime:** [Bun](https://bun.sh/) (Gestión de paquetes, ejecución y tests).
* **Web Framework:** [Astro](https://astro.build/) (Modo SSR para Dashboards y Portales).
* **Backend Framework:** [Hono](https://hono.dev/) (APIs, Gateways y Middleware).
* **Linter & Formatter:** [Biome](https://biomejs.dev/) (Única herramienta de calidad de código).
* **Monorepo:** [Turborepo](https://turbo.build/).
* **ORM:** [Prisma](https://www.prisma.io/) con PostgreSQL.
* **Mensajería:** [Kafka](https://kafka.apache.org/) (Eventos masivos) y [Redis](https://redis.io/) (Caché de saldos y precios).

## 3. Estructura de Directorios (Japi Core)
El agente debe organizar cualquier propuesta de archivos bajo esta jerarquía:

```text
/japi-core
  ├── /apps
  │   ├── /api-gateway      # Hono (Punto de entrada SMS/RCS/Email)
  │   ├── /billing-engine   # Hono (Consumidor de Kafka y lógica de saldos)
  │   ├── /admin-dashboard  # Astro + React (Panel Interno Japifon)
  │   └── /connect-web      # Astro + React (Portal de Clientes Japi Connect)
  ├── /packages
  │   ├── /database         # Esquema de Prisma y Cliente compartido
  │   ├── /events-schema    # Definiciones Zod para eventos de Kafka
  │   ├── /ui-system        # Design System (Tailwind + Astro Islands)
  │   ├── /telecom-logic    # Lógica de Zonas 2-9 e inteligencia de rutas
  │   └── /shared-utils     # Helpers de moneda (BigInt) y loggers
  ├── biome.json            # Configuración de estilo unificada
  ├── turbo.json            # Pipelines de construcción
  └── bun.lockb             # Lockfile único de Bun