# System: Marketing Platform (Gestión de Campañas)

## Domain Logic
La lógica de `web-connect` maneja la complejidad visual y programatica de las campañas.

### Core Components
*   **Campaign Manager:**
    - Scheduler robusto (Ej: `bull-queue` o similar sobre Redis/Postgres) para ejecutar envíos en hora local del usuario.
    - Transformación de plantillas (Liquid/Handlebars) a payload raw para cada canal (Email, SMS, WA).
*   **Event Tracker:**
    - Recepción de Webhooks públicos (pixel de apertura, click tracking).
    - Agregación anónima de métricas para dashboards.

## System Capabilities
1.  **Alta Disponibilidad de I/O:**
    - Escritura masiva de eventos (clicks/opens) sin afectar la emisión de campañas.
    - Uso de MongoDB/TimescaleDB para series temporales de engagement.
2.  **Multicanal:**
    - Lógica específica por proveedor (Ej: WhatsApp Template message vs SMS Text).
    - Fallback inteligente (Si falla WA -> Mandar SMS).

## Data Flow
1.  **Creación:** `web-connect` -> `campaigns_db` (Definición).
2.  **Dispatch:** Job Worker -> API Gateway (`POST /send/batch`).
3.  **Tracking:** Webhook -> API Gateway -> Kafka (`marketing.events`) -> `marketing-worker` -> `campaigns_db`.
