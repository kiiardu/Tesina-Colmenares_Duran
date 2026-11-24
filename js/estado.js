/* ==========================================================================
   ESTADO — datos compartidos entre las distintas páginas

   Antes todo vivía en memoria dentro de un único index.php. Al separar el
   sitio en varias páginas, cada vez que se navega el JS arranca de cero, así
   que lo que tiene que sobrevivir se guarda en el navegador:

   - localStorage   → datos del negocio: horarios, días bloqueados y turnos
                      nuevos (los ven tanto las clientas como las profesionales).
   - sessionStorage → datos de la sesión actual: el formulario de reserva en
                      curso y la profesional que inició sesión.
   ========================================================================== */

const CLAVE_ESTADO  = 'dandelion_estado';
const CLAVE_RESERVA = 'dandelion_reserva';
const CLAVE_PRO     = 'dandelion_pro';

function leerJSON(storage, clave){
  try{ const t = storage.getItem(clave); return t ? JSON.parse(t) : null; }
  catch(e){ return null; }
}
function escribirJSON(storage, clave, valor){
  try{ storage.setItem(clave, JSON.stringify(valor)); }
  catch(e){ /* almacenamiento no disponible: se sigue sin persistir */ }
}

const guardado = leerJSON(localStorage, CLAVE_ESTADO) || {};

/* ---------- Horarios y días bloqueados por profesional ---------- */
const proSchedules = {};
const proBlockedDays = {};
Object.keys(PROFESSIONALS).forEach(k => {
  proSchedules[k]   = (guardado.horarios && guardado.horarios[k]) || JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
  proBlockedDays[k] = (guardado.bloqueos && guardado.bloqueos[k]) || [];
});

/* ---------- Turnos ----------
   Los turnos de ejemplo se generan en cada carga (son relativos a "hoy").
   Lo que se persiste son los turnos nuevos y los cambios de estado. */
const bookedSlots = new Set();

const bookingRecords = [];

const ESTADO_INICIAL = {};
bookingRecords.forEach(r => { ESTADO_INICIAL[r.id] = r.status; });

/* Aplicar lo guardado: cambios de estado de los turnos de ejemplo... */
const estadosGuardados = guardado.estados || {};
bookingRecords.forEach(r => {
  if(estadosGuardados[r.id]){
    r.status = estadosGuardados[r.id];
    if(r.status === 'cancelled') bookedSlots.delete(`${r.dateKey}|${r.slot}`);
  }
});
/* ...y los turnos que reservaron las clientas. */
(guardado.nuevos || []).forEach(r => {
  bookingRecords.push(r);
  if(r.status !== 'cancelled') bookedSlots.add(`${r.dateKey}|${r.slot}`);
});

/* Llamar después de cualquier cambio en horarios, bloqueos o turnos. */
function guardarEstado(){
  const estados = {};
  bookingRecords.forEach(r => {
    if(r.semilla && r.status !== ESTADO_INICIAL[r.id]) estados[r.id] = r.status;
  });
  escribirJSON(localStorage, CLAVE_ESTADO, {
    horarios: proSchedules,
    bloqueos: proBlockedDays,
    estados,
    nuevos: bookingRecords.filter(r => !r.semilla),
  });
}

/* ---------- Reserva en curso (formulario de la clienta) ---------- */
const cs = Object.assign(
  { nombre:'', apellido:'', tel:'', email:'', categoria:'', servicios:[],
    selDay:null, selSlot:null, calY:0, calM:0, lastBookingId:null, resumen:null },
  leerJSON(sessionStorage, CLAVE_RESERVA) || {}
);
cs.selDay = null;   // el día y la hora elegidos viven solo en la página del calendario
cs.selSlot = null;

/* Llamar después de modificar cs para no perder los datos al cambiar de página. */
function guardarCs(){
  const { selDay, selSlot, calY, calM, ...resto } = cs;
  escribirJSON(sessionStorage, CLAVE_RESERVA, resto);
}
