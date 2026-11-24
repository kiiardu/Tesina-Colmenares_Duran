<?php
/* Envío de correos por SMTP, sin librerías externas. */

function smtpLeer($f){
    $r = '';
    while(($l = fgets($f, 515)) !== false){
        $r .= $l;
        if(strlen($l) < 4 || $l[3] === ' ') break;   // última línea de la respuesta
    }
    return $r;
}

function smtpCmd($f, $cmd, $esperado){
    if($cmd !== null) fwrite($f, $cmd . "\r\n");
    $r = smtpLeer($f);
    if(strpos($r, (string)$esperado) !== 0){
        throw new Exception("Servidor de correo: se esperaba $esperado y respondió: " . trim($r));
    }
    return $r;
}

function enviarCorreo(array $cfg, string $para, string $asunto, string $html): void {
    if(!filter_var($para, FILTER_VALIDATE_EMAIL)) throw new Exception("Email inválido: $para");

    $desde = $cfg['desde'] ?: $cfg['usuario'];
    $proto = ($cfg['seguridad'] === 'ssl') ? 'ssl://' : 'tcp://';
    $f = @stream_socket_client($proto . $cfg['host'] . ':' . $cfg['puerto'], $errno, $errstr, 15);
    if(!$f) throw new Exception("No se pudo conectar al servidor de correo ($errstr)");
    stream_set_timeout($f, 15);

    try{
        smtpCmd($f, null, 220);
        smtpCmd($f, 'EHLO localhost', 250);
        if(!empty($cfg['usuario'])){
            smtpCmd($f, 'AUTH LOGIN', 334);
            smtpCmd($f, base64_encode($cfg['usuario']), 334);
            smtpCmd($f, base64_encode($cfg['clave']), 235);
        }
        smtpCmd($f, "MAIL FROM:<$desde>", 250);
        smtpCmd($f, "RCPT TO:<$para>", 250);
        smtpCmd($f, 'DATA', 354);

        $b64 = fn($t) => '=?UTF-8?B?' . base64_encode($t) . '?=';
        $cabeceras = [
            'Date: ' . date('r'),
            'From: ' . $b64($cfg['nombre']) . " <$desde>",
            "To: <$para>",
            'Subject: ' . $b64($asunto),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
        ];
        fwrite($f, implode("\r\n", $cabeceras) . "\r\n\r\n" . chunk_split(base64_encode($html)) . "\r\n.\r\n");
        smtpCmd($f, null, 250);
        @fwrite($f, "QUIT\r\n");
    } finally {
        fclose($f);
    }
}
?>
