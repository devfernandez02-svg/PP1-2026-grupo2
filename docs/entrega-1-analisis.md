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


## 2. Requisitos Funcionales

| ID    | Descripción                                                                        | Actor          | HU relacionada |
|-------|------------------------------------------------------------------------------------|----------------|----------------|
| RF-01 |El sistema debe permitir Debe registrarse para crear un usuario.         |empelado        |  HU-1              |
| RF-02 |El sistema debe permitir iniciar secion con las credenciales del usuario para poder entrar al sistema.                  |empleado        |  HU-2              |
| RF-03 |El sistema debe permitir Mantener datos actualizados para poder ver siempre la informacion de usuario al dia.|empleado        |  HU-3              |
| RF-04 |El sistema debe permitir Modificar Pedidos debe permitir cambiar o seleccionar otra opcion de pedido.        |empleado        |  HU-4              |
| RF-05 |El sistema debe permitir Confirmar pedido debe permitir reservar y demostrar que todo salio correcto.        |empleado        |  HU-4              |
| RF-06 |El sistema debe permitir Cancelar pedido debe Cancelar el pedido en caso de error o inconveniente.           |empleado        |  HU-4              |
| RF-07 |El sistema debe permitir que el empleado realice un pedido de vianda                |empleado        | HU-4               |
| RF-08 |El sistema debe permitir que el empleado consulte el menu disponible                |empleado        | HU-5               |
| RF-09 |El sistema debe permitir que el empleado configure sus dias de asistencia           |empleado        | HU-6               |
| RF-10 |El sistema debe permitir que el administrador se registre en el sistema, para crear un usuario             |Administrador   | HU-7               |
| RF-11 |El sistema debe permitir que el administrador gestione los pedidos                  |Administrador   | HU-10               |
| RF-12 |El sistema debe permitir agregar un menu para cargar las viandas que habra semanalmente |Administrador|  HU-9             |
| RF-13 |El sistema debe permitir modificar el menu semanal para poder corregir errores o solucionar inconvenientes que surjan en el momento. |Administrador |  HU-9       |          
| RF-14 |El sistema debe permitir eliminar el menu semanal para poder cargar el nuevo |Administrador           | HU-9               |
| RF-15 |El sistema debe poder notificar al administrador sobre los detalles de los pedidos confirmados|Externo| HU-12 |
| RF-16 |El sistema debe permitir verificar la disponibilidad de las viandas para avisar en caso de quedar sin stock. |Administrador |   HU-11      |
| RF-17 |El sistema debe permitir inicair sesion para ingresar al sistema con su usuario | administrador      | HU-4              |

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
| HU-01 | Empleado      | Registrarme                | Tener un usuario en el sistema     |
| HU-02 | Empleado      | Iniciar Sesion             | Ingresar al sistema con mi usuario |
| HU-03 | Empleado      | Actualizar datos           | Tener la informacion constantemente actualizada |
| HU-04 | Empleado      | Gestionar mi pedido de vianda | Pedir la bianda de cada dia |
| HU-05 | Empleado      | Consultar el menu semanal  | Seleccionar las viandas de la semana |            
| HU-06 | Empleado      | configurar dias de asistencia | Deteminar que dias debo seleccionar vianda |
| HU-07 | Administrador | Registrarme                | Tener un usuario                    |
| HU-08 | Administrador | Iniciar Sesion             | Ingresar al sistema con mi usuario  |
| HU-09 | Administrador | Administre el menu semanal | Notificar a los usuarios los tipos de vianda disponibles |
| HU-10 | Administrador | Gestione los pedidos       | Determinar la cantidad de viandas de cada tipo a realizar |
| HU-11 | Administrador | Verificar la disponibilidad de las viandas | Avisar en caso de quedar sin stock |
| HU-12 | Externo       | Notificar al administrador cuando los pedidos sean confirmados| Facilitar el conteo de las viandas a realizar o poder avisar a los empleados cuando alguna vianda quede sin stock |

## 5. Diagrama de Casos de Uso

