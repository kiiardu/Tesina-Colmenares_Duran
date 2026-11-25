<?php
/* Estado del negocio guardado en la base de datos: turnos reservados, horarios y días bloqueados.
   - GET  -> devuelve el estado completo en JSON (o null si todavía no hay nada)
   - POST -> recibe SOLO lo que cambió y lo mezcla con lo que ya hay (así dos personas
             que usan el sitio a la vez no se pisan). Devuelve el estado ya mezclado.
   Además, si un turno se cancela, también se marca como cancelado en la tabla `turnos`.
   La tabla "estado_app" se crea sola la primera vez. */

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/conexion.php';
$conn->set_charset('utf8mb4');

$conn->query("CREATE TABLE IF NOT EXISTS estado_app (
    id INT NOT NULL PRIMARY KEY,
    datos LONGTEXT NOT NULL
)");

/* Marca como cancelado el turno de la tabla `turnos` (se busca por fecha, hora y teléfono) */
function cancelarEnBD($conn, $r){
    $fecha = $r['dateKey'] ?? ''; $hora = $r['slot'] ?? ''; $tel = $r['tel'] ?? '';
    if(!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha) || !preg_match('/^\d{2}:\d{2}$/', $hora) || $tel === '') return;
    try{
        $st = $conn->prepare("UPDATE turnos SET estado = 'cancelado'
                              WHERE fecha = ? AND hora = ? AND COALESCE(estado, '') <> 'cancelado'
                                AND id_cliente IN (SELECT id_cliente FROM clientes WHERE telefono = ?)");
        $st->bind_param('sss', $fecha, $hora, $tel);
        $st->execute();
    }catch(Throwable $e){ /* si falla, el estado igual queda guardado */ }
}

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    $fila = $conn->query("SELECT datos FROM estado_app WHERE id = 1")->fetch_assoc();
    echo $fila ? $fila['datos'] : 'null';
    exit;
}

$entrada = json_decode(file_get_contents('php://input'), true);
if(!is_array($entrada)){ echo json_encode(['ok' => false, 'error' => 'Datos inválidos']); exit; }

$conn->begin_transaction();
$conn->query("INSERT IGNORE INTO estado_app (id, datos) VALUES (1, '{}')");
$fila = $conn->query("SELECT datos FROM estado_app WHERE id = 1 FOR UPDATE")->fetch_assoc();
$actual = json_decode($fila['datos'] ?? '{}', true);
if(!is_array($actual)) $actual = [];
$actual += ['horarios' => [], 'bloqueos' => [], 'nuevos' => []];

/* Horarios y días bloqueados: se reemplaza lo de cada profesional que llegó */
foreach(['horarios', 'bloqueos'] as $k){
    if(isset($entrada[$k]) && is_array($entrada[$k])){
        foreach($entrada[$k] as $pro => $valor){
            if(preg_match('/^[A-Za-z0-9_]+$/', (string)$pro)) $actual[$k][$pro] = $valor;
        }
    }
}

/* Turnos: se agregan los nuevos; si un turno ya estaba, "cancelado" siempre gana */
if(isset($entrada['nuevos']) && is_array($entrada['nuevos'])){
    $posicion = [];
    foreach($actual['nuevos'] as $i => $r){ if(isset($r['id'])) $posicion[$r['id']] = $i; }
    foreach($entrada['nuevos'] as $r){
        if(!is_array($r) || empty($r['id'])) continue;
        $id = $r['id'];
        $llegaCancelado = ($r['status'] ?? '') === 'cancelled';
        if(isset($posicion[$id])){
            $i = $posicion[$id];
            $yaCancelado = ($actual['nuevos'][$i]['status'] ?? '') === 'cancelled';
            if($llegaCancelado && !$yaCancelado) cancelarEnBD($conn, $r);
            $r['status'] = ($llegaCancelado || $yaCancelado) ? 'cancelled' : ($r['status'] ?? 'confirmed');
            $actual['nuevos'][$i] = $r;
        } else {
            if($llegaCancelado) cancelarEnBD($conn, $r);
            $actual['nuevos'][] = $r;
            $posicion[$id] = count($actual['nuevos']) - 1;
        }
    }
}

$json = json_encode($actual, JSON_UNESCAPED_UNICODE);
$st = $conn->prepare("REPLACE INTO estado_app (id, datos) VALUES (1, ?)");
$st->bind_param('s', $json);
$st->execute();
$conn->commit();

echo json_encode(['ok' => true, 'estado' => $actual], JSON_UNESCAPED_UNICODE);
?>
