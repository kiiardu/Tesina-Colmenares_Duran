<?php
/* Envía por mail el recordatorio de los turnos de MAÑANA (solo a quienes dejaron su email).
   Se ejecuta una vez por día con el Programador de tareas de Windows, o a mano desde el
   navegador:  http://localhost/Dandelion_Paquete_17-06/enviar_recordatorios.php?clave=TU_CLAVE_WEB */

header('Content-Type: text/plain; charset=utf-8');

function salir($msg){ echo $msg . "\n"; exit; }

$ruta = __DIR__ . '/config_correo.php';
if(!file_exists($ruta)) salir('Falta config_correo.php (copiá config_correo.ejemplo.php y completalo).');
$cfg = require $ruta;

if(PHP_SAPI !== 'cli' && (($_GET['clave'] ?? '') !== $cfg['clave_web'])){
    http_response_code(403);
    salir('No autorizado.');
}
if(empty($cfg['activo'])) salir("Los recordatorios están desactivados (poné 'activo' => true en config_correo.php).");

include __DIR__ . '/conexion.php';
include __DIR__ . '/correo.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$dias  = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
$meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

$res = $conn->query("
    SELECT t.id_turno, t.fecha, TIME_FORMAT(t.hora, '%H:%i') AS hora,
           c.nombre, c.email,
           s.nombre AS servicio, p.nombre AS profesional
    FROM turnos t
    JOIN clientes c ON c.id_cliente = t.id_cliente
    LEFT JOIN servicios s ON s.id_servicio = t.id_servicio
    LEFT JOIN profesionales p ON p.id_profesional = t.id_profesional
    WHERE t.fecha = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      AND COALESCE(t.estado, '') = 'confirmado'
      AND t.recordatorio_enviado = 0
      AND c.email IS NOT NULL AND c.email <> ''
");

$enviados = 0; $fallidos = 0;
while($t = $res->fetch_assoc()){
    $f = new DateTime($t['fecha']);
    $fecha = $dias[(int)$f->format('w')] . ' ' . $f->format('j') . ' de ' . $meses[(int)$f->format('n') - 1];
    $h = fn($x) => htmlspecialchars((string)$x, ENT_QUOTES, 'UTF-8');

    $cuerpo = "<div style=\"font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#2e2420\">"
            . "<h2 style=\"color:#b07a80\">🌼 Dandelión Estética</h2>"
            . "<p>Hola <b>{$h($t['nombre'])}</b>, te recordamos tu turno de mañana:</p>"
            . "<p><b>{$h($t['servicio'])}</b><br>{$h($fecha)} a las <b>{$h($t['hora'])} hs</b>"
            . ($t['profesional'] ? "<br>Con {$h($t['profesional'])}" : '') . "</p>"
            . "<p>Si no podés venir, avisanos con tiempo. ¡Te esperamos!</p></div>";

    try{
        enviarCorreo($cfg, $t['email'], 'Recordatorio de tu turno de mañana - Dandelión Estética', $cuerpo);
        $up = $conn->prepare('UPDATE turnos SET recordatorio_enviado = 1 WHERE id_turno = ?');
        $up->bind_param('i', $t['id_turno']);
        $up->execute();
        $enviados++;
        echo "OK     {$t['email']}\n";
    }catch(Exception $e){
        $fallidos++;
        echo "ERROR  {$t['email']}: " . $e->getMessage() . "\n";
    }
}
echo "\nRecordatorios enviados: $enviados | con error: $fallidos\n";
?>
