<?php
/* Catálogo (servicios, categorías, profesionales y fotos) guardado en la base de datos.
   - GET  -> devuelve el catálogo en JSON (o null si todavía no se guardó nada)
   - POST -> recibe el catálogo en JSON y lo guarda
   La tabla "catalogo" se crea sola la primera vez. */

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/conexion.php';
$conn->set_charset('utf8mb4');

$conn->query("CREATE TABLE IF NOT EXISTS catalogo (
    id INT NOT NULL PRIMARY KEY,
    datos LONGTEXT NOT NULL
)");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $json = file_get_contents('php://input');
    $d = json_decode($json, true);
    if(!is_array($d) || !isset($d['servicios']) || !isset($d['profesionales']) || !is_array($d['servicios']) || !is_array($d['profesionales'])){
        echo json_encode(['ok' => false, 'error' => 'Datos inválidos']); exit;
    }
    $st = $conn->prepare("REPLACE INTO catalogo (id, datos) VALUES (1, ?)");
    $st->bind_param('s', $json);
    echo json_encode(['ok' => (bool)$st->execute()]);
    exit;
}

$fila = $conn->query("SELECT datos FROM catalogo WHERE id = 1")->fetch_assoc();
echo $fila ? $fila['datos'] : 'null';
?>