# Entrega 1 — Análisis del Sistema

**Grupo**: [Grupo 2]  
**Proyecto**: [Sistema de gestion de Pedios Almuerzo]  
**Fecha de entrega**: 30/04/26

---

## 1. Identificación de Actores


| Actor | Rol / Función en el sistema | Tipo (usuario final, sistema externo, etc.) |
|-------|-----------------------------|---------------------------------------------|
| Empleado      |    Iniciar Sesion, registrarme, gestionar Pedidos, Consultar menu(semanal), Configurar dias de Asistencia          |   Usuario Final          |
|Administrador  |    Registrarse,iniciar sesion, gestionar Menu(semanal), Gestionar Pedidos, Verificar Disponibilidad , vizualizar consolidado diario.         |   Administrador          |
|System        |    Generar lista del dia,Notificar pedido al Administrador,Notificar automaticamente al empleado    | Sistema externo      |

## 2. Requisitos Funcionales

| ID    | Descripción                                                                        | Actor          | HU relacionada |
|-------|------------------------------------------------------------------------------------|----------------|----------------|
| RF-01 |El sistema debe permitir Realizar Pedidos un pedido de vianda                        | empleado                     |  HU-1      |
| RF-02 |El sistema debe permitir Confirmar pedido debe permitir reservar y demostrar que todo salio correcto.|empleado      |  HU-2      |
| RF-03 |El sistema debe permitir Eliminar pedido debe Cancelar el pedido en caso de error o inconveniente.   |empleado      |  HU-3      |
| RF-04 |El sistema debe permitir que el empleado Modifique  el  pedido.                     |empleado                       | HU-4       |
| RF-05 |El sistema debe permitir que el empleado consulte el menu disponible                |empleado                         | HU-5     |
| RF-06 |El sistema debe permitir que el empleado configure sus dias de asistencia           |empleado                         | HU-6     |
| RF-07  |El sistema debe filtar la vizualizacion del menu semanal, de acuerdo con los dias de asistencia configurados por el empleado. | empleado   | HU-7  |
| RF-08 |El sistema debe permitir que el administrador Realizar  menu              |Administrador   | HU-08 | 
| RF- 09|El sistema debe permitir Modificar Menu       |  Administrador| HU-09 |
| RF- 10|El sistema debe permitir Eliminar Menu     |Administrador| HU-10 |
| RF- 11|El sistema debe permitir Confirmar Menu    |Administrador| HU-11 |
| RF- 12|El sistema debe permitir  que el administrador excluya los dias feriados.   |Administrador| HU-12 |
| RF- 13 |El sistema debe permitir configurar roles,activar y descativar cuentas    |Administrador| HU-13 | 
| RF-14 |El sistema debe  permitir vizualizar la tabla consolidado diario para llevar un conteo de pedidos  |Administrador |   HU-14    |
| RF-15|El sistema debe permitir verificar disponibilidad de las viandas   |Administrador| HU-15 |
| RF-16 |El sistema debe  generar la tabla consolidado diario al incio del dia y actualizrarla en tiempo real. |System |   HU-16    |
| RF-17 |El sistema debe permitir notificar detalles de los pedidos confirmados| System | HU-17|
| RF-18 |El sistema debe  permitir enviar notificaciones automaticas por correo a los empleados, que no hayan confirmado su pedido antes del  plazo limite. |System |   HU-18    |

> Cada requisito debe describir una acción concreta: "El sistema debe permitir que [actor] [acción]..."

## 3. Requisitos No Funcionales

