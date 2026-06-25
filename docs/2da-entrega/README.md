# Entrega 2 — Diseño de Interfaces
**Grupo**: [Grupo 2]
**Proyecto**: [Sistema de Gestion de Pedidos ]
**Fecha de entrega**: 25/06/2026
---
## 1. Inventario de pantallas troncales
| N° | Nombre | Actor principal | CU(s) cubierto(s) | Función (1 frase) |
|----|--------|------------------|---------------------|--------------------|
| 01 | Login | Administrador y empelado | |Acceder al sistema |
| 02 |Registrar asistencia | empleado | Configurar Asistencia | Permite seleccionar los días de asistencia presencial a la empresa. |
| 03 | Menú + Registrar pedido| Empleado | Consultar menú/Realizar-Modificar pedido | Permite visualizar el menú semanal filtrado y registrar un pedido. |
| 04 | | | | |
| 05 | Generar consolidado diario | Administrador | Visualizar pedido | Permite visualizar el conteo de pedidos diarios y generar la lista para la cocina. |
---
## 2. Trazabilidad pantalla ↔ E1
| Pantalla | CU(s) | HU(s) | Actor |
|----------|-------|-------|-------|
| 01 — Login | | | |
| 02 — Registrar asistenica | Configurar asistencia | HU-06 | Empleado |
| 03 — Menu + Registrar pedido| Consultar menu-Realizar-Modificar pedido | HU-01, HU-04, HU-05, HU-07 | Empleado |
| 04 — [Nombre] | | | |
| 05 — Generar consolidado diario| Visualizar pedido | HU-14 | Administrador |
---
## 3. Decisiones técnicas y observaciones
> Documentar acá las decisiones de diseño y desarrollo del grupo, organizadas por
pantalla.
> Esta sección es clave para la defensa oral del 25/06.
### Pantalla 01 — Login
- Se decidió realizar una pantalla sencilla y centrada, ya que representa el punto de acceso al sistema. Incluye validación nativa mediante type="email", type="password" y required. Puede ser utilizada tanto por Empleados como por Administradores.
### Pantalla 02 — [Configurar asistencia]
- Se eligió una disposición simple utilizando casillas de selección para representar los días de la semana. Esta pantalla es importante dentro del flujo porque determina qué menús podrá visualizar posteriormente el empleado. Se agregó una nota aclarando que la configuración de asistencia condiciona la visualización del menú semanal.  
### Pantalla 03 — [Menu + Registrar pedido]
- Se diseñó una pantalla de menú semanal organizada por días, utilizando tarjetas para cada opción de vianda. Cada tarjeta contiene el nombre del plato, una imagen, una descripción y un botón para agregarlo al pedido.
Esta pantalla cubre los casos de uso Consultar menú y Realizar/Modificar pedido, ya que el empleado necesita visualizar previamente las opciones disponibles antes de seleccionar una vianda.
El botón principal utiliza el texto Guardar pedido, ya que según el modelo del sistema el pedido queda registrado en estado borrador y la confirmación se realiza posteriormente mediante el caso de uso Confirmar pedido.
### Pantalla 04 — [Nombre]
- (Pendiente)
### Pantalla 05 — [Generar consolidado diario]
- Esta pantalla pertenece al rol Administrador, diferenciándose de las pantallas anteriores que son utilizadas principalmente por el Empleado.
Se optó por una interfaz de tipo reporte, incorporando un selector de fecha, una tabla con pedidos confirmados, un resumen por opción de menú y botones de acción como Generar, Descargar y Enviar al proveedor.
La información presentada representa el cierre del flujo del sistema, permitiendo visualizar el conteo diario de pedidos y preparar la lista que será enviada a la cocina.
Esta pantalla cubre el caso de uso Visualizar pedido, asociado a la HU-14.
### Uso de Inteligencia Artificial
- Se utilizó inteligencia artificial únicamente como herramienta de apoyo para resolver dudas puntuales de sintaxis HTML, mejorar la redacción de la documentación y verificar la coherencia entre historias de usuario, requisitos y casos de uso.
El diseño de las interfaces, los wireframes y el código HTML/CSS fueron desarrollados por el equipo.