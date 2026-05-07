# Entrega 1 — Análisis del Sistema

**Grupo**: [Grupo 2]  
**Proyecto**: [Sistema de gestion de Pedios Almuerzo]  
**Fecha de entrega**: 30/04/26

---

## 1. Identificación de Actores

| Actor | Rol / Función en el sistema | Tipo (usuario final, sistema externo, etc.) |
|-------|-----------------------------|---------------------------------------------|
| Empleado      |    Iniciar Sesion, registrarme, mantener Datos actualizados, gestionar Pedidos, Consultar menu(semanal), Configurar dias de Asistencia          |   Usuario Final          |
|Administrador  |    Registrarse,iniciar sesion, gestionar Menu(semanal), Gestionar Pedidos, Verificar Disponibilidad           |   Administrador          |
|System        |    Enviar notificacion                                             | Sistema externo      |

## 2. Requisitos Funcionales

| ID    | Descripción                                                                        | Actor          | HU relacionada |
|-------|------------------------------------------------------------------------------------|----------------|----------------|
| RF-01|El sistema debe permitir Realizar Pedidos un pedido de vianda                        |empleado                         |  HU-1      |
| RF-02 |El sistema debe permitir Confirmar pedido debe permitir reservar y demostrar que todo salio correcto.|empleado        |  HU-2      |
| RF-03 |El sistema debe permitir Eliminar pedido debe Cancelar el pedido en caso de error o inconveniente.   |empleado        |  HU-3      |
| RF-04 |El sistema debe permitir que el empleado Modifique  el  pedido.                     |empleado                         | HU-4               |
| RF-05 |El sistema debe permitir que el empleado consulte el menu disponible                |empleado                         | HU-5 |
| RF-06 |El sistema debe permitir que el empleado configure sus dias de asistencia           |empleado                         | HU-6  |
| RF-07 |El sistema debe permitir que el administrador Agregar borrador de menu              |Administrador   | HU-07 
| RF- 08  |El sistema debe permitir Editar Menu       |  Administrador| HU-08 |
| RF- 09  |El sistema debe permitir Eliminar Menu     |Administrador| HU-09 |
| RF- 10  |El sistema debe permitir Confirmar Menu    |Administrador| HU-10 |
| RF- 11  |El sistema debe permitir verificar disponibilidad de las viandas   |Administrador| HU-11 |
| RF-12 |El sistema debe  generar la tabla consolidado diario al cierre del dia. |System |   HU-12    |
| RF-13 |El sistema debe permitir notificar detalles de los pedidos confirmados| System | HU-13|

> Cada requisito debe describir una acción concreta: "El sistema debe permitir que [actor] [acción]..."

## 3. Requisitos No Funcionales

| ID     | Categoría (rendimiento, seguridad, usabilidad, etc.) | Descripción |
|--------|------------------------------------------------------|-------------|
| RNF-01 | Seguridad | El sistema debe requerir autenticacion mediante usuario y contraseña para acceder. |
| RNF-02 | Seguridad | El sistema debe proteger la informacion de los usuarios y pedidos contra accesos no autorizados. |
| RNF-03 | Rendimiento | El sistema debe responder a las acciones de los usuarios en un tiempo maximo de 3 segundos. |
| RNF-04 | Rendimiento | El sistema debe permitir multiples usuarios en simultaneo sin empeorar el rendimiento. |
| RNF-05 | Usabilidad | El sistema debe contar con una interfaz simple e intuitiva. |
| RNF-06 | Usabilidad | El sistema debe mostrar mesajes claros ante errores. |
| RNF-07 | Compatibilidad | El sistema debe ser accesible desde distintos dispositivos (PC, tablet, celular). |
| RNF-08 | Compatibilidad | El sistema debe ser compatible con los navegadores mas utilizados. |


## 4. Historias de Usuario