| ID     | Categoría (rendimiento, seguridad, usabilidad, etc.) | Descripción |
|--------|------------------------------------------------------|-------------|
| RNF-01 | Seguridad | El sistema deberá implementar autenticación y autorización basada en roles. |
| RNF-02 | Seguridad |    El sistema deberá validar entradas para evitar ataques de inyección SQL.|
| RNF-03 | Seguridad | El sistema deberá contar con respaldo periódico de la base de datos.|
| RNF-04 | Seguridad |El sismtema debe almacenar las contraseñas de forma cifradas.|
| RNF-05 | Seguridad | El sistema debe proteger la informacion de los usuarios y pedidos contra accesos no autorizados. |
| RNF-06 | Rendimiento | El sistema debe responder a las acciones de los usuarios en un tiempo maximo de 3 segundos. |
| RNF-07 | Rendimiento | El sistema debe permitir multiples usuarios en simultaneo sin empeorar el rendimiento. |
| RNF-08 | Rendimineto |Las sesiones deberán expirar automáticamente tras inactividad de una hora.|
| RNF-09 | Rendimiento | Las actualizaciones en tiempo real deberán reflejarse sin recargar la página.|
| RNF-10 | Usabilidad | El sistema debe contar con una interfaz simple e intuitiva. |
| RNF-11 | Usabilidad | El sistema debe mostrar mesajes claros ante errores. |
| RNF-12 | Compatibilidad | El sistema debe ser accesible desde distintos dispositivos (PC, tablet, celular). |
| RNF-13 | Compatibilidad | El sistema debe ser compatible con los navegadores mas utilizados. |
| RNF-14 | Mantenibilidad |El sistema deberá utilizar control de versiones con Git.|


## 4. Historias de Usuario

| ID    | Como...       | Quiero...                  | Para...                            |
|-------|---------------|----------------------------|------------------------------------|
| HU-01 | Empleado      | Realizar pedido            | Para crear un borrador,antes de confirmar el pedido.|
| HU-02 | Empleado      | Confirmar Pedido           | Para poder validar y enviar notificacion con los detalles.|
| HU-03 | Empelado      | Eliminar Pedido            | En caso de error o falla cancela el pedido.|
| HU-04 | Empelado      | Modificar Pedido           | realizar cambios previo o post confirmacion. |
| HU-05 | Empleado      | Consultar el menu semanal  | Seleccionar las viandas de la semana. |            
| HU-06 | Empleado      | configurar dias de asistencia | Deteminar que dias debo seleccionar vianda. |
| HU-07 | Empleado      | Filtrar menu semanal          | Para que el empleado pueda vizualizar las viandas solo los dias que asistira.   |
| HU-08 | Administrador | Realizar menu                   | Para poder cargar un menu,previo a que lo vean los usuarios.|
| HU-09 | Administrador | Modificar     Menu              | Para poder realizar cambios en el menu.|
| HU-10 | Administrador | Eliminar    Menu              | Para poder descartar un menu.|
| HU-11 | Administrador | Confirmar   Menu              |Permitir el acceso a los empleados al menu.|
| HU-12 | Administrador | Informar Feridos              |Permitir el empleado tenga en cuenta  los feriados, a la hora de configurar sus dias de asistencia.|
| HU-13 | Administrador | Configurar roles              |Permitir al administrador otorgar roles o activar/desactivar cuentas.|
| HU-14 | Administrador | Vizualizar consolidado diario  | Para extraer los datos y enviarsela a Aromas Ligth.|
| HU-15 | Administrador | Verificar la disponibilidad de las viandas | Avisar en caso de quedar sin stock |
| HU-16 | System       | Generar la tabla consolidado diario | Para llevar un registro de las viandas que deben realizarse cada dia.|
| HU-17 | System       | Notificar pedido al Administrador.| Para que  el administrador reciba una notificacion  con los detalles de los pedidos confirmados.|
| HU-18 | System       | Notificar automaticamente al empleado |Para informar sobre fecha limite.|
## 5. Diagrama de Casos de Uso

> Insertar imagen del diagrama exportado desde Draw.io, Lucidchart, StarUML o similar.  
> Guardar la imagen en esta misma carpeta (`docs/`) y referenciarla abajo.

![Diagrama de Casos de Uso](./Diagrama_de_caso_de_uso(6).png)

## 6. Especificación de Casos de Uso



