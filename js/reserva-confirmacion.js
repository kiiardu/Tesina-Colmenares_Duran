/* ==========================================================================
   PASO 5 — CONFIRMACIÓN (confirmacion.html)
   Resumen del turno reservado, cancelación y opciones para seguir.
   ========================================================================== */

// Si no hay un turno recién reservado, se vuelve al inicio del formulario
if(!cs.resumen){ location.replace('datos.html'); }

function cMostrarResumen(){
  const r = cs.resumen;
  document.getElementById('cConfNombre').textContent = r.nombre;
  document.getElementById('cConfServ').textContent = r.servicio;
  document.getElementById('cConfDate').textContent = r.fecha;
  document.getElementById('cConfTime').textContent = r.hora;
  document.getElementById('cConfPrice').textContent = r.precio;

  // Si el turno ya fue cancelado (por ejemplo al recargar), se muestra como cancelado
  const rec = bookingRecords.find(b => b.id === cs.lastBookingId);
  if(rec && rec.status === 'cancelled'){ cMostrarCancelado(); return; }

  // Aviso de recordatorio, solo cuando se llega recién desde turno.html
  if(sessionStorage.getItem('dandelion_aviso_confirmacion')){
    sessionStorage.removeItem('dandelion_aviso_confirmacion');
    setTimeout(() => showToast('Recordatorio activado', `${r.servicio} · ${r.hora}`, '🔔'), 1100);
  }
}

function cMostrarCancelado(){
  document.getElementById('cSuccessIcon').innerHTML='<img class="icono-grande" src="imagenes/iconos Dandelion/equis.png" alt="Cancelado.">';
  document.getElementById('cSuccessTitle').textContent='Turno cancelado';
  document.getElementById('cSuccessText').textContent='Tu turno fue cancelado. Podés reservar uno nuevo cuando quieras.';
  document.getElementById('cNotifBadge').style.display='none';
  document.getElementById('cCancelledNotice').style.display='block';
  document.getElementById('cCancelBtn').style.display='none';
}

async function cCancelBooking(){
  if(!cs.lastBookingId) return;
  if(!(await confirmar('¿Querés cancelar este turno?', 'Cancelar turno'))) return;
  const rec=bookingRecords.find(b=>b.id===cs.lastBookingId);
  if(rec){
    bookedSlots.delete(`${rec.dateKey}|${rec.slot}`);
    rec.status='cancelled';
    guardarEstado();
    // 🔔 NOTIFICACIÓN: Mostrar cartelito de cancelación para la profesional
    showCancelAlert(rec,'client');
    showToast('Turno cancelado', 'Tu turno fue cancelado exitosamente.', '❌');
  }
  cMostrarCancelado();
}

function cAddAnotherService(){
  cs.servicios=[];
  cs.selDay=null;cs.selSlot=null;
  guardarCs();
  location.href = 'categorias.html';
}

function cReset(){
  Object.assign(cs,{nombre:'',apellido:'',tel:'',email:'',categoria:'',servicios:[],selDay:null,selSlot:null,lastBookingId:null,resumen:null});
  guardarCs();
  location.href = 'datos.html';
}

if(cs.resumen){ cMostrarResumen(); }