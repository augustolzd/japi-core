# Skill: Jerarquía de Negocio y Aislamiento Multi-tenant (Japi Core)

## 1. El Modelo de Identidad Jerárquico
Toda operación, consulta a base de datos o lógica de billing debe respetar la jerarquía de tres niveles de Japi Core para asegurar el aislamiento total de datos.

### Nivel 1: El Proveedor (ServiceProvider)
Representa la firma legal del conglomerado que emite la factura y provee el servicio.
* **Entidades:** Japifon, Rocatell, Diginovtec.
* **Rol:** Actúan como administradores de infraestructura.

### Nivel 2: La Organización (Tenant/Cliente)
Es la entidad legal que firma el contrato con un Proveedor.
* **Aislamiento:** Un usuario puede pertenecer a múltiples organizaciones, pero los datos de una nunca deben mezclarse con otra.
* **Configuración:** Aquí se definen los datos fiscales (RFC) y el Proveedor asignado.

### Nivel 3: El Centro de Costos (Unidad Operativa)
Es el punto final de consumo y donde vive el dinero (**BigInt 10^-7**).
* **Segmentación:** Los logs masivos (80M/mes) se agrupan por `cost_center_id`.
* **Finanzas:** Cada Centro de Costos tiene su propio balance y límites de crédito independientes.



## 2. Matriz de Acceso IAM (Roles)
El agente debe aplicar estas reglas de visibilidad en cada componente generado:

| Rol | Alcance | Capacidades |
| :--- | :--- | :--- |
| **Japi SuperAdmin** | Global | Gestión de Providers y visión total de todas las Organizaciones. |
| **Org Admin** | Organización | Gestionar Centros de Costos y usuarios de su propia Organización. |
| **CC Operator** | Centro de Costos | Consultar logs y balance de sus unidades asignadas únicamente. |

## 3. Reglas de Validación de Datos (Multi-tenancy Safety)
1. **Validación Cruzada:** Antes de ejecutar un cargo o envío, el sistema DEBE validar:
   `if (targetCostCenter.organizationId !== currentUser.activeOrgId) throw Unauthorized();`
2. **Propagación de ID:** Todas las queries a las sub-particiones HASH deben incluir obligatoriamente el `cost_center_id` para garantizar que el Partition Pruning funcione correctamente.
3. **Audit Context:** Todo log de auditoría debe incluir el `organizationId` y el `userId` para trazabilidad legal ante Japifon/Rocatell/Digi.

## 4. Reglas para el Agente en Antigravity
* **Contexto de Operación:** Si el usuario pide crear una función de "Consulta de Saldo", el agente debe preguntar o asumir la validación de `organizationId`.
* **Nombramiento:** Usar estrictamente los términos: `Organization` y `CostCenter`. Prohibido usar "Company" o "Client" para evitar ambigüedad.
* **Seguridad:** Nunca exponer IDs internos de una organización a otra mediante respuestas de API (evitar ataques IDOR).