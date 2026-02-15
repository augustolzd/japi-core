# System: API Gateway Architecture

## Domain Logic
* **Runtime:** Ejecución sobre Bun para mínima latencia.
* **Framework:** Hono por su ligereza y compatibilidad con estándares Web.
* **Validation:** Uso mandatorio de Valibot para validación de contratos públicos.

## System Capabilities
* **High Performance Middleware:** Logger de Hono, Secure Headers y CORS configurados nativamente.
* **Zero-Node:** Orientado a estándares de Web APIs modernos.

## Data Flow
1. El cliente envía petición HTTP.
2. Gateway aplica middlewares (Auth -> Validation -> Logic).
3. (Próximamente) Redirección o publicación en Kafka para servicios asíncronos.

## Security & IAM
* **Mandatory Headers:** Bloqueo de ataques comunes vía `secure-headers`.
* **CORS:** Restringido a dominios permitidos (`admin.japi.com`).
* **Auth Guard:** Validación de tokens y permisos (IAM Skill).

## Error Handling
* Diccionario de respuestas JSON consistentes.
* Manejo de errores 400 (Validation) y 500 (Internal).
