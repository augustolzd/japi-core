# Skill: Sistema de Auditoría e Inmutabilidad (Japi Core Audit)

## 1. Filosofía de Auditoría
Todo cambio en el estado de los recursos críticos (Precios, Saldo, Permisos, Rutas de Carriers) debe generar un registro de auditoría inmutable. Un log de auditoría nunca se borra ni se modifica.

## 2. Estructura del Audit Log
El agente debe proponer una tabla de auditoría en Prisma con la siguiente estructura mínima:

```prisma
model AuditLog {
  id            String   @id @default(uuid())
  entityName    String   // ej: "RateCard", "CostCenter"
  entityId      String   // El UUID del recurso afectado
  action        Action   // CREATE, UPDATE, DELETE
  oldValue      Json?    // Snapshot antes del cambio
  newValue      Json?    // Snapshot después del cambio
  userId        String?  // Quién realizó el cambio (o System para procesos auto)
  correlationId String   // ID para ligar con el skill de Observabilidad
  ipAddress     String?
  createdAt     DateTime @default(now())

  @@index([entityName, entityId])
}

enum Action {
  CREATE
  UPDATE
  DELETE
}