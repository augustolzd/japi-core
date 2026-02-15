# System: Gateway Config (Rutas)

## Domain Logic
Este sistema es el "Cerebro de Enrutamiento" para `api-gateway`.

### Core Components
*   **Routing Logic:**
    - Jerarquía de precios: "El mejor costo por cliente".
    - Algoritmo de **Balanceo de Carga con Stickiness**: Mismo usuario usa misma ruta.

## System Capabilities
1.  **Validación de Rutas:**
    - Las configuraciones en este portal son "verdaderas" e inmutables.
    - Cada cambio (de precio/ruta) se publica en Kafka con `routing.config.v1`.
2.  **Soporte de Prefijos (MCC/MNC):**
    - Árbol Trie (Ltree o Json) eficiente para prefijos (E.164) en PostgreSQL.

## Data Flow
1.  **Configuración:** `web-admin` -> `routing_db` (Rutas, Precios).
2.  **Publicación:** Kafka -> `api-gateway` (Consume config).
3.  **Auditoría:** `billing-engine` consulta precios históricos para conciliación.
