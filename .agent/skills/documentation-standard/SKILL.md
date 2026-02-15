# Skill: Estándar de Documentación de Producto y Sistema (Japi Core)

## 1. El Manifiesto de Documentación
En Japi Core, el conocimiento no es opcional. Cada aplicación, paquete o módulo dentro del monorepo DEBE tener una carpeta dedicada a la documentación para garantizar la alineación entre la visión de negocio y la ejecución técnica.

## 2. Estructura de Almacenamiento
Toda la documentación debe residir en directorios específicos llamados `docs/`:

* **Documentación Global (Raíz):** `japi-core/docs/`
    - Contiene el resumen general de todo el ecosistema (Japifon, Rocatell, Digi).
* **Documentación de Módulo/App:** `[path/to/module]/docs/`
    - Ejemplo: `apps/billing/docs/PRODUCT.md` o `packages/database/docs/SYSTEM.md`.

---

## 3. Definición de Archivos Fundamentales

### A. PRODUCT.md (El "QUÉ" y "PARA QUÉ")
Describe el valor comercial desde una perspectiva de producto y mercado.
* **User Personas:** ¿Quién usa esta función? (ej: Operador de Tráfico, CFO).
* **Business Value:** Impacto en ingresos, ahorro o cumplimiento legal.
* **Feature List:** Capacidades comerciales tangibles.
* **KPIs:** Métricas de éxito (ej: Latencia de cobro, tasa de entrega).

### B. SYSTEM.md (El "CÓMO" y "CON QUÉ")
Describe la arquitectura, lógica de negocio y capacidades técnicas.
* **Domain Logic:** Reglas de negocio (ej: Aritmética 10^-7, jerarquía de herencia).
* **System Capabilities:** Límites técnicos (ej: 80M logs/mes, TPS).
* **Data Flow:** Flujo de información entre microservicios y bases de datos.
* **Security & IAM:** Roles requeridos y aislamiento de linaje (Ltree).

---

## 4. Jerarquía y Resumen General
El agente debe mantener un **"Master Doc"** en la raíz:
1. **Consolidación:** El `docs/SYSTEM.md` de la raíz debe resumir cómo interactúan todos los sub-módulos.
2. **Navegabilidad:** El resumen general debe actuar como un índice que enlace a los `docs/` de cada paquete individual.

---

## 5. Reglas para el Agente en Antigravity
1. **Creación Automática:** Si el agente crea un nuevo paquete o app, DEBE crear automáticamente la carpeta `docs/` y los archivos iniciales.
2. **Sincronización Previa:** Antes de codificar, el agente debe presentar el borrador de `docs/PRODUCT.md` y `docs/SYSTEM.md`.
3. **Mantenimiento de Linaje:** Cualquier cambio en el sistema de jerarquía o particionamiento de DB debe actualizar el `docs/SYSTEM.md` global y el local del módulo afectado.
4. **Referencia Cruzada:** El código generado debe estar comentado haciendo referencia a las capacidades descritas en su respectivo `SYSTEM.md`.
5. **Lenguaje Dual:** `PRODUCT.md` debe ser legible para un stakeholder; `SYSTEM.md` debe ser quirúrgicamente preciso para un ingeniero.