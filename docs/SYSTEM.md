# Architecture: Japi Core Infrastructure
Este es el diseño técnico de los 4 portales principales en el ecosistema Japi.

## Tech Stack & Portals

### 1. Billing Portal (`apps/web-billing`)
*   **Dominio:** Conciliación Financiera.
*   **Runtime:** Astro + React SSR.
*   **Database:** `billing_db` (Postgres con particionamiento por mes).
*   **Kafka Topics:** `billing.conciliation.v1` (Lectura).
*   **Core Logic:** Cálculo de precios 10^-7, agregación de tráfico (SUM, GROUP BY windowing).

### 2. Console Portal (`apps/web-console`)
*   **Dominio:** Identity & Access Management (IAM).
*   **Runtime:** Astro + React SSR.
*   **Database:** `iam_db` (Schema único global).
*   **Kafka Topics:** `iam.events.v1` (Emisión de credenciales/updates).
*   **Core Logic:**
    - Generación criptográfica de API Keys.
    - Validación de `SystemID` y reglas de rate-limiting (Configuración).

### 3. Marketing Portal (`apps/web-connect`)
*   **Dominio:** Campaign Automation.
*   **Runtime:** Next.js (Necesario por la complejidad de UI/Widgets de campañas).
*   **Database:** `campaigns_db` (Postgres + MongoDB para logs de eventos).
*   **Kafka Topics:**
    - `campaigns.dispatch.v1` (Emisión masiva).
    - `events.tracking.v1` (Lectura de opens/clicks).
*   **Core Logic:** Programación de envíos (Scheduler), templates dinámicos y análisis de audiencias.

### 4. Gateway Interface (`apps/web-admin`)
*   **Dominio:** Telecom Configuration.
*   **Runtime:** Astro + React.
*   **Database:** `routing_db` (Postgres, Ltree para jerarquía de rutas).
*   **Kafka Topics:** `routing.updates.v1` (Propagación de cambios a `api-gateway`).
*   **Core Logic:**
    - Algoritmos de Least Cost Routing (LCR).
    - Gestión de prefijos MCC/MNC.
    - Configuración de proveedores SMPP/HTTP.

---

## Flujo de Comunicación (High Level)
1.  **Console** crea una App y SystemID -> Evento Kafka -> **Gateway** (Carga reglas iniciales).
2.  **Marketing** lanza campaña -> API Gateway (Valida SystemID) -> **Gateway** (Enruta tráfico).
3.  **API Gateway** entrega mensaje -> Evento Kafka -> **Billing** (Calcula costo/precio).

## Seguridad
*   **JWT Propagation:** Todos los portales comparten sesión mediante tokens firmados por `apps/web-auth`.
*   **Role Mapping:**
    - `BILLING_ADMIN` -> Acceso total a `apps/web-billing`.
    - `CONSOLE_USER` -> Acceso a crear Apps en `apps/web-console`.
    - `MARKETING_MANAGER` -> Acceso a campañas en `apps/web-connect`.
    - `TELECOM_OPERATOR` -> Acceso a rutas en `apps/web-admin`.
