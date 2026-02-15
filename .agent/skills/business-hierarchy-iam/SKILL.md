# Skill: Arquitectura de Jerarquía Recursiva y PaaS WhiteLabel (Japi Core)

## 1. El Modelo de Datos: Árbol de Tenencia (Recursive Tenancy)
El sistema debe implementar un modelo de **Tenencia Recursiva** donde cada `Organization` puede actuar como un contenedor de otras organizaciones o como un nodo padre de `CostCenters`.

### A. Almacenamiento de Linaje (Materialized Path)
Para garantizar consultas de alto rendimiento ($O(1)$ o $O(log n)$) en estructuras de 80M de registros, se debe utilizar el tipo de dato **`ltree`** de PostgreSQL.
* **Columna obligatoria:** `hierarchy_path`.
* **Formato de Path:** `root.provider_id.org_id.sub_org_id.cost_center_id`.
* **Operador de Consulta:** Usar `<@` (is ancestor of) y `@>` (is descendant of) para validaciones de seguridad y filtrado de datos.



---

## 2. Niveles de la Jerarquía
| Nivel | Nombre | Función |
| :--- | :--- | :--- |
| **0** | **Root (The Group)** | Dueño de la infraestructura física (Japifon Group). Orquestación global. |
| **1** | **Provider (BU)** | Entidad legal facturadora (Japifon, Rocatell, Digi). Posee los Binds. |
| **2** | **Organization** | Cliente directo o Partner/Reseller (ej: Banorte). |
| **2+** | **Sub-Organization** | Entidades subordinadas en el modelo WhiteLabel o PaaS. |
| **Final**| **Cost Center** | Nodo hoja (Leaf). Única entidad que posee `balance` y genera `logs`. |

---

## 3. Lógica de Herencia y Overrides (Closest-to-Leaf)
El agente debe implementar un algoritmo de búsqueda ascendente para cualquier configuración (Precios, Branding, Configuración de Binds):

1.  **Prioridad:** El valor configurado en el nodo más cercano al `CostCenter` tiene prioridad absoluta.
2.  **Búsqueda (Fall-through):** Si el valor es `null` en el nodo actual, subir al `parent_id` recursivamente hasta encontrar un valor o llegar al `Root`.
3.  **Implementación SQL Sugerida:**
    ```sql
    SELECT value FROM configurations 
    WHERE organization_id = ANY(subpath_array(current_path)) 
    ORDER BY nlevel(hierarchy_path) DESC LIMIT 1;
    ```



---

## 4. WhiteLabel y UI Dinámica
Para que el PaaS sea funcional, el agente debe asegurar que la interfaz sea maleable mediante metadatos heredados:
* **Branding Metadata:** Cada nodo puede definir `primary_color`, `logo_url`, y `custom_domain`.
* **Inyección de CSS:** Los componentes deben usar variables CSS (`--japi-main-color`) resueltas en el servidor (Astro/SSR) basándose en la herencia de la organización.
* **Custom Domains:** El middleware debe identificar el `host` del request para cargar el contexto de la organización (Tenant Identification).

---

## 5. Finanzas de Precisión y Revenue Share
El sistema de Billing debe estar intrínsecamente ligado a la jerarquía para soportar el modelo de reventa (Markup).

* **Precisión:** Uso mandatorio de **BigInt** con factor de escala $10^7$ (7 decimales).
* **Fórmula de Markup (Revenue Share):** $$Profit = \sum_{i=1}^{n} (Price_{client} - Price_{provider}) \times Volume_i$$
* **Ledger Jerárquico:** Cada transacción debe registrar el débito al cliente y, simultáneamente, el crédito de margen al Provider/Partner intermedio en el árbol.



---

## 6. Reglas de Seguridad (Guardrails de IA)
Para evitar brechas de seguridad (IDOR) en un entorno WhiteLabel, el agente DEBE inyectar estas reglas:

1.  **Aislamiento de Linaje:** Ningún recurso (Logs, Balances, Config) debe ser expuesto sin validar que el `hierarchy_path` del recurso desciende del `hierarchy_path` del usuario.
    * *Regla:* `IF NOT (user_org_path @> target_resource_path) THEN ABORT`.
2.  **Escalación Prohibida:** Un `Org Admin` solo puede crear o modificar entidades que estén por debajo de su propio nivel en el path.
3.  **Naming Convention:** Usar `lineage` para representar el path completo y `nodeLevel` para la profundidad.

---

## 7. Instrucciones para el Agente en Antigravity
1.  **Detección de Jerarquía:** Antes de crear una tabla o servicio, preguntar: "¿Esta entidad debe ser sensible al linaje (Hierarchy Aware)?".
2.  **Uso de UUID v7:** Generar siempre IDs que mantengan orden cronológico para facilitar el particionamiento de los 80M de logs.
3.  **Documentación Dual:** Si se modifica la lógica de herencia, actualizar inmediatamente el `SYSTEM.md` de la raíz.