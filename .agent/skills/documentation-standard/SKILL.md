# Skill: Estándar de Documentación de Producto y Sistema (Japi Core)

## 1. El Manifiesto de Documentación
En Japi Core, cada módulo, aplicación o paquete dentro del monorepo DEBE contener dos archivos fundamentales en su raíz para garantizar la alineación entre negocio y tecnología.

## 2. PRODUCT.md: Visión y Valor Comercial
Este archivo describe el "QUÉ" y el "PARA QUÉ" desde una perspectiva de producto y mercado.
* **Propósito:** Definir el valor que entrega el módulo al cliente final o a Japifon.
* **Secciones Obligatorias:**
    - **User Personas:** ¿Quién usa esta función? (ej: Operador de Tráfico, Desarrollador Externo).
    - **Business Value:** ¿Cómo impacta esto en el ingreso o ahorro de la compañía?
    - **Feature List:** Listado de capacidades comerciales (ej: "Envío masivo programado", "Reporte de entrega en tiempo real").
    - **KPIs:** ¿Qué métricas de negocio mide este componente? (ej: "Tasa de entrega (DLR)", "Latencia de facturación").



## 3. SYSTEM.md: Lógica y Capacidades Técnicas
Este archivo describe el "CÓMO" y el "CON QUÉ" desde una perspectiva de ingeniería y arquitectura.
* **Propósito:** Documentar la lógica interna, flujos de datos y límites técnicos.
* **Secciones Obligatorias:**
    - **Domain Logic:** Descripción detallada de las reglas de negocio (ej: "Cálculo de tarifas con escala 10^-7", "Algoritmo de priorización en Binds").
    - **System Capabilities:** Capacidades técnicas (ej: "Procesamiento de 5,000 TPS", "Persistencia en frío tras 12 meses").
    - **Data Flow:** Diagrama o explicación de cómo fluye la información entre Kafka, Redis y Postgres.
    - **Security & IAM:** Niveles de permisos requeridos para interactuar con este sistema.
    - **Error Handling:** Diccionario de errores técnicos y su significado operativo.



## 4. Reglas para el Agente en Antigravity
1. **Sincronización:** Al crear una nueva funcionalidad o microservicio, el agente DEBE proponer los borradores de `PRODUCT.md` y `SYSTEM.md` antes de escribir la primera línea de TypeScript.
2. **Actualización:** Cada vez que se modifique la lógica de negocio (ej: cambiar la escala de billing o agregar una zona de telecom), el agente debe actualizar el `SYSTEM.md` correspondiente.
3. **Lenguaje para Humanos:** Ambos archivos deben seguir el estándar de escritura para humanos, evitando tecnicismos innecesarios en `PRODUCT.md` y siendo quirúrgicamente preciso en `SYSTEM.md`.
4. **Referencia Cruzada:** El agente debe usar estos archivos como guía para asegurar que el código que genera cumple con las capacidades descritas en el sistema.