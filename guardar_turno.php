<?php
include("conexion.php");

$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos) {
    echo "Archivo listo para recibir turnos";
    exit;
}

$nombre = $datos["nombre"];
$apellido = $datos["apellido"];
$telefono = $datos["telefono"];
$email = $datos["email"];
$fecha = $datos["fecha"];
$hora = $datos["hora"];
$categoria = $datos["categoria"] ?? "";
$servicio = $datos["servicio"];

$sqlCliente = "INSERT INTO clientes(nombre, apellido, telefono, email)
VALUES ('$nombre', '$apellido', '$telefono', '$email')";

$conn->query($sqlCliente);
$id_cliente = $conn->insert_id;

$sqlProfesional = "SELECT id_profesional FROM profesionales
WHERE especialidad LIKE '%$categoria%' OR nombre LIKE '%$categoria%'
LIMIT 1";

$resProfesional = $conn->query($sqlProfesional);
$profesional = $resProfesional->fetch_assoc();
$id_profesional = $profesional["id_profesional"];

$sqlServicio = "SELECT id_servicio FROM servicios
WHERE nombre = '$servicio'
LIMIT 1";

$resServicio = $conn->query($sqlServicio);
$serv = $resServicio->fetch_assoc();
$id_servicio = $serv["id_servicio"];

$sqlTurno = "INSERT INTO turnos(fecha, hora, estado, id_cliente, id_profesional, id_servicio)
VALUES ('$fecha', '$hora', 'confirmado', $id_cliente, $id_profesional, $id_servicio)";

if ($conn->query($sqlTurno)) {
    echo "ok";
} else {
    echo "error";
}
?>