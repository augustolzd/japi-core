# Skill: Estándar de Codificación, Arquitectura y Reutilización (Japi Core)

## 1. Tipado de Hierro y Rigurosidad
* **Cero Supresión:** Prohibido `// @ts-ignore`, `// biome-ignore` o similares.
* **Prohibido `any`:** Uso obligatorio de `unknown` + Type Guards o Valibot.
* **Result Pattern:** Errores como valores, prohibido `throw` en lógica de negocio.

## 2. Arquitectura de Frontend: "Single Source of Components"
Para cumplir con el principio **DRY**, la construcción de interfaces en Japi Core se rige por:

* **Componentes Reutilizables:** Está estrictamente PROHIBIDO duplicar lógica de UI o estructuras HTML en `/apps`.
* **Ubicación Centralizada:** Todo componente que se use más de una vez (botones, inputs, tablas, gráficas, layouts de tarjetas) DEBE residir en `packages/ui-system`.
* **Atomic Design:** Organizar componentes en Átomos, Moléculas y Organismos para maximizar la composición.
* **React Props Strict:** Los componentes de React deben usar interfaces de TypeScript exhaustivas. No se permite el uso de `any` en las props.



## 3. Estándares Web y CSS
* **HTML Semántico:** Uso obligatorio de `<main>`, `<nav>`, `<article>`, etc. Prohibido el "Div-itis".
* **Prohibido Inline CSS:** Todo el estilo debe ser vía Tailwind CSS o módulos CSS. El atributo `style` está vetado.
* **Tailwind Consistency:** Las clases de Tailwind deben seguir el orden estándar de Biome para facilitar la lectura.

## 4. Principios SOLID, CLEAN & DRY
* **Clean Architecture:** Separación clara entre Dominio (lógica 10^-7), Aplicación y Infraestructura (Kafka/Prisma).
* **SOLID:** Funciones de una sola responsabilidad, inversión de dependencias y composición sobre herencia.

## 5. Reglas para el Agente en Antigravity
1. **Detección de Duplicidad:** Si el agente va a crear un componente en una `app/`, debe verificar primero si existe en `packages/ui-system` o proponer su creación ahí directamente.
2. **Propagación de Tipos:** Los componentes de React deben heredar los tipos de Valibot definidos en `packages/events-schema` para asegurar que el formulario coincida con el API.
3. **Pureza de Componentes:** Los componentes en `ui-system` deben ser "puros" (presentacionales); la lógica de fetching de datos debe inyectarse o manejarse en los componentes de página de Astro.