# Skill: Maestro de Facturación Distribuida (Japi Core)

## 1. Filosofía de Precisión Financiera (Micro-Units 10^-7)
Japi Core opera en mercados de micro-márgenes (Telecomunicaciones). Queda estrictamente PROHIBIDO el uso de tipos de datos `number` o `float` para representar dinero.

* **Factor de Escala:** 10,000,000 (Diez millonésimas).
    * Ejemplo: $1.00 USD = `10,000,000` en BigInt.
    * Ejemplo: $0.00001 USD = `100` en BigInt.
* **Almacenamiento:** Uso obligatorio de `BigInt` en PostgreSQL y `bigint` en TypeScript/Bun.
* **Aritmética:** Los cálculos (suma de consumos, multiplicaciones de volumen por rate) deben realizarse siempre sobre la escala entera antes de cualquier división para visualización.



## 2. Resolución de Tarifas (RateCard Logic)
Para garantizar la rentabilidad, el sistema debe resolver la tarifa más específica disponible. El agente debe seguir este orden de búsqueda en el motor de tarificación:

1.  **Match Específico:** `costCenterId` + `ServiceType` + `matchCriteria` (ej: MCC+MNC+Zona).
2.  **Match Regional:** `costCenterId` + `ServiceType` + `matchCriteria` (ej: Country/Prefix).
3.  **Match Global (Default):** Tarifa base del centro de costos para ese servicio.

**Snapshot Obligatorio:** El precio aplicado DEBE ser capturado en el momento del evento (Snapshot) y viajar en el mensaje de Kafka como `rateApplied`. No se permite recalcular el precio después del tráfico, ya que las tarifas son volátiles.

## 3. Integridad y Seguridad (Idempotencia)
Para evitar el doble cobro en sistemas distribuidos con reintentos de Kafka:

* **Provider Reference:** Cada transacción de cobro debe exigir un `providerRef` (UUID generado por el Gateway).
* **Constraint Única:** La tabla `Transaction` debe usar `providerRef` como llave única.
* **Manejo de Colisiones:** Si el `billing-engine` recibe un evento duplicado, la base de datos rechazará la inserción; el agente debe capturar esta excepción y confirmar el mensaje a Kafka como "procesado" sin descontar saldo nuevamente.



## 4. Gestión de Saldo y Redis
El saldo en tiempo real es la defensa contra el fraude.

* **Single Source of Truth:** PostgreSQL (`CostCenter.balance`).
* **High-Speed Cache:** Redis Hashes (`balance:center:{uuid}`).
* **Sincronización:** Cada transacción en Postgres debe desencadenar una actualización atómica en Redis (`HINCRBY` con el valor negativo del cobro).
* **Check de Pre-Vuelo:** El Gateway debe rechazar cualquier tráfico si el balance en Redis es <= 0 antes de intentar enviarlo al Carrier.

## 5. Reglas de Implementación en el Código
1.  **Cero Hallucination:** No proponer `Decimal.js` o `Big.js` a menos que sea estrictamente necesario para raíces cuadradas o funciones complejas. Para sumas y restas, usar `bigint` nativo.
2.  **Formateo de UI:** La conversión de micro-unidades a string decimal (`1.0000000`) debe ocurrir exclusivamente en los componentes de Astro/React del frontend, nunca en el core del billing engine.
3.  **Logging:** Cada error de billing debe loguear el `costCenterId`, el `amount` (en escala 10^-7) y el `transactionId`.