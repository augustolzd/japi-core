# Skill: Automatización de Segmentación por Esquemas (PostgreSQL Schemas)

## 1. Filosofía de Segmentación
Para reducir la complejidad operativa y mantener la integridad referencial en Japi Core, se utiliza una sola base de datos física dividida en esquemas lógicos basados en el contexto del microservicio.

## 2. Definición de Contextos (Esquemas)
El agente debe asignar cada nueva tabla a uno de los siguientes esquemas obligatorios:

* **`iam`**: Identidad, Organizaciones, Usuarios y Permisos. (Contexto: Control de Acceso).
* **`billing`**: Centros de Costos, Balances, Tarifas y Facturación. (Contexto: Finanzas 10^-7).
* **`traffic`**: Logs de SMS, WhatsApp, RCS y eventos masivos. (Contexto: Alta Volumetría).
* **`config`**: Parámetros de Binds, rutas de carriers y configuraciones globales.



## 3. Automatización en Prisma (multiSchema)
Al generar o modificar el archivo `schema.prisma`, el agente debe incluir la vista previa de múltiples esquemas y mapear cada modelo correctamente:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["iam", "billing", "traffic", "config"]
}

model Organization {
  id    String @id @default(uuid())
  name  String
  @@map("organizations")
  @@schema("iam") // Automatización por contexto
}

model CostCenter {
  id      String @id @default(uuid())
  balance BigInt
  @@map("cost_centers")
  @@schema("billing") // Automatización por contexto
}