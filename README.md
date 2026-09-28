# Dandelion Estética — Sistema de Gestión y Reserva de Turnos
## DESCRIPCIÓN:
Dandelion Estética es una aplicación web desarrollada para optimizar la administración de un centro de estética. El sistema permite automatizar la agenda de citas, la asignación de profesionales por tratamiento y la autogestión de turnos por parte de las clientas, eliminando la sobreposición de horarios y agilizando la comunicación
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
## CÓMO EJECUTAR EL PROYECTO:
1. **Clonar o descargar** este repositorio en la carpeta local de su servidor web (ejemplo: `C:/xampp/htdocs/dandelion`).
2. **Iniciar los servicios** de Apache y MySQL desde el panel de control de XAMPP.
3. **Crear la base de datos:** - Abrir phpMyAdmin en el navegador: `http://localhost/phpmyadmin`. - Crear una base de datos con el nombre `dandelion_db`. - Importar el archivo SQL incluido en el proyecto (`dandelion.sql`).
4. **Verificar la conexión:** Comprobar que los parámetros del archivo `conexion.php` coincidan con su credencial local de MySQL (`localhost`, usuario `root`, sin contraseña).
5. **Ejecutar la aplicación:** Abrir el navegador e ingresar a `http://localhost/dandelion`.
## ESTADO DEL PROYECTO
- **Terminado:** Módulo de autenticación (Login/Registro), roles y permisos, gestión de agenda para profesionales y panel básico de administración.
- **En desarrollo / Mejoras futuras:** Mejora en la interfaz de reserva de turnos, recordatorios por WhatsApp/Email.