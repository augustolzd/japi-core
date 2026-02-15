# System: Billing Engine (Finanzas)

## Domain Logic
La lógica de facturación utiliza una arquitectura de "Carga Asíncrona" y "Particionamiento de Base de Datos" debido al alto volumen de registros.

### Core Components
*   **Conciliation Module:**
    - Algoritmo de "Matching" entre CDRs de tráfico de `api-gateway` y `provider networks` (simulado o importado).
    - Lógica de Tarifas por Carrier (MNC/MCC) y Rango Numérico.
*   **Pricing Engine:**
    - Cálculo de costos a escala 10^-7 (0.0000001 BTC/USD).
    - Gestión de reglas de márgenes por país y operador.

## System Capabilities
1.  **Escalabilidad de Lectura:**
    - Las consultas pesadas (reportes mensuales de 80M+ registros) se ejecutan sobre `read-replicas` particionadas.
    - Uso de `MATERIALIZED VIEWS` para dashboards de resumen rápido.
2.  **Integridad Transaccional:**
    - Uso estricto de transacciones ACID para movimientos de saldo.
    - Auditoría inmutable de cada cambio de balance.

## Data Flow
1.  **Ingesta:** Los microservicios emiten eventos de consumo a Kafka (`billing.charges.v1`).
2.  **Procesamiento:** El `billing-engine` consume estos eventos, aplica tarifas y persiste en `charges_YYYYMM`.
3.  **Visualización:** `web-billing` consulta la base de datos de Billing para mostrar reportes y dashboards.
