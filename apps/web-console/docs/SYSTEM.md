# System: Console (IAM & Developer Experience)

## Domain Logic
Este sistema es el "Sistema de Identidad" (IAM) que gobierna los SystemIDs.

### Core Components
*   **SystemID Manager:**
    - Generación de UUIDs inmutables para `systemId` y `apiKey`.
    - Validación criptográfica (Argon2 para secretos).

## System Capabilities
1.  **Seguridad y Auditoría:**
    - Cada cambio de configuración (nuevo SystemID, revoke API key) emite log en Kafka (`iam.audit`).
    - Soporte Multi-Tenant: Un usuario puede pertenecer a varios "Organizaciones" (SaaS).
2.  **Consistencia Inmediata:**
    - La configuración se almacena en BD principal y se sincroniza a `billing-engine` y `api-gateway` mediante Kafka para validación en <1ms.

## Data Flow
1.  **Escritura:** `web-console` -> API -> `iam_db` (SystemID/User).
2.  **Sincronización:** Kafka (`config.updates.v1`) propaga cambios al Gateway.
3.  **Auditoría:** `api-gateway` consulta caché interna poblada desde Kafka para validar el `systemId`.
