# Entrega 1 — Análisis del Sistema

**Grupo**: [Grupo 2]  
**Proyecto**: [Sistema de gestion de Pedios Almuerzo]  
**Fecha de entrega**: 30/04/26

---

## 1. Identificación de Actores

| Actor | Rol / Función en el sistema | Tipo (usuario final, sistema externo, etc.) |
|-------|-----------------------------|---------------------------------------------|
| Empleado      |    Iniciar Sesion, registrarme         |   Usuario Final          |
| Empleado      |    Mantener Datos actualizado          |   Usuario Final          |
| Empleado      |    gestionar Pedidos                   |   Usuario Final          |
| Empleado      |    Consultar menu(semanal)             |   Usuario Final          |     
| Empleado      |    Configurar dias de Asistencia       |   Usuario Final          |
|Administradores|    Registrarse,iniciar sesion          |   Administrador          |
|Administradores|    gestionar Menu(semanal)             |   Administrador          ||
|Administradores|    Gestionar Pedidos                   |   Administrador          |
|Administradores|    Verificar Disponibilidad            |   Administrador          |


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
| RNF-01 |                                                      |             |
| RNF-02 |                                                      |             |

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
| **Actor principal** | |
| **Descripción** | |
| **Precondiciones** | |
| **Postcondiciones (criterios de aceptación)** | |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |

---

> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
