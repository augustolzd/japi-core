# Skill: IAM y Control de Acceso Granular (Japi Core)

## 1. Modelo de Identidad Jerárquico
Japi Core utiliza una estructura multi-tenant de tres niveles. El agente debe respetar esta jerarquía en cada consulta a la base de datos:
1. **Global Admin (Japifon):** Control total sobre carriers, rutas y todas las compañías.
2. **Company Admin:** Gestión de centros de costos, facturación y usuarios de su propia empresa.
3. **Service User:** Acceso limitado a `systemId` específicos o servicios (ej: solo ver reportes de SMS).

## 2. Definición de Permisos (Actions & Resources)
Se utiliza un sistema de permisos tipo AWS (`Action:Resource`).
* **Actions:** `read`, `write`, `delete`, `manage`.
* **Resources:** `sms`, `billing`, `api_keys`, `users`, `routes`.



## 3. Implementación de Roles y Permisos (Prisma)
El agente debe proponer el uso de una tabla de unión para permisos dinámicos, evitando "hardcodear" roles en el código.

```prisma
model Permission {
  id          String   @id @default(uuid())
  action      String   // ej: "sms:send"
  resource    String   // ej: "cost_center:uuid"
  effect      String   @default("allow") // allow o deny
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}