> Insertar imagen del diagrama exportado desde Draw.io, Lucidchart, StarUML o similar.  
> Guardar la imagen en esta misma carpeta (`docs/`) y referenciarla abajo.

![Diagrama de Casos de Uso](./diagrama-casos-de-uso.png)

## 6. Especificación de Casos de Uso































































































### CU-01 — [Nombre del caso de uso]



































| Campo | Detalle |
|---|---|
<<<<<<< HEAD
| **Actor principal** |  Administrador |
| **Descripción** | Gestion de tabla-menu semanal|
| **Precondiciones** |Iniciar sesión como administrador|
| **Postcondiciones (criterios de aceptación)** | se sube la tabla de menu semanal |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. el usuario accede al apartado de menu semanal|si hay una tabla subida el usiario debera eliminarla anted de subir la nueva |
| 2. el usuario añade un menu semanal  |en caso de colocar un dato erroneo y que el sistema lo detecte no permitira que suba a la tabla y marcara el dato en rojo |
| 3. el usuario confirma la tabla |en caso de haber colocado un dato mal, el usuario podra modificar la tabla a voluntad |

|
=======
| **Actor principal** | Empleado |
| **Descripción** | Mantener datos actualizados |
| **Precondiciones** | Tener una cuenta creada y haber iniciado secion |
| **Postcondiciones (criterios de aceptación)** | Datos actualizados |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |

---

> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
| Campo | Detalle |
|--|--|
| **Actor principal** | Empleado |
| **Descripción** | Permite al empleado consultar el menu disponible del sistema |
| **Precondiciones** | El usuario debe haber egistrado los dias de asistencia |
| **Postcondiciones (criterios de aceptación)** | El empleado puede visualizar el menu de una forma correcta |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|--|--|
| 1. El empleado ingresa al apartado de menú | |
| 2. El sistema verifica la disponibilidad del menú |No hay menú disponible |
| 3. El sistema muestra el menu con las viandas disponibles | |






| Campo | Detalle |
|---|---|
<<<<<<< HEAD
| **Actor principal** |  Administrador |
| **Descripción** | Gestion de tabla-menu semanal|
| **Precondiciones** |Iniciar sesión como administrador|
| **Postcondiciones (criterios de aceptación)** | se sube la tabla de menu semanal |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1. el usuario accede al apartado de menu semanal|si hay una tabla subida el usiario debera eliminarla anted de subir la nueva |
| 2. el usuario añade un menu semanal  |en caso de colocar un dato erroneo y que el sistema lo detecte no permitira que suba a la tabla y marcara el dato en rojo |
| 3. el usuario confirma la tabla |en caso de haber colocado un dato mal, el usuario podra modificar la tabla a voluntad |

|
=======
| **Actor principal** | Empleado |
| **Descripción** | Mantener datos actualizados |
| **Precondiciones** | Tener una cuenta creada y haber iniciado secion |
| **Postcondiciones (criterios de aceptación)** | Datos actualizados |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |

---

> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
| Campo | Detalle |
|--|--|
| **Actor principal** | Empleado |
| **Descripción** | Permite al empleado consultar el menu disponible del sistema |
| **Precondiciones** | El usuario debe haber egistrado los dias de asistencia |
| **Postcondiciones (criterios de aceptación)** | El empleado puede visualizar el menu de una forma correcta |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|--|--|
| 1. El empleado ingresa al apartado de menú | |
| 2. El sistema verifica la disponibilidad del menú |No hay menú disponible |
| 3. El sistema muestra el menu con las viandas disponibles | |
| 1. Tiene que ir a la seccion de consulta pedidos | |
| 2.  | |
| 3.  |  |


| Campo | Detalle |
|---|---|
| **Actor principal** |Administrador|
| **Descripción** |Verificar Stock: disponibilidad de las viandas para avisar en caso de quedar sin stock. |
| **Precondiciones** |Tener un usuario en el sistema,iniciar sesion como Administrador. |
| **Postcondiciones (criterios de aceptación)** | Permite realizar pedidos, debido que hay stock |