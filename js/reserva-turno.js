/* ==========================================================================
   PASO 4 — TURNO (turno.html)
   Calendario, horarios disponibles y confirmación. Al confirmar se guarda
   el turno en la base de datos y se sigue a confirmacion.html.
   ========================================================================== */

// Sin los pasos anteriores completos no se puede elegir turno
if(!cs.nombre){ location.replace('datos.html'); }
else if(!cs.categoria){ location.replace('categorias.html'); }
else if(cs.servicios.length===0){ location.replace('servicios.html'); }

/* Turnos ya tomados de la profesional de esta categoría.
   Cada uno: { fecha:'2026-11-23', ini:750, fin:800 }  (minutos desde las 00:00) */
let turnosOcupados = [];

function aMin(hhmm){ const [h,m] = hhmm.split(':').map(Number); return h*60 + m; }

async function cCargarOcupados(){
  const lista = [];
  try{
    const r = await fetch('turnos_ocupados.php?categoria=' + encodeURIComponent(cs.categoria));
    const filas = await r.json();
    filas.forEach(f => {
      const ini = aMin(f.hora);
      lista.push({ fecha:f.fecha, ini, fin: ini + Number(f.duracion) });
    });
  }catch(e){ console.log('No se pudieron leer los turnos de la base', e); }

  // Turnos guardados en este navegador (por si falla la base)
  bookingRecords.forEach(r => {
    if(r.svcCat !== cs.categoria || r.status === 'cancelled') return;
    const ini = aMin(r.slot);
    lista.push({ fecha:r.dateKey, ini, fin: ini + (r.dur || 60) });
  });

  turnosOcupados = lista;
}

/* ¿Puede empezar un turno de `dur` minutos a las `ini`? */
function cSlotLibre(dateKey, ini, dur, finJornada){
  const fin = ini + dur;
  if(fin > finJornada) return false;   // no alcanza a terminar antes de que la profesional se vaya
  return !turnosOcupados.some(t => t.fecha === dateKey && ini < t.fin && fin > t.ini);
}

function cInitTurno(){
  const names=cs.servicios.map(s=>s.name).join(' + ');
  const totalDur=cs.servicios.reduce((a,s)=>a+s.durMin,0);
  const pill=document.getElementById('cSelectedPill');
  pill.innerHTML=iconoHTML(SERVICES[cs.categoria])+' ';
  pill.append(document.createTextNode(names+' · '+totalDur+' min total'));
  const now=new Date();
  cs.calY=now.getFullYear();cs.calM=now.getMonth();
  cs.selDay=null;cs.selSlot=null;
  cRenderCal();
  document.getElementById('cTimeslotSec').style.display='none';
  document.getElementById('cSummarySection').style.display='none';
}

