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


 HU-1 como Empleado quiero Registrarme para tener un usuario en el sistema.
 HU-2 como Empleado quiero iniciar Sesion para poder ingresar al sistema con mi perfil.
 HU-3 como Empleado quiero Mantener datos actualizados para poder tener la informacion constantemente actualizada.
 HU-4 como Empleado quiero realizar, modificar y eliminar pedidos para poder pedir la vianda del dia.
HU-5 Como empleado quiero Consultar el menu para ver que opciones hay disponibles para comer.
HU-6 Como empleado quiero configurar los dias de asistencia pata organizar el menu semanal.
HU-7 Como administrador quiero  Registrarme para tener un usuario.
HU-8 Como administrador quiero iniciar sesion para acceder al sistema y gestionar los pedidos.
HU-9 como administrador quiero agregar, modificar y eliminar  un menu semanal para notificar a los empleados sobre los tipos de viandas disponibles en la semana.
HU-10 como administrador quiero gestionar los pedidos de los empleados para poder contabilizar la cantidad de unidades de cada vianda que se solicitaron. 
HU-11 como administrador quiero verificar la disponibilidad de las viandas para avisar a los empleados cuando alguna no este disponible.
HU-12 como Externo quiere notificar sobre los detalles de los pedidos correspondientes al administrador.







## 2. Requisitos Funcionales

| ID    | Descripción                                                                        | Actor          | HU relacionada |
|-------|------------------------------------------------------------------------------------|----------------|----------------|
| RF-01 |El sistema debe permitir Debe registrarse para poder acceder al sistema, le pedira datos personales.         |empelado        |  HU-1              |
| RF-02 |El sistema debe permitir iniciar secion con las credenciales del usuario para poder entrar.                  |empleado        |  HU-2              |
| RF-03 |El sistema debe permitir Mantener datos actualizados para poder ver siempre la informacion de usuario al dia.|empleado        |  HU-3              |
| RF-04 |El sistema debe permitir Modificar Pedidos debe permitir cambiar o seleccionar otra opcion de pedido.        |empleado        |  HU-4              |
| RF-05 |El sistema debe permitir Confirmar pedido debe permitir reservar y demostrar que todo salio correcto.        |empleado        |  HU-4              |
| RF-06 |El sistema debe permitir Cancelar pedido debe Cancelar el pedido en caso de error o inconveniente.           |empleado        |  HU-4              |
| RF-07 |El sistema debe permitir que el empleado realice un pedido de vianda                |empleado        | HU-4               |
| RF-08 |El sistema debe permitir que el empleado consulte el menu disponible                |empleado        | HU-5               |
| RF-09 |El sistema debe permitir que el empleado configure sus dias de asistencia           |empleado        | HU-6               |
| RF-10 |El sistema debe permitir que el administrador se registre en el sistema             |Administrador   | HU-7               |
| RF-11 |El sistema debe permitir que el administrador gestione los pedidos                  |Administrador   | HU-10               |
| RF-12 |El sistema debe permitir agregar un menu para cargar las viandas que habra semanalmente |Administrador|  HU-9             |
| RF-13 |El sistema debe permitir modificar el menu semanal para poder corregir errores o solucionar inconvenientes que surjan en el momento. |Administrador |  HU-9       |          
| RF-14 |El sistema debe permitir eliminar el menu semanal para poder cargar el nuevo |Administrador           | HU-9               |
| RF-15 |El sistema debe poder notificar al administrador sobre los detalles de los pedidos confirmados|Externo| HU-12 |
| RF-16 |El sistema debe permitir verificar la disponibilidad de las viandas para avisar en caso de quedar sin stock. |Administrador |   HU-11      |
| RF-17 |El sistema debe permitir el pedido.                                                  |empelado       | HU-4              |

> Cada requisito debe describir una acción concreta: "El sistema debe permitir que [actor] [acción]..."

## 3. Requisitos No Funcionales

| ID     | Categoría (rendimiento, seguridad, usabilidad, etc.) | Descripción |
|--------|------------------------------------------------------|-------------|
| RNF-01 |                                                      |             |
| RNF-02 |                                                      |             |

## 4. Historias de Usuario

| ID    | Como...       | Quiero...                  | Para...                            |
|-------|---------------|----------------------------|------------------------------------|
| HU-01 | [rol/actor]   | [acción o funcionalidad]   | [beneficio o resultado esperado]   |
| HU-02 |               |                            |                                    |

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
