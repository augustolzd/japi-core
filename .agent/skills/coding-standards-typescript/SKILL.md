# Skill: Estándar de Codificación, Arquitectura y Estilo (Japi Core)

## 1. Tipado de Hierro y Rigurosidad
* **Cero Supresión:** Prohibido `// @ts-ignore`, `// biome-ignore` o similares.
* **Prohibido `any`:** Uso obligatorio de `unknown` + Type Guards o Valibot.
* **Result Pattern:** Manejo de errores como valores; prohibido `throw` en lógica de negocio.

## 2. Estándar de Estilado: CSS Estructurado (No Utility-First)
En Japi Core priorizamos la semántica y la mantenibilidad del diseño. Queda estrictamente PROHIBIDO el uso de Tailwind CSS, Bootstrap o estilos inline.

* **Escritura Directa:** Se debe escribir CSS puro utilizando **CSS Modules** o bloques `<style>` de Astro.
* **Custom Properties (Variables):** Todos los valores de marca (colores, espaciados, fuentes) deben residir en un archivo global de variables CSS (`:root`).
* **Metodología BEM o Similar:** El CSS debe estar estructurado (ej. Block-Element-Modifier) para evitar colisiones de especificidad y asegurar que el código sea legible para humanos.
* **Prohibido Inline CSS:** El atributo `style="..."` está vetado. Todo el estilo debe estar desacoplado del marcado.



## 3. Frontend: Atomic Design & Reutilización
* **Componentes Reutilizables:** Prohibido duplicar lógica de UI o estructuras HTML en `/apps`. Todo componente común reside en `packages/ui-system`.
* **HTML Semántico:** Uso obligatorio de etiquetas `<main>`, `<nav>`, `<section>`, `<article>`.
* **Pureza de Componentes:** Los componentes en `ui-system` deben ser presentacionales y recibir estilos mediante sus propios archivos CSS desacoplados.

## 4. Principios SOLID, CLEAN & DRY
* **Clean Architecture:** Separación estricta entre Dominio (lógica 10^-7), Aplicación e Infraestructura.
* **SOLID:** Funciones de responsabilidad única e inversión de dependencias.
* **DRY:** Abstracción total de lógica repetida en paquetes compartidos.



## 5. Reglas para el Agente en Antigravity
1. **Detección de Frameworks:** Si el agente intenta sugerir clases de Tailwind (ej. `flex items-center`), debe autocorregirse y proponer un bloque de CSS estructurado.
2. **Modularidad:** El CSS debe vivir junto al componente (Component-scoped CSS) para facilitar la eliminación de código muerto (Dead Code Elimination).
3. **Validación Biome:** Asegurar que el CSS cumpla con las reglas de formato y orden de Biome.