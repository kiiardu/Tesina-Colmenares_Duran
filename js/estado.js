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

/* ---------- Estado compartido: se guarda en la base de datos (estado.php) ---------- */
function pedirServidor(metodo, cuerpo){
  try{
    const x = new XMLHttpRequest();
    x.open(metodo, 'estado.php', false);
    if(cuerpo){ x.setRequestHeader('Content-Type', 'application/json'); x.send(JSON.stringify(cuerpo)); }
    else x.send();
    if(x.status === 200) return { ok:true, datos: JSON.parse(x.responseText) };
  }catch(e){}
  return { ok:false, datos:null };
}
function cargarEstadoInicial(){
  const local = leerJSON(localStorage, CLAVE_ESTADO);
  const srv = pedirServidor('GET');
  if(!srv.ok) return local || {};
  let g = srv.datos;
  if(!g && local){
    pedirServidor('POST', { horarios: local.horarios, bloqueos: local.bloqueos, nuevos: local.nuevos });
    g = local;
  }
  g = g || {};
  escribirJSON(localStorage, CLAVE_ESTADO, g);
  return g;
}
const guardado = cargarEstadoInicial();

/* ---------- Horarios y días bloqueados por profesional ---------- */
const proSchedules = {};
const proBlockedDays = {};
Object.keys(PROFESSIONALS).forEach(k => {
  proSchedules[k]   = (guardado.horarios && guardado.horarios[k]) || JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
  proBlockedDays[k] = (guardado.bloqueos && guardado.bloqueos[k]) || [];
});

/* ---------- Turnos reservados por las clientas ---------- */
const bookedSlots = new Set();
const bookingRecords = [];
(guardado.nuevos || []).forEach(r => {
  bookingRecords.push(r);
  if(r.status !== 'cancelled') bookedSlots.add(`${r.dateKey}|${r.slot}`);
});

function guardarEstado(partes, clavePro){
  escribirJSON(localStorage, CLAVE_ESTADO, { horarios: proSchedules, bloqueos: proBlockedDays, nuevos: bookingRecords });
  const cuerpo = {};
  const todo = !partes;
  if(todo || partes === 'turnos') cuerpo.nuevos = bookingRecords;
  if(todo || partes === 'horarios') cuerpo.horarios = clavePro ? { [clavePro]: proSchedules[clavePro] } : proSchedules;
  if(todo || partes === 'bloqueos') cuerpo.bloqueos = clavePro ? { [clavePro]: proBlockedDays[clavePro] } : proBlockedDays;
  const r = pedirServidor('POST', cuerpo);
  if(r.ok && r.datos && r.datos.ok){ aplicarEstado(r.datos.estado); return true; }
  if(typeof avisar === 'function') avisar('No se pudo guardar en la base de datos. Revisá que Apache y MySQL estén encendidos.');
  return false;
}
function aplicarEstado(g){
  if(!g) return false;
  const antes = JSON.stringify([proSchedules, proBlockedDays, bookingRecords]);
  Object.keys(g.horarios || {}).forEach(k => { if(k in proSchedules) proSchedules[k] = g.horarios[k]; });
  Object.keys(g.bloqueos || {}).forEach(k => { if(k in proBlockedDays) proBlockedDays[k] = g.bloqueos[k]; });
  (g.nuevos || []).forEach(r => {
    const mio = bookingRecords.find(x => x.id === r.id);
    if(!mio){ bookingRecords.push(r); }
    else if(mio.status !== r.status){ mio.status = r.status; }
    const final = mio || r;
    const clave = `${final.dateKey}|${final.slot}`;
    if(final.status === 'cancelled') bookedSlots.delete(clave); else bookedSlots.add(clave);
  });
  return antes !== JSON.stringify([proSchedules, proBlockedDays, bookingRecords]);
}
function iniciarSincronizacion(segundos = 15){
  setInterval(() => {
    if(document.hidden) return;
    fetch('estado.php').then(r => r.json()).then(g => {
      if(aplicarEstado(g) && typeof window.alActualizarEstado === 'function') window.alActualizarEstado();
    }).catch(() => {});
  }, segundos * 1000);
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
