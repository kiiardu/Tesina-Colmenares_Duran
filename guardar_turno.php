<?php
include("conexion.php");

// Que los errores de MySQL lancen excepciones (así se pueden atrapar con try/catch)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos) {
    echo "Archivo listo para recibir turnos";
    exit;
}

$nombre    = trim($datos["nombre"] ?? "");
$apellido  = trim($datos["apellido"] ?? "");
$telefono  = trim($datos["telefono"] ?? "");
$email     = trim($datos["email"] ?? "");
$fecha     = $datos["fecha"] ?? "";
$hora      = $datos["hora"] ?? "";
$categoria = $datos["categoria"] ?? "";
$servicio  = trim($datos["servicio"] ?? "");
$duracion  = isset($datos["duracion"]) ? (int)$datos["duracion"] : null;
$duracionTotal = isset($datos["duracion_total"]) ? (int)$datos["duracion_total"] : (int)($duracion ?? 60);
$notas     = trim($datos["notas"] ?? "");

// Validación mínima de lo que llega desde el navegador
if ($nombre === "" || $apellido === "" || $telefono === ""
    || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)
    || !preg_match('/^\d{2}:\d{2}$/', $hora)) {
    echo "error";
    exit;
}
$notas = mb_substr($notas, 0, 300);

// En el sitio, algunos servicios empiezan con un emoji (ej: "🦋 Lifting de pestañas").
// En la base de datos se guardan sin emoji, así que se lo quitamos para poder encontrarlos.
$servicio = preg_replace('/^[^\p{L}\p{N}]+/u', '', $servicio);

try {
    // 1) Clienta: si ya existe (mismo nombre, apellido y teléfono) se reutiliza
    $stmt = $conn->prepare("SELECT id_cliente FROM clientes WHERE nombre = ? AND apellido = ? AND telefono = ? LIMIT 1");
    $stmt->bind_param("sss", $nombre, $apellido, $telefono);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();

    if ($fila) {
        $id_cliente = (int)$fila["id_cliente"];
    } else {
        $stmt = $conn->prepare("INSERT INTO clientes(nombre, apellido, telefono, email) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nombre, $apellido, $telefono, $email);
        $stmt->execute();
        $id_cliente = $conn->insert_id;
    }

    // 2) Profesional según la categoría elegida (usuario de cada profesional en la tabla `profesionales`)
    $usuarioPorCategoria = [
        "peluqueria"   => "veroyaide",
        "manicuria"    => "micaela",
        "maquillaje"   => "martinamaq",
        "dermatologia" => "iara",
        "lashista"     => "martinalash",
    ];
    $id_profesional = null;
    if (isset($usuarioPorCategoria[$categoria])) {
        $usuario = $usuarioPorCategoria[$categoria];
        $stmt = $conn->prepare("SELECT id_profesional FROM profesionales WHERE usuario = ? LIMIT 1");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $fila = $stmt->get_result()->fetch_assoc();
        if ($fila) $id_profesional = (int)$fila["id_profesional"];
    }

    // 3) Servicio: por nombre y duración (hay nombres repetidos, ej: "Semipermanente"); si no, solo por nombre
    $id_servicio = null;
    if ($duracion !== null) {
        $stmt = $conn->prepare("SELECT id_servicio FROM servicios WHERE nombre = ? AND duracion = ? LIMIT 1");
        $stmt->bind_param("si", $servicio, $duracion);
        $stmt->execute();
        $fila = $stmt->get_result()->fetch_assoc();
        if ($fila) $id_servicio = (int)$fila["id_servicio"];
    }
    if ($id_servicio === null) {
        $stmt = $conn->prepare("SELECT id_servicio FROM servicios WHERE nombre = ? LIMIT 1");
        $stmt->bind_param("s", $servicio);
        $stmt->execute();
        $fila = $stmt->get_result()->fetch_assoc();
        if ($fila) $id_servicio = (int)$fila["id_servicio"];
    }

    // Verificar que el horario no se superponga con otro turno de la profesional
    if ($id_profesional !== null) {
        $stmt = $conn->prepare("
            SELECT 1 FROM turnos t
            LEFT JOIN servicios s ON s.id_servicio = t.id_servicio
            WHERE t.id_profesional = ? AND t.fecha = ?
              AND COALESCE(t.estado, '') <> 'cancelado'
              AND TIME_TO_SEC(?) < TIME_TO_SEC(t.hora) + COALESCE(t.duracion, s.duracion, 60) * 60
              AND TIME_TO_SEC(?) + ? * 60 > TIME_TO_SEC(t.hora)
            LIMIT 1");
        $stmt->bind_param("isssi", $id_profesional, $fecha, $hora, $hora, $duracionTotal);
        $stmt->execute();
        if ($stmt->get_result()->fetch_assoc()) { echo "ocupado"; exit; }
    }

    // 4) Turno. La nota de la clienta (alergias, aclaraciones) va en la columna `notas`.
    //    Si la base todavía no tiene esa columna (ver actualizar_bd.sql), el turno se guarda igual.
    $guardado = false;
    try {
        $stmt = $conn->prepare("INSERT INTO turnos(fecha, hora, estado, id_cliente, id_profesional, id_servicio, notas, duracion)
                                VALUES (?, ?, 'confirmado', ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiiisi", $fecha, $hora, $id_cliente, $id_profesional, $id_servicio, $notas, $duracionTotal);
        $stmt->execute();
        $guardado = true;
    } catch (mysqli_sql_exception $e) {
        // sin columna `notas`: se intenta de nuevo sin ella
    }

    if (!$guardado) {
        $stmt = $conn->prepare("INSERT INTO turnos(fecha, hora, estado, id_cliente, id_profesional, id_servicio)
                                VALUES (?, ?, 'confirmado', ?, ?, ?)");
        $stmt->bind_param("ssiii", $fecha, $hora, $id_cliente, $id_profesional, $id_servicio);
        $stmt->execute();
    }

    echo "ok";
} catch (mysqli_sql_exception $e) {
    echo "error";
}
?>
