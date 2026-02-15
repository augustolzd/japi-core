# System: Authentication & SSO Logic

## Domain Logic
* **Central Identity Provider:** `web-auth` actúa como el único emisor de tokens válidos.
* **Token Strategy:** Uso de **JWT (JSON Web Tokens)** con firma asimétrica o secreta compartida para SSO.
* **Hashing:** Contraseñas protegidas mediante Argon2 o algoritmos de alta resistencia (Zero-Trust).
* **Session Handshake:** Flujo de redirección con tokens temporales para propagar la sesión a `admin-dashboard` y `connect-web`.

## System Capabilities
* **Cross-Domain SSO:** Capacidad de compartir login entre subdominios o puertos diferentes.
* **Stateless Validation:** Los micro-frontends pueden validar la sesión sin consultar a la DB en cada request.

## Data Flow
1. El usuario se registra/loguea en `web-auth`.
2. `web-auth` genera un JWT y redirecciona al sitio anterior con el token.
3. El sitio destino almacena el token en Cookie/LocalStorage y lo valida localmente.

## Security & IAM
* **Password Expiration:** Lógica de rotación de claves (opcional).
* **Role Enforcement:** El rol del usuario se incluye en el payload del JWT para acceso instantáneo a capacidades.

## Error Handling
* Manejo de `AUTH_INVALID_CREDENTIALS`, `AUTH_ACCOUNT_LOCKED`, `AUTH_TOKEN_EXPIRED`.
