# System: Admin Dashboard Architecture

## Domain Logic
* **Framework:** Astro en modo SSR para seguridad y SEO.
* **Component Library:** Integra `@japi/ui-system` para la interfaz.
* **Islands Architecture:** React se usa solo para partes interactivas complejas; el resto es HTML puro servido desde SSR.

## System Capabilities
* **Zero Tailwind:** Estilado basado puramente en CSS Modules y el sistema de diseño central.
* **Server-Side Rendering:** Autenticación y datos sensibles procesados en el servidor antes de llegar al cliente.

## Data Flow
1. Astro Page recibe petición.
2. Middleware valida sesión y permisos.
3. Server Fetch obtiene datos de la DB o APIs internas.
4. Renderizado de componentes React (islands) si es necesario.

## Security & IAM
* **Session Management:** Basado en cookies seguras.
* **Permission Check:** Validación a nivel de ruta y componente.

## Error Handling
* Páginas de error personalizadas (404, 500).
* Fallbacks para islas interactivas.
