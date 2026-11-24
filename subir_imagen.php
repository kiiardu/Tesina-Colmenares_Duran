<?php
/* Recibe las fotos de los servicios desde el panel de administración.
   - Subir:  POST con un archivo "foto"       -> guarda en imagenes/servicios/ y devuelve la ruta
   - Borrar: POST accion=borrar&ruta=...      -> borra una foto de esa misma carpeta */

header('Content-Type: application/json; charset=utf-8');

function fin($ok, $datos = []){ echo json_encode(['ok' => $ok] + $datos); exit; }

$carpeta = __DIR__ . '/imagenes/servicios/';
if(!is_dir($carpeta) && !mkdir($carpeta, 0755, true)) fin(false, ['error' => 'No se pudo crear la carpeta de fotos']);

/* ---- Borrar ---- */
if(($_POST['accion'] ?? '') === 'borrar'){
    $ruta = $_POST['ruta'] ?? '';
    if(!preg_match('#^imagenes/servicios/[a-z0-9]+\.(jpg|png|webp)$#', $ruta)) fin(false, ['error' => 'Ruta inválida']);
    $archivo = __DIR__ . '/' . $ruta;
    if(is_file($archivo)) unlink($archivo);
    fin(true);
}

/* ---- Subir ---- */
if(!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK){
    fin(false, ['error' => 'No llegó la foto (¿pesa demasiado?)']);
}
$f = $_FILES['foto'];
if($f['size'] > 8 * 1024 * 1024) fin(false, ['error' => 'La foto pesa más de 8 MB']);

$info  = @getimagesize($f['tmp_name']);
$tipos = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
if(!$info || !isset($tipos[$info[2]])) fin(false, ['error' => 'Solo se aceptan fotos JPG, PNG o WEBP']);

$nombre = bin2hex(random_bytes(8)) . '.' . $tipos[$info[2]];
if(!move_uploaded_file($f['tmp_name'], $carpeta . $nombre)) fin(false, ['error' => 'No se pudo guardar la foto']);

fin(true, ['ruta' => 'imagenes/servicios/' . $nombre]);
?>