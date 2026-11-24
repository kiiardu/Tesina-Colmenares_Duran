# Dandelión Estética — Sistema de Gestión y Reserva de Turnos
## DESCRIPCIÓN:
Dandelión Estética es una aplicación web desarrollada para optimizar la administración de un centro de estética. El sistema permite automatizar la agenda de citas, la asignación de profesionales por tratamiento y la autogestión de turnos por parte de las clientas, eliminando la sobreposición de horarios y agilizando la comunicación
## INTEGRANTES:
- Colmenares, Gianna Jazmín 
- Durán Gauna, Kiara Guadalupe
## TECNOLOGÍAS UTILIZADAS:
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Backend:** PHP
- **Base de Datos:** MySQL
- **Herramientas de desarrollo:** Git, GitHub, XAMPP / Visual Studio Code
## FUNCIONALIDADES PRINCIPALES:
- **Gestión de Usuarios:** Registro e inicio de sesión seguro con diferenciación de roles (Administrador/Dueña, Profesional y Clienta).
- **Reserva de Turnos en Tiempo Real:** Selección interactiva de servicio, profesional, fecha y horarios disponibles.
- **Panel de Control para Profesionales:** Consulta de agenda de turnos diarios y bloqueo de días/horarios no disponibles.
- **Gestión de Servicios y Precios:** Panel administrativo para dar de alta, modificar o pausar tratamientos/servicios y tarifas del catálogo.
## ESTRUCTURA DEL PROYECTO:
El sitio está dividido en una página por pantalla. El flujo de reserva de la clienta es `inicio` → `datos` → `categorias` → `servicios` → `turno` → `confirmacion`.

| Archivo | Qué contiene |
|---|---|
| `index.php` | Redirige a `inicio.html` (así `http://localhost/dandelion` sigue funcionando). |
| `inicio.html` | Portada de presentación y pie de página. |
| `datos.html` | Paso 1: datos de la clienta (con validación). |
| `categorias.html` | Paso 2: elección del rubro. |
| `servicios.html` | Paso 3: selección de uno o varios servicios. |
| `turno.html` | Paso 4: calendario, horarios disponibles y confirmación. |
| `confirmacion.html` | Resumen del turno, cancelación y nueva reserva. |
| `profesional.html` | Panel de la profesional: agenda, horario de trabajo y bloqueo de días. |
| `admin.html` | Panel de administración. |
| `styles.css` | Estilos de todo el sitio. |
| `guardar_turno.php`, `turnos_ocupados.php`, `conexion.php`, `dandelion.sql` | Backend y base de datos. `turnos_ocupados.php` devuelve los horarios ya tomados de cada profesional. |
| `actualizar_bd.sql` | Para bases ya creadas: agrega la columna `duracion` a `turnos`. |

JavaScript (carpeta `js/`):

| Archivo | Se usa en | Qué hace |
|---|---|---|
| `config.js` | todas | Profesionales, servicios, nombres de meses/días y funciones auxiliares. |
| `estado.js` | todas | Datos compartidos entre páginas (turnos, bloqueos, horarios y reserva en curso), guardados en el navegador. |
| `componentes.js` | todas | HTML que se repite: login, avisos, alerta de cancelación y pie de página. |
| `comunes.js` | todas | Modo oscuro, login de profesionales y avisos. |
| `reserva-datos.js`, `reserva-categorias.js`, `reserva-servicios.js`, `reserva-turno.js`, `reserva-confirmacion.js` | una página cada uno | Lógica de cada paso de la reserva. |
| `profesional.js` | `profesional.html` | Lógica del panel de la profesional. |
| `admin.js` | `admin.html` | Lógica del panel de administración. |

Como cada página se carga por separado, los datos que deben conservarse al navegar (turnos nuevos, días bloqueados, horarios y el formulario en curso) se guardan con `localStorage` / `sessionStorage` desde `estado.js`.
## CÓMO EJECUTAR EL PROYECTO:
1. **Clonar o descargar** este repositorio en la carpeta local de su servidor web (ejemplo: `C:/xampp/htdocs/dandelion`).
2. **Iniciar los servicios** de Apache y MySQL desde el panel de control de XAMPP.
3. **Crear la base de datos:** - Abrir phpMyAdmin en el navegador: `http://localhost/phpmyadmin`. - Crear una base de datos con el nombre `dandelion`. - Importar el archivo SQL incluido en el proyecto (`dandelion.sql`).
4. **Verificar la conexión:** Comprobar que los parámetros del archivo `conexion.php` coincidan con su credencial local de MySQL (`localhost`, usuario `root`, sin contraseña).
5. **Ejecutar la aplicación:** Abrir el navegador e ingresar a `http://localhost/dandelion`.
## ESTADO DEL PROYECTO
- **Terminado:** Módulo de autenticación (Login/Registro), roles y permisos, interfaz de reserva de turnos, gestión de agenda para profesionales y panel básico de administración.
- **En desarrollo / Mejoras futuras:** Recordatorios por WhatsApp/Email, añadir opción de Gift Card.
