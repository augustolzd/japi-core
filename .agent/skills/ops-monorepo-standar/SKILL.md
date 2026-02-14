# Skill: Estándar de Monorepo y Operaciones de Infraestructura (Japi Core)

## 1. Identidad y Filosofía del Proyecto
* **Nombre:** Japi Core.
* **Misión:** Infraestructura carrier-grade para Japifon y Japi Connect.
* **Principios:** Tipado de Hierro, Clean Architecture, SOLID, DRY y Escritura para Humanos.

## 2. Stack Tecnológico Mandatorio (Stack "Japi")
* **Runtime:** Bun.
* **Web:** Astro (SSR) + React (Atomic Design).
* **Backend:** Hono (Ultra-high performance).
* **Linter/Formatter:** Biome (Sin excepciones).
* **Database:** PostgreSQL (Partitioned) + Prisma ORM.
* **Cache/Real-time:** Redis + Kafka.

## 3. Arquitectura de Base de Datos y Persistencia Masiva
Para soportar el tráfico de Japifon (>80M de registros mensuales por cliente), se aplican las siguientes reglas de infraestructura:

### A. Particionamiento Compuesto (Composite Partitioning)
Todo log de tráfico (SMS, RCS, etc.) debe seguir esta jerarquía física:
1. **Nivel 1 (Range):** Mensual por `created_at`. Facilita el borrado de datos viejos (Retention Policy).
2. **Nivel 2 (Hash):** Por `cost_center_id` en **4 buckets (sub-particiones)**. Garantiza que la carga de clientes masivos se distribuya y los índices quepan en RAM.

### B. Reglas de Consulta (Query Safety)
* **Poda de Particiones:** Está prohibido realizar queries a tablas particionadas sin filtrar por `created_at` (rango de tiempo) y `cost_center_id` simultáneamente.
* **No Table Scans:** El agente debe asegurar que cada consulta sea dirigida a una partición específica para evitar el escaneo de millones de registros.

### C. Automatización de Infraestructura
* **Gestión de Particiones:** El sistema debe contar con una tarea programada (Cron en Bun) que pre-cree automáticamente la partición del mes siguiente y sus 4 sub-particiones de Hash antes de que inicie el periodo.
* **Cold Storage:** Implementar lógica para mover particiones de más de 3 meses a Tablespaces de menor costo (SSD/HDD) o archivado en frío.

## 4. Estructura de Directorios del Monorepo
```text
/japi-core
  ├── /apps
  │   ├── /api-gateway      # Hono
  │   ├── /billing-engine   # Consumo Kafka + Aritmética 10^-7
  │   ├── /admin-dashboard  # Astro (Panel Interno)
  ├── /packages
  │   ├── /database         # Prisma + Lógica de Particionado
  │   ├── /events-schema    # Valibot Contracts
  │   ├── /ui-system        # React + CSS Puro (BEM)
  │   └── /shared-utils     # BigInt, Result Pattern, Logger
  ├── PRODUCT.md            # Visión comercial
  └── SYSTEM.md             # Capacidades técnicas