| ID    | Como...       | Quiero...                  | Para...                            |
|-------|---------------|----------------------------|------------------------------------|
| HU-01 | Empleado      | Realizar pedido            | Para crear un borrador,antes de confirmar el pedido.|
| HU-02 | Empleado      | Confirmar Pedido           | Para poder validar y enviar notificacion con los detalles.|
| HU-03 | Empelado      | Eliminar Pedido            | En caso de error o falla cancela el pedido.|
| HU-04 | Empelado      | Modificar Pedido           | realizar cambios previo o post confirmacion. |
| HU-05 | Empleado      | Consultar el menu semanal  | Seleccionar las viandas de la semana. |            
| HU-06 | Empleado      | configurar dias de asistencia | Deteminar que dias debo seleccionar vianda. |
| HU-07 | Administrador | Agregar borrador menu         | Para poder cargar un menu,previo a que lo vean los usuarios.|
| HU-08 | Administrador | Editar      Menu                   | Para poder realizar cambios en el menu.|
| HU-09 | Administrador | Eliminar    Menu                   | Para poder descartar un menu.|
| HU-10 | Administrador | Confirmar   Menu                   |Permitir el acceso a los empleados al menu.|
| HU-11 | Administrador | Verificar la disponibilidad de las viandas | Avisar en caso de quedar sin stock |
| HU-12 | System       | Generar la tabla consolidado diario | Para llevar un registro de las viandas que deben realizarse cada dias.|
| HU-13 | System       | Notificar pedido al Administrador.| Para que  el administrador reciba una notificacion  con los detalles de los pedidos confirmados.|
## 5. Diagrama de Casos de Uso

> Insertar imagen del diagrama exportado desde Draw.io, Lucidchart, StarUML o similar.  
> Guardar la imagen en esta misma carpeta (`docs/`) y referenciarla abajo.

![Diagrama de Casos de Uso](./Diagrama_caso_de_%20uso(5).png)

## 6. Especificación de Casos de Uso


| Campo | Detalle |
|--|--|
| **Actor principal** | Empleado |
| **Descripción** | Mantener datos actualizados |
| **Precondiciones** | Tener una cuenta creada y haber iniciado sesión. |
| **Postcondiciones (criterios de aceptación)** | Datos actualizados |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |

| Campo | Detalle |
|---|---|
| **Actor principal** | Empleado |
| **Descripción** | Configurar asistencia |
| **Precondiciones** | haber iniciado sesión en el sistema |
| **Postcondiciones (criterios de aceptación)** | Podra seleccionar una vianda para los dias que asistira |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario debe ingresar al apartado seleccionar dias de asistencia | En caso de haber cometido un error podra editarlo  |
| 2. Debe seleccionar los dias que asistira a la empresa  |  |
| 3. Debe confirmar los dias seleccionados |  |


| Campo | Detalle |
|--|--|
| **Actor principal** | Empleado |
| **Descripción** |Consultar menu|
| **Precondiciones** | El usuario debe haber registrado los dias de asistencia |
| **Postcondiciones (criterios de aceptación)** | El empleado puede visualizar el menu de una forma correcta |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|--|--|
| 1. El empleado ingresa al apartado de menú | |
| 2. El sistema verifica la disponibilidad del menú |No hay menú disponible |
| 3. El sistema muestra el menu con las viandas disponibles | |

| Campo | Detalle |
|---|---|
| **Actor principal** |Administrador|
| **Descripción** |Verificar Stock: disponibilidad de las viandas para avisar en caso de quedar sin stock. |
| **Precondiciones** |Tener un usuario en el sistema,iniciar sesion como Administrador. |
| **Postcondiciones (criterios de aceptación)** | Permite realizar pedidos, debido que hay stock |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |


| Campo | Detalle |
|--|--|
| **Actor principal** |Administrador|
| **Descripción** |Consultar pedido:Determinar la cantidad de viandas de cada tipo a realizar |
| **Precondiciones** |Tener un usuario en el sistema,iniciar sesion como Administrador, Debe haber un registro de pedido confirmado. |
| **Postcondiciones (criterios de aceptación)** | Una vez consultado, puede vizulizar los detalles de los pedidos realizados. |



| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. Tiene que ir a la seccion de consulta pedidos | |
| 2.  | |
| 3.  |  |

| Campo | Detalle |
|---|---|
| **Actor principal** |Empleado |
| **Descripción** | Realizar pedido |
| **Precondiciones** |El empleado debe haber iniciado sesión y tener un menú disponible para realizar el pedido..|
| **Postcondiciones (criterios de aceptación)** | El pedido queda realizado correctamente |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede a la tabla de menu semanal | En caso de no existir un menú cargado, el sistema informará que no hay disponibilidad |
| 2. El usuario visualiza las opciones de viandas disponibles | En caso de no haber stock de una vianda, el sistema lo notificara |
| 3. El usuario selecciona la vianda de los dias que asistira | En caso de seleccionar una opcion incorrecta la podra modificar |
| 4. El usuario realiza el pedido | En caso de querer cancelar el pedido, podra eliminarlo |
| 5. El sistema registra el pedido realizado |  |

| Campo | Detalle |
|---|---|
| **Actor principal** |Empleado |
| **Descripción** | Confirmar pedido |
| **Precondiciones** |El empleado debe haber realizado un pedido |
| **Postcondiciones (criterios de aceptación)** | El pedido queda confirmado correctamente |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede a seccion de pedidos ||
| 2. El usuario visualiza el pedido realizado | En caso de no existir un pedido, el sistema lo notificara |
| 3. El usuario verifica los datos del pedido | En caso de que el pedido tenga un error, podra modificar el pedido |
| 4. El usuario confirma el pedido ||
| 5. El sistema registra la confirmacion del pedido | En caso de que el sistema tenga un error, el pedido no podra confirmarse |

| Campo | Detalle |
|---|---|
| **Actor principal** | Empleado |
| **Descripción** | Modificar pedido |
| **Precondiciones** | Tener un pedido cargado |
| **Postcondiciones (criterios de aceptación)** | Confirmar pedido |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede al apartado de pedidos | En caso de no existir pedidos registrados el sistema informará al usuario |
| 2. El usuario selecciona el pedido que desea modificar | |
| 3. El usuario realiza los cambios correspondientes | En caso de querer cancelar la modificación el pedido quedará igual |

| Campo | Detalle |
|---|---|
| **Actor principal** | Empleado |
| **Descripción** | Eliminar pedido |
| **Precondiciones** | Tener un pedido registrado |
| **Postcondiciones (criterios de aceptación)** | Pedido eliminado correctamente |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. El usuario accede al apartado de pedidos | En caso de no existir pedidos registrados el sistema informará al usuario |
| 2. El usuario selecciona el pedido que desea eliminar | |
| 3. El sistema solicita confirmación para eliminar el pedido | |

| Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Modificar menu |
| **Precondiciones** | Debe haber una tabla de menu semanal cargada |
| **Postcondiciones (criterios de aceptación)** | El empleado  debe visualizar la tabla actualizada |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. Ingresa al apartado menu semanal | Si cancela la modificacion la tabla quedara comoestaba |
| 2. Selecciona la tabla a modificar |  |
| 3. Realizalos cambios  |  |
| 4. Confirma los cambios |  |

| Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Confirmar menu |
| **Precondiciones** | Se debe estar modificndo una tabla o subiendo un borrador |
| **Postcondiciones** (criterios de aceptación)* | El empleado podra visualizar la nueva tabla |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2. |  |
| 3. |  |
| 4. |  |

|Campo | Detalle |
|---|---|
| **Actor principal** | Administrador |
| **Descripción** | Eliminar menu semanal |
| **Precondiciones** |  Que haya menu semanal cargado |
| **Postcondiciones** (criterios de aceptación)* | Tabla de menu semanal eliminada  |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.El administrador carga la tabla del menú semanal |El menú tiene campos vacíos, el sistema no permite cargarlo |
| 2.El administrador elimina la tabla del menú semanal |  |
| 3. |  |
| 4. |  |

> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
