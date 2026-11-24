<?php
include("conexion.php");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
header("Content-Type: application/json; charset=utf-8");

$usuarioPorCategoria = [
    "peluqueria"   => "veroyaide",
    "manicuria"    => "micaela",
    "maquillaje"   => "martinamaq",
    "dermatologia" => "iara",
    "lashista"     => "martinalash",
];

$categoria = $_GET["categoria"] ?? "";
if (!isset($usuarioPorCategoria[$categoria])) { echo "[]"; exit; }
$usuario = $usuarioPorCategoria[$categoria];

$stmt = $conn->prepare("
    SELECT t.fecha,
           TIME_FORMAT(t.hora, '%H:%i') AS hora,
           COALESCE(t.duracion, s.duracion, 60) AS duracion
    FROM turnos t
    JOIN profesionales p ON p.id_profesional = t.id_profesional
    LEFT JOIN servicios s ON s.id_servicio = t.id_servicio
    WHERE p.usuario = ?
      AND t.fecha >= CURDATE()
      AND COALESCE(t.estado, '') <> 'cancelado'
");
$stmt->bind_param("s", $usuario);
$stmt->execute();
echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
?>
