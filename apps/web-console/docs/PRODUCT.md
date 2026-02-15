# Product: Japi Console (El Centro de Credenciales)

## Misión de Negocio
Console es la experiencia unificada de desarrollador para la plataforma Japi. Su objetivo es la simplicidad en la creación de canales de comunicación (SMS, WABA, RCS).

## User Personas
*   **Desarrolladores (DevOps):** Gestionan SystemIDs, Tokens y Webhooks.
*   **Administradores de IT:** Definen políticas de IP Whitelist y accesos.
*   **Clientes (B2B):** Contratan servicios y visualizan sus claves de API.

## Feature List
1.  **Apps & SystemIDs:**
    *   Creación de aplicaciones lógicas (Ej: "App Marketing", "App OTP").
    *   Generación de `SystemID` único para identificación en el Gateway.
2.  **Gestión de Credenciales:**
    *   Emisión y revocación de API Keys.
    *   Configuración de seguridad por IP (CIDR Whitelist).
3.  **Configuración de Webhooks:**
    *   Endpoint y Secret para recepción de DLRs (Delivery Reports).
    *   Retry Policies y timeouts.