| Campo | Detalle |
|---|---|
| **Actor principal** | Empleado |
| **Descripción** | Configurar asistencia |
| **Precondiciones** | haber iniciado sesión en el sistema |
| **Postcondiciones (criterios de aceptación)** | Los días de asistencia quedan almacenados. El menú semanal se actualiza para mostrar solo esos días. |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario debe ingresar al apartado  gestionar asistencia | En caso de haber cometido un error podra editarlo  |
| 2. El sistema muestra los días de la semana (lunes a viernes) con el estado actual de cada uno  |  |
| 3. Debe seleccionaer los dias que asistira |El empleado no selecciona ningún día entonces el sistema muestra un mensaje de advertencia indicando que sin días de asistencia no se generarán pedidos.  |
| 4. El empleado confirma los cambios. | |
| 5.  El sistema guarda la configuración y redirige al menú semanal filtrado. | |


| Campo | Detalle |
|--|--|
| **Actor principal** | Empleado |
| **Descripción** |Consultar menu|
| **Precondiciones** | El usuario debe tener sesion iniciado ,El usuario debe haber registrado los dias de asistencia |
| **Postcondiciones (criterios de aceptación)** | El empleado tiene visibilidad de las opciones de menú disponibles para sus días de asistencia. |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|--|--|
| 1. El empleado ingresa al apartado de menú | No hay menús cargados para la semana, por eso el sistema muestra un mensaje informativo indicando que aún no hay opciones disponibles. |
| 2. El sistema recupera los días de asistencia del empleado|
| 3. El sistema muestra el menu con las viandas disponibles | |
| 3. El sistema muestra únicamente las opciones de menú correspondientes a esos días.  |
| 4. Para cada día, se muestran las opciones disponibles con nombre, descripción y estado de disponibilidad  |
| 5. Los días feriados aparecen bloqueados con un indicador visual.  |
|


| Campo | Detalle |
|---|---|
| **Actor principal** |Empleado |
| **Descripción** | Realizar/Modificar Pedido |
| **Precondiciones** |El empleado debe haber iniciado sesión,tiene días de asistencia configurados y el período de pedido está abierto.|
| **Postcondiciones (criterios de aceptación)** |  |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede a la tabla de menu semanal | El menú seleccionado está agotado por ende el sistema muestra un mensaje de error y no registra la selección, solicitando elegir otra opción |
| 2. El usuario visualiza las opciones de viandas disponibles segun los dias que selecciono. | En caso de no haber stock de una vianda, el sistema lo notificara |
| 3. El usuario selecciona la vianda de los dias que asistira |  |
| 4. El usuario realiza el pedido |  |
| 5. El sistema registra el pedido realizado |  |

| Campo | Detalle |
|---|---|
| **Actor principal** |Empleado |
| **Descripción** | Confirmar pedido |
| **Precondiciones** |El empleado tiene almenos una seleccion de menu registrado,el periodo de pedidos esta abiero |
| **Postcondiciones (criterios de aceptación)** | El pedido queda en estado de confirmado,notifica al administrdor,el stock  de los menus seleccionados se desuenta y se adiciona a la tabla de consolidado diario. |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede a seccion confirmar pedidos |El empleado decide no confirmar y vuelve a editar|
| 2. El sistema muestra un resumen completo del pedido (día, menú seleccionado por día) |  |
| 3. El usuario verifica los datos del pedido | Error al enviar notificación, entonces el pedido se confirma igualmente y se registra el error para reintento posterior. |
| 4. El usuario confirma el pedido ||
| 5. El sistema registra la confirmacion del pedido | |


| Campo | Detalle |
|---|---|
| **Actor principal** | Empleado |
| **Descripción** | Eliminar pedido |
| **Precondiciones** | Tener un pedido registrado |
| **Postcondiciones (criterios de aceptación)** | Pedido eliminado correctamente |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede al apartado pedidos confirmados | |
| 2. El usuario selecciona el pedido que desea eliminar | |
| 3. El sistema solicita confirmación para eliminar el pedido | |
| 4. El sistema elimina de forma exitosa el pedido. | |


| Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Modificar/Realizar Menu |
| **Precondiciones** | Debe haber una tabla de menu semanal cargada |
| **Postcondiciones (criterios de aceptación)** | El empleado  debe visualizar la tabla actualizada |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. Ingresa al apartado menu semanal | Si cancela la modificacion la tabla quedara comoestaba |
| 2. Selecciona un dia a modificar  | |
| 3. El sistema manda un formulario con campos: nombre, descripción, cantidad disponible. |  |
| 4. El administrador completa el formulario y confirma.| |
| 5. El sistema guarda la opción y la hace visible en el menú del empleado.  |  |


| Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Vizualizar pedido |
| **Precondiciones** | Debe haber iniciado sesion, Existan pedidos reigstrados para el dia/semana seleccionada  |
| **Postcondiciones** (criterios de aceptación)* | El administrador tiene visibilidad del conteo de pedidos por menu para organizar la preparacion |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  El administrador accede al panel "Pedidos" ||
| 2.  El sistema muestra por defecto el día actual con el conteo de cada opción de menú solicitada |No hay pedidos para el día seleccionado para eso el sistema muestra un mensaje informativo con conteo en cero. |
| 3.  El administrador puede filtrar por otro día de la semana |  |
| 4.  El sistema actualiza la vista en tiempo real sin necesidad de recargar la página | |
| 5. El administrador puede exportar o imprimir la lista diaria para la cocina. ||

|Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Eliminar menu  |
| **Precondiciones** |  Que haya menu semanal cargado |
| **Postcondiciones** (criterios de aceptación)* | Tabla de menu semanal eliminada  |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El administrador selecciona una opción de menú y presiona "Eliminar"  |El menú tiene campos vacíos, el sistema no permite cargarlo |
| 2. El sistema verifica que no existan pedidos confirmados para esa opción. | |
| 3. El sistema solicita confirmación de la acción.|  |
| 4. El administrador confirma entonces el sistema elimina la opción del menú. |  |

| Campo | Detalle |
|--|--|
| **Actor principal** |Administrador|
| **Descripción** | Gestionar Feriados |
| **Precondiciones** | Tener la sesion como administrador iniciada. |
| **Postcondiciones (criterios de aceptación)** | Los días feriados quedan marcados en el sistema. Los empleados no pueden realizar pedidos en esas fechas.  |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El administrador ingresa a la seccion configurar dias de asistencias |  Para desmarcar un feriado,por error, con seleccionarla de vuelta, vuelve a su estado original.|
| 2.  El administrador selecciona los dias correspondientes y los marca como feriados. | |
| 3.   Confirma los cambios  |  |
| 4. El sistema actualiza y los refleja en la tabla de los usuarios.| |

| Campo | Detalle |
|--|--|
| **Actor principal** |System|
| **Descripción** |Notificar plazo Expirado |
| **Precondiciones** |que la fecha y horario limite haya expirado, que el empleado no haya realizado un pedido |
| **Postcondiciones (criterios de aceptación)** | El empleado es notificado que no recibira la vianda |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  El sistema evalúa, en el horario configurado, qué empleados no han confirmado su pedido para la semana en curso ||
| 2.  El sistema genera un correo de recordatorio personalizado para cada empleado pendiente.| |
| 3. El sistema envía los correos a través del Mail Server.  |  |
| 4. El sistema registra las notificaciones enviadas con fecha, destinatario y resultado. | |

| Campo | Detalle |
|--|--|
| **Actor principal** |System|
| **Descripción** | Generar lista |
| **Precondiciones** |Debe haber un menu cargado|
| **Postcondiciones (criterios de aceptación)** | Al cierre del dia la lista queda guardada  |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  La lista se crea a la apertura del dia, tomando los datos de los menues de ese dia  con la tabla menu semanal | |
| 2.  Se hace un conteo de los pedidos registrados |  |
| 3.  |  |


> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
