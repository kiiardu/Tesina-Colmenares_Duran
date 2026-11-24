-- Para bases de datos que ya estaban creadas antes de esta versión.
-- Ejecutar una sola vez en phpMyAdmin (base `dandelion` -> pestaña SQL).
-- Agrega la duración total de cada turno, para que los horarios se bloqueen
-- mientras dure el servicio (y no solo en la hora de inicio).
ALTER TABLE turnos ADD COLUMN IF NOT EXISTS duracion INT NULL;
