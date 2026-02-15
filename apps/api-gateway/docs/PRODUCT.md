# Product: Japi API Gateway

## User Personas
* **Clientes API:** Desarrolladores externos que integran SMS/RCS en sus aplicaciones.
* **Integraciones Japifon:** Otros microservicios que necesitan exponer endpoints públicos o internos.

## Business Value
* **Seguridad Centralizada:** Punto único de entrada para autenticación y autorización.
* **Escalabilidad:** Separación del tráfico de entrada del procesamiento pesado de negocio.
* **Experiencia de Desarrollador:** APIs consistentes y bien documentadas.

## Feature List
* **Routing:** Redirección de peticiones a los servicios de backend correspondientes.
* **Middleware de Seguridad:** Headers seguros, CORS y autenticación.
* **Validación de Esquema:** Asegura que solo lleguen datos válidos a los microservicios internos.

## KPIs
* **P99 Latency:** Tiempo de respuesta del gateway.
* **Request Success Rate:** Porcentaje de peticiones 2xx vs 4xx/5xx.
* **Throughput:** Peticiones por segundo sostenidas.
