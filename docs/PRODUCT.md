# Japi Unified Platform
**Japi** es un ecosistema modular diseñado para la gestión de infraestructura crítica en telecomunicaciones, fidelización de usuarios y operaciones empresariales a gran escala.

## Portales Web (Verticales de Negocio)
El sistema se organiza en 4 portales principales, cada uno con una responsabilidad de negocio clara y aislada:

### 1. Billing Portal (Finanzas)
*   **Código:** `apps/web-billing`
*   **Misión:** Gestión integral del ciclo de vida financiero.
*   **Responsabilidades:**
    - Conciliación de tráfico vs. facturación.
    - Generación de facturas y estados de cuenta.
    - estadísticas en tiempo real para el cobro y control de saldo.

### 2. Console Portal (Gestión de Desarrolladores & Credenciales)
*   **Código:** `apps/web-console`
*   **Misión:** Autoservicio para clientes y desarrolladores.
*   **Responsabilidades:**
    - Creación y gestión de Aplicaciones y `SystemIDs`.
    - Emisión de credenciales (API Keys, Tokens) para servicios (SMS, RCS, WhatsApp).
    - Configuración de webhooks y seguridad por IP.

### 3. Marketing Portal (Campañas & Engagement)
*   **Código:** `apps/web-connect`
*   **Misión:** Herramienta visual para equipos de marketing.
*   **Responsabilidades:**
    - Gestión completa de campañas masivas (Broadcasts).
    - Estadísticas de engagement (Open rates, Click-through rates).
    - Módulos visuales para Email, SMS y Rich Messaging.

### 4. Gateway Interface (Configuración de Rutas)
*   **Código:** `apps/web-admin` (Renombrado conceptualmente a Gateway UI)
*   **Misión:** Control técnico de la infraestructura de telecomunicaciones.
*   **Responsabilidades:**
    - Configuración de rutas y proveedores (Carriers).
    - Gestión de costos, precios y márgenes por país/operador.
    - Monitoreo técnico del `api-gateway`.

## Propuesta de Valor
*   **Especialización:** Cada portal está optimizado para un User Persona específico (Contador, Desarrollador, Marketer, Ingeniero de Telecom).
*   **Seguridad:** Aislamiento de contextos; un marketer no puede tocar rutas de telecom, y un contador no puede emitir credenciales de API.
