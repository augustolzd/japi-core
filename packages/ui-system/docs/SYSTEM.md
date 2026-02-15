# System: UI Architecture (ui-system)

## Domain Logic
* **Design Tokens:** Centralización de valores de marca en `styles/variables.css` usando CSS Custom Properties.
* **Component-Scoped CSS:** Cada componente debe tener su propio archivo `.module.css` para evitar colisiones de nombres y facilitar el "Tree Shaking" de estilos (Dead Code Elimination).
* **Presentational Purity:** Los componentes en este paquete son puramente presentacionales; no deben contener lógica de negocio ni llamadas a APIs.

## System Capabilities
* **Framework Agnostic (Base):** Aunque actualmente usa React, la lógica de estilos en CSS puro permite migrar a otros frameworks si es necesario.
* **Zero Tailwind:** Cumplimiento del mandato de diseño desacoplado del marcado.

## Data Flow
* Los componentes reciben datos mediante `props` tipadas estrictamente.
* Las variables de estilo fluyen desde el archivo global `variables.css` hacia los módulos específicos de cada componente.

## Security & IAM
* No aplica directamente (Componentes visuales).

## Error Handling
* **Type Safety:** Uso de TypeScript para prevenir el paso de props inválidas en tiempo de compilación.
* **Fallback Content:** Los componentes deben manejar estados vacíos o de carga cuando sea aplicable.
