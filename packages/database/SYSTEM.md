# System: Database & Persistence Layer

## Domain Logic
* **Precision:** Uso de `BigInt` para saldos para evitar errores de coma flotante en moneda.
* **Audit System:** Middleware o patrones de capa de repositorio que graban en `AuditLog` automáticamente tras mutaciones.
* **IAM Model:** Basado en acciones (`sms:send`) vinculadas a recursos (`cost_center:id`).

## System Capabilities
* **ORM:** Prisma Client para tipado estricto en el acceso a datos.
* **Database:** PostgreSQL.

## Data Flow
* Los microservicios importan `@japi/database` para interactuar con la DB.
* Los logs de auditoría se indexan por `entityName` y `entityId` para búsquedas rápidas.

## Security & IAM
* **Row Level Protection:** Las consultas deben estar filtradas por el contexto de `companyId` o `costCenterId` del usuario.

## Error Handling
* Manejo de errores de unicidad (P2002) en Prisma para campos críticos como Emails.