function cRenderCal(){
  const y=cs.calY,m=cs.calM;
  document.getElementById('cCalTitle').textContent=MONTHS[m]+' '+y;
  const first=new Date(y,m,1).getDay();
  const total=new Date(y,m+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  const grid=document.getElementById('cCalDays');
  grid.innerHTML='';
  for(let i=0;i<first;i++){const el=document.createElement('div');el.className='cal-day empty';grid.appendChild(el);}
  for(let d=1;d<=total;d++){
    const date=new Date(y,m,d);date.setHours(0,0,0,0);
    const dKey=fd(date);
    const el=document.createElement('div');
    el.textContent=d;
    const isToday=date.getTime()===today.getTime();
    const isPast=date<today;
    const isSun=date.getDay()===0;
    const isBlocked=isDayBlockedForCat(dKey,cs.categoria);
    if(isToday) el.classList.add('today');
    if(isPast||isSun||isBlocked){ el.classList.add('cal-day',isBlocked?'blocked':'past'); }
    else{ el.classList.add('cal-day','available'); el.onclick=()=>cSelectDay(y,m,d); }
    if(cs.selDay){const sel=new Date(cs.selDay);sel.setHours(0,0,0,0);if(date.getTime()===sel.getTime())el.classList.add('selected');}
    grid.appendChild(el);
  }
   cRenderBlockedMonth();
}

/* Días bloqueados por las profesionales de esta categoría en el mes que se está viendo */
function cBlockedOfMonth(){
  const y=cs.calY,m=cs.calM;
  const hoy=new Date();hoy.setHours(0,0,0,0);
  const porFecha={};
  Object.keys(PROFESSIONALS).forEach(k=>{
    if(!PROFESSIONALS[k].services.includes(cs.categoria)) return;
    (proBlockedDays[k]||[]).forEach(b=>{
      const [by,bm,bd]=b.date.split('-').map(Number);
      if(by!==y||bm-1!==m) return;
      const date=new Date(by,bm-1,bd);
      if(date<hoy) return;
      if(!porFecha[b.date]) porFecha[b.date]={date,reason:''};
      if(b.reason && b.reason!=='Bloqueado manualmente') porFecha[b.date].reason=b.reason;
    });
  });
  return Object.values(porFecha).sort((a,b)=>a.date-b.date);
}

function cRenderBlockedMonth(){
  const list=document.getElementById('cBlockedList');
  const sub=document.getElementById('cBlockedSub');
  const box=document.getElementById('cBlockedMonth');
  const dias=cBlockedOfMonth();
  list.innerHTML='';
  box.classList.toggle('vacio',dias.length===0);
  if(dias.length===0){
    sub.textContent=`${MONTHS[cs.calM]} está libre de bloqueos 🌼`;
    return;
  }
  sub.textContent=dias.length===1?'1 día no disponible':`${dias.length} días no disponibles`;
  dias.forEach(({date,reason})=>{
    const chip=document.createElement('div');
    chip.className='blocked-chip';
    const num=document.createElement('span');
    num.className='blocked-chip-num';
    num.textContent=date.getDate();
    const txt=document.createElement('span');
    txt.className='blocked-chip-txt';
    const dia=document.createElement('b');
    dia.textContent=DAY_NAMES[date.getDay()];
    txt.appendChild(dia);
    if(reason){ const r=document.createElement('small'); r.textContent=reason; txt.appendChild(r); }
    chip.append(num,txt);
    list.appendChild(chip);
  });
}

function isDayBlockedForCat(dKey,cat){
  return Object.keys(PROFESSIONALS).some(k=>{
    const pro=PROFESSIONALS[k];
    return pro.services.includes(cat) && proBlockedDays[k].some(b=>b.date===dKey);
  });
}

function cPrevMonth(){ const now=new Date(); if(cs.calM===0){cs.calM=11;cs.calY--;}else cs.calM--; if(cs.calY<now.getFullYear()||(cs.calY===now.getFullYear()&&cs.calM<now.getMonth())){cs.calM=now.getMonth();cs.calY=now.getFullYear();} cs.selDay=null; document.getElementById('cTimeslotSec').style.display='none'; document.getElementById('cSummarySection').style.display='none'; cRenderCal(); }
function cNextMonth(){ if(cs.calM===11){cs.calM=0;cs.calY++;}else cs.calM++; cs.selDay=null; document.getElementById('cTimeslotSec').style.display='none'; document.getElementById('cSummarySection').style.display='none'; cRenderCal(); }

async function cSelectDay(y,m,d){
  cs.selDay=new Date(y,m,d);cs.selSlot=null;
  await cCargarOcupados();
  cRenderCal();cRenderSlots();
  document.getElementById('cTimeslotSec').style.display='block';
  document.getElementById('cSummarySection').style.display='none';
  document.getElementById('cTimeslotTitle').textContent=`Horarios para el ${DAY_NAMES[cs.selDay.getDay()]} ${d} de ${MONTHS[m]}`;
}

function allSlots(){ const s=[]; for(let h=8;h<20;h++){s.push(`${p(h)}:00`);s.push(`${p(h)}:30`);} return s; }

function cRenderSlots(){
  const grid=document.getElementById('cSlotsGrid');
  grid.innerHTML='';

  const dateKey=fd(cs.selDay);

  // Buscar la profesional correspondiente a la categoría
  const proKey=Object.keys(PROFESSIONALS).find(k =>
    PROFESSIONALS[k].services.includes(cs.categoria)
  );

  // Si no encontramos profesional, no mostramos horarios
  if(!proKey) return;

  const schedule=proSchedules[proKey];
  const dayConfig=schedule[cs.selDay.getDay()];

  // Si la profesional no trabaja ese día
  if(!dayConfig || !dayConfig.on){
    const notice=document.createElement('div');
    notice.style.cssText='padding:18px;text-align:center;color:var(--ink-light);font-size:13px;';
    notice.textContent='No hay horarios disponibles para este día.';
    grid.appendChild(notice);
    return;
  }

  const [sh,sm]=dayConfig.start.split(':').map(Number);
  const [eh,em]=dayConfig.end.split(':').map(Number);

  const startMin=sh*60+sm;
  const endMin=eh*60+em;
  const totalDur=cs.servicios.reduce((a,s)=>a+s.durMin,0);

  for(let min=startMin;min<endMin;min+=30){

    const slot=`${p(Math.floor(min/60))}:${p(min%60)}`;

    const taken=!cSlotLibre(dateKey, min, totalDur, endMin);

    const el=document.createElement('div');

    el.className='slot'+(taken?' taken':'');
    el.textContent=slot;

    if(!taken){
      el.onclick=()=>cSelectSlot(slot,el);
    }

    grid.appendChild(el);
  }
}

function cSelectSlot(slot,el){
  cs.selSlot=slot;
  document.querySelectorAll('.slot').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
  const d=cs.selDay;
  const dateStr=`${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  const names=cs.servicios.map(s=>s.name).join(', ');
  const totalPrice=cs.servicios.reduce((a,s)=>a+s.price,0);
  const totalDur=cs.servicios.reduce((a,s)=>a+s.durMin,0);
  document.getElementById('cSumServ').textContent=names;
  document.getElementById('cSumDate').textContent=dateStr;
  document.getElementById('cSumTime').textContent=slot+' hs';
  document.getElementById('cSumDur').textContent=totalDur+' min';
  document.getElementById('cSumPrice').textContent=fmt$(totalPrice);
  document.getElementById('cSummarySection').style.display='block';
  setTimeout(()=>document.getElementById('cSummarySection').scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

/* ---------- Caja de aclaraciones (alergias, extras) ---------- */
function cInitNotas(){
  const ta=document.getElementById('cNotas');
  const count=document.getElementById('cNotasCount');
  const actualizar=()=>{
    count.textContent=`${ta.value.length} / ${ta.maxLength}`;
    count.classList.toggle('casi',ta.value.length>=ta.maxLength-30);
  };
  ta.addEventListener('input',actualizar);
  document.querySelectorAll('#cNotasChips .extras-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const txt=chip.dataset.txt;
      if(!ta.value.includes(txt.trim())){
        ta.value=(ta.value&&!/\s$/.test(ta.value)?ta.value+' ':ta.value)+txt;
        ta.value=ta.value.slice(0,ta.maxLength);
      }
      chip.classList.add('usado');
      ta.focus();
      ta.setSelectionRange(ta.value.length,ta.value.length);
      actualizar();
    });
  });
  actualizar();
}

async function cConfirm(){
  if(!cs.selDay || !cs.selSlot) return;

  const dKey = fd(cs.selDay);
  const bId = 'b' + Date.now();
  const names = cs.servicios.map(s => s.name).join(' + ');
  const totalPrice = cs.servicios.reduce((a,s) => a + s.price, 0);
  const notas = document.getElementById('cNotas').value.trim();
  const totalDur = cs.servicios.reduce((a,s) => a + s.durMin, 0);

  const respuesta = await fetch("guardar_turno.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: cs.nombre,
      apellido: cs.apellido,
      telefono: cs.tel,
      email: cs.email,
      fecha: dKey,
      hora: cs.selSlot,
      categoria: cs.categoria,
      servicio: cs.servicios[0].name,
      duracion: cs.servicios[0].durMin,
      duracion_total: totalDur,
      notas: notas
    })
  });

  const texto = await respuesta.text();

  if(texto.trim() === "ocupado"){
    avisar("Ese horario se acaba de ocupar. Elegí otro, por favor.");
    cs.selSlot = null;
    document.getElementById('cSummarySection').style.display = 'none';
    await cCargarOcupados();
    cRenderSlots();
    return;
  }

  if(texto.trim() !== "ok"){
    avisar("No se pudo guardar el turno en la base de datos.");
    console.log(texto);
    return;
  }

  const d = cs.selDay;
  const dateStr = `${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;

  bookedSlots.add(`${dKey}|${cs.selSlot}`);

  cs.lastBookingId = bId;

  bookingRecords.push({
    id: bId,
    semilla: false,
    dateKey: dKey,
    slot: cs.selSlot,
    nombre: cs.nombre + ' ' + cs.apellido.charAt(0) + '.',
    servicio: names,
    svcCat: cs.servicio || cs.categoria,
    status: 'confirmed',
    // Datos para la fila que se muestra en el panel de administración
    tid: '#T-' + (Math.floor(Math.random()*900)+100),
    fechaTxt: dateStr.split(' ').slice(0,3).join(' '),
    nombreCompleto: cs.nombre + ' ' + cs.apellido,
    tel: cs.tel,
    email: cs.email,
    dur: totalDur,
    notas: notas
  });
  guardarEstado();

  // Resumen que muestra confirmacion.html
  cs.resumen = {
    nombre: cs.nombre + ' ' + cs.apellido,
    servicio: names,
    fecha: dateStr,
    hora: cs.selSlot + ' hs',
    precio: fmt$(totalPrice),
    notas: notas
  };
  guardarCs();

  // confirmacion.html muestra el aviso "Recordatorio activado" una sola vez
  sessionStorage.setItem('dandelion_aviso_confirmacion', '1');

  location.href = 'confirmacion.html';
}

if(cs.nombre && cs.categoria && cs.servicios.length>0){ cInitTurno(); cInitNotas(); }