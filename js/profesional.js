/* ==========================================================================
   PANEL PROFESIONAL (profesional.html)
   Agenda de turnos, bloqueo de días, y configuración del horario de trabajo.
   Se llega desde el login (🏠) con el usuario de cada profesional.
   ========================================================================== */

// Profesional que inició sesión (se guarda al hacer login, ver comunes.js)
const claveProActual = sessionStorage.getItem(CLAVE_PRO);
let currentPro = (claveProActual && PROFESSIONALS[claveProActual])
  ? { key:claveProActual, ...PROFESSIONALS[claveProActual] }
  : null;

let proCalY=0,proCalM=0,proActiveSvc='',proSelectedDayKey='';

function proSwitchTab(tab,el){
  document.querySelectorAll('.pro-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.pro-tab-content').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('proTab'+tab.charAt(0).toUpperCase()+tab.slice(1)).classList.add('active');
  if(tab==='schedule') proRenderSchedule();
}

function openProPage(){
  const av=document.getElementById('proAvatarTop');
  av.textContent=currentPro.initials;
  av.style.background=currentPro.color;
  document.getElementById('proNameTop').textContent=currentPro.name;
  document.getElementById('proTagTop').textContent=currentPro.tag;

 const tabs=document.getElementById('proSvcTabs');
  tabs.innerHTML='';
  currentPro.services.forEach((svcKey,i)=>{
    const svc=SERVICES[svcKey];
    const btn=document.createElement('div');
    btn.className='svc-tab'+(i===0?' active':'');
    
    // Seteamos la imagen de fondo en el recuadro y le ponemos un degradado oscuro abajo para que el texto blanco se lea perfecto
    btn.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.7) 10%, transparent 100%), url('${svc.icon}')`;
    btn.style.backgroundSize = 'cover';
    btn.style.backgroundPosition = 'center';
    
    // Dejamos solo el texto adentro, ya que el icono ahora es el fondo del recuadro
    btn.innerHTML=`<span class="svc-tab-label">${svc.label}</span>`;
    
    btn.onclick=()=>{document.querySelectorAll('.svc-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');proActiveSvc=svcKey;proRenderCal();document.getElementById('proDayPanel').classList.remove('open');};
    tabs.appendChild(btn);
  });

  proActiveSvc=currentPro.services[0];
  const now=new Date();
  proCalY=now.getFullYear();
  proCalM=now.getMonth();
  proRenderCal();
  document.getElementById('proDayPanel').classList.remove('open');

  document.querySelectorAll('.pro-tab').forEach((t,i)=>{t.classList.toggle('active',i===0);});
  document.getElementById('proTabCalendar').classList.add('active');
  document.getElementById('proTabSchedule').classList.remove('active');

}

function proLogout(){ currentPro=null; sessionStorage.removeItem(CLAVE_PRO); location.href='inicio.html'; }
function proCalPrev(){ const now=new Date(); if(proCalM===0){proCalM=11;proCalY--;}else proCalM--; if(proCalY<now.getFullYear()||(proCalY===now.getFullYear()&&proCalM<now.getMonth())){proCalM=now.getMonth();proCalY=now.getFullYear();} proRenderCal(); document.getElementById('proDayPanel').classList.remove('open'); }
function proCalNext(){ if(proCalM===11){proCalM=0;proCalY++;}else proCalM++; proRenderCal(); document.getElementById('proDayPanel').classList.remove('open'); }

function isDayBlocked(dKey){
  if(!currentPro) return false;
  return proBlockedDays[currentPro.key].some(b=>b.date===dKey);
}

function proRenderCal(){
  const svc=SERVICES[proActiveSvc];
  document.getElementById('proCalSvcTitle').textContent =
    svc.label;
  document.getElementById('proCalMonth').textContent=MONTHS[proCalM]+' '+proCalY;
  const y=proCalY,m=proCalM;
  const first=new Date(y,m,1).getDay();
  const total=new Date(y,m+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  const grid=document.getElementById('proCalDays');
  grid.innerHTML='';
  for(let i=0;i<first;i++){const el=document.createElement('div');el.className='pro-cal-day empty';grid.appendChild(el);}
  for(let d=1;d<=total;d++){
    const date=new Date(y,m,d);date.setHours(0,0,0,0);
    const dKey=fd(date);
    const isPast=date<today;
    const isToday=date.getTime()===today.getTime();
    const isSun=date.getDay()===0;
    const isBlocked=isDayBlocked(dKey);
    const dayBookings=bookingRecords.filter(r=>r.dateKey===dKey&&r.svcCat===proActiveSvc);
    const el=document.createElement('div');
    let cls='pro-cal-day';
    if(isPast||isSun) cls+=' past';
    if(isToday) cls+=' today';
    if(isBlocked) cls+=' day-blocked';
    el.className=cls;
    const numDiv=document.createElement('div');
    numDiv.className='pro-day-num'+(isToday?' is-today':'');
    numDiv.innerHTML=`${d}${dayBookings.length>0&&!isBlocked?`<span class="pro-day-dot"></span>`:''}`;
    el.appendChild(numDiv);
    if(isBlocked){
      const bl=document.createElement('div');
      bl.style.cssText='font-size:9.5px;color:#a04040;padding:2px 6px;';
      bl.textContent='🚫 Bloqueado';
      el.appendChild(bl);
    } else {
      dayBookings.slice(0,3).forEach(b=>{
        const mini=document.createElement('div');
        mini.className='pro-appt-mini'+(b.status==='done'?' done':b.status==='cancelled'?' cancelled':'');
        mini.textContent=b.slot+' '+b.nombre;
        el.appendChild(mini);
      });
    }
    if(!isPast&&!isSun){ el.style.cursor='pointer'; el.onclick=()=>proOpenDay(y,m,d,dKey); }
    grid.appendChild(el);
  }
}

function proOpenDay(y,m,d,dKey){
  proSelectedDayKey=dKey;
  const panel=document.getElementById('proDayPanel');
  document.getElementById('proDayPanelTitle').textContent=`${DAY_NAMES[new Date(y,m,d).getDay()]} ${d} de ${MONTHS[m]} de ${y}`;
  const list=document.getElementById('proSlotList');
  list.innerHTML='';
  const isBlocked=isDayBlocked(dKey);
  const blockBtn=document.getElementById('proBlockDayBtn');
  if(isBlocked){
    blockBtn.textContent='✅ Desbloquear día';
    blockBtn.onclick=proUnblockDay;
    const notice=document.createElement('div');
    notice.style.cssText='padding:14px 18px;background:rgba(180,80,80,0.07);text-align:center;font-size:13px;color:#a04040;';
    notice.textContent='Este día está bloqueado. No se aceptan reservas.';
    list.appendChild(notice);
  } else {
    blockBtn.textContent='🚫 Bloquear día';
    blockBtn.onclick=proBlockDay;
    const schedule=proSchedules[currentPro.key];
    const dayOfWeek=new Date(y,m,d).getDay();
    const dayConfig=schedule[dayOfWeek];
    if(!dayConfig.on){
      const notice=document.createElement('div');
      notice.style.cssText='padding:14px 18px;text-align:center;font-size:13px;color:var(--ink-light);';
      notice.textContent='Día no laborable según tu horario configurado.';
      list.appendChild(notice);
    } else {
      const [sh,sm]=dayConfig.start.split(':').map(Number);
      const [eh,em]=dayConfig.end.split(':').map(Number);
      const startMin=sh*60+sm, endMin=eh*60+em;
      const slots=[];
      for(let min=startMin;min<endMin;min+=30){ slots.push(`${p(Math.floor(min/60))}:${p(min%60)}`); }

      const dayBookings=bookingRecords.filter(r=>r.dateKey===dKey&&r.svcCat===proActiveSvc&&r.status!=='cancelled');
      const freeCount=slots.length-dayBookings.length;
      const infoEl=document.createElement('div');
      infoEl.style.cssText='padding:10px 16px 4px;font-size:12px;color:var(--ink-light);display:flex;gap:14px;';
      infoEl.innerHTML=`<span>🕐 Jornada: <strong>${dayConfig.start} – ${dayConfig.end}</strong></span><span>✅ Libres: <strong style="color:var(--green)">${freeCount} turnos</strong></span><span>📋 Ocupados: <strong style="color:var(--rose-dark)">${dayBookings.length}</strong></span>`;
      list.appendChild(infoEl);

      slots.forEach(slot=>{
        const booking=bookingRecords.find(b=>b.dateKey===dKey&&b.slot===slot&&b.svcCat===proActiveSvc);
        const el=document.createElement('div');
        el.className='pro-slot-item';
        if(booking){
          const statusClass=booking.status==='done'?'badge-done':booking.status==='cancelled'?'badge-cancelled':'badge-confirmed';
          const statusLabel=booking.status==='done'?'Realizado':booking.status==='cancelled'?'Cancelado':'Confirmado';
          el.innerHTML=`<div class="pro-slot-time">${slot}</div><div class="pro-slot-info"><div class="pro-slot-name">${booking.nombre}</div><div class="pro-slot-svc">${booking.servicio}</div></div><span class="badge ${statusClass}">${statusLabel}</span>`;
          const actions=document.createElement('div');
          actions.className='pro-slot-actions';
          const verBtn=document.createElement('button');
          verBtn.className='btn btn-outline';
          verBtn.style.cssText='font-size:11px;padding:4px 10px;';
          verBtn.textContent='Ver más';
          verBtn.onclick=()=>proVerClienta(booking.id);
          actions.appendChild(verBtn);
          if(booking.status==='confirmed'){
            const cancelBtn=document.createElement('button');
            cancelBtn.className='btn btn-danger';
            cancelBtn.style.cssText='font-size:11px;padding:4px 10px;';
            cancelBtn.textContent='Cancelar';
            cancelBtn.onclick=()=>proCancelBooking(booking.id,dKey,slot);
            actions.appendChild(cancelBtn);
          }
          el.appendChild(actions);
        } else {
          el.innerHTML=`<div class="pro-slot-time" style="color:rgba(122,106,103,0.35)">${slot}</div><div class="pro-slot-free">Libre</div>`;
        }
        list.appendChild(el);
      });
    }
  }
  panel.classList.add('open');
  setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

async function proBlockDay(){
  if(!proSelectedDayKey||!currentPro) return;
  const hasBookings=bookingRecords.some(b=>b.dateKey===proSelectedDayKey&&b.status==='confirmed');
  if(hasBookings&&!(await confirmar('Hay turnos confirmados para este día. ¿Querés bloquearlo igual?', 'Bloquear'))) return;
  proBlockedDays[currentPro.key].push({date:proSelectedDayKey,reason:'Bloqueado manualmente'});
  guardarEstado();
  proRenderCal();
  const d=new Date(proSelectedDayKey+'T12:00:00');
  proOpenDay(d.getFullYear(),d.getMonth(),d.getDate(),proSelectedDayKey);
  showToast('Día bloqueado',`${proSelectedDayKey} marcado como no disponible.`,'🚫');
}

function proUnblockDay(){
  if(!proSelectedDayKey||!currentPro) return;
  proBlockedDays[currentPro.key]=proBlockedDays[currentPro.key].filter(b=>b.date!==proSelectedDayKey);
  guardarEstado();
  proRenderCal();
  const d=new Date(proSelectedDayKey+'T12:00:00');
  proOpenDay(d.getFullYear(),d.getMonth(),d.getDate(),proSelectedDayKey);
  showToast('Día disponible',`${proSelectedDayKey} ya acepta reservas.`,'✅');
}

async function proCancelBooking(bookingId,dateKey,slot){
  if(!(await confirmar('¿Confirmás la cancelación de este turno?', 'Cancelar turno'))) return;
  const rec=bookingRecords.find(b=>b.id===bookingId);
  if(rec){
    rec.status='cancelled';
    bookedSlots.delete(`${dateKey}|${slot}`);
    guardarEstado();
    // 🔔 NOTIFICACIÓN: Mostrar cartelito de cancelación
    showCancelAlert(rec,'pro');
    showToast('Turno cancelado', `El turno de ${rec.nombre} fue cancelado.`, '❌');
  }
  proRenderCal();
  const d=new Date(dateKey+'T12:00:00');
  proOpenDay(d.getFullYear(),d.getMonth(),d.getDate(),dateKey);
}

function proRenderSchedule(){
  if(!currentPro) return;
  const sched=proSchedules[currentPro.key];
  const body=document.getElementById('scheduleBody');
  body.innerHTML='';
  [1,2,3,4,5,6,0].forEach(dow=>{
    const day=sched[dow];
    const row=document.createElement('div');
    row.className='schedule-day-row';
    const toggleId=`toggle-${dow}`;
    row.innerHTML=`
      <div class="schedule-day-name ${day.on?'':'off'}">${DAY_NAMES[dow]}</div>
      <label class="schedule-toggle">
        <input type="checkbox" id="${toggleId}" ${day.on?'checked':''} onchange="proToggleDay(${dow},this)">
        <div class="schedule-toggle-track"></div>
        <div class="schedule-toggle-thumb"></div>
      </label>
      <div class="schedule-times" id="times-${dow}" style="${day.on?'':'opacity:0.3;pointer-events:none;'}">
        <input type="time" class="schedule-time-input" id="start-${dow}" value="${day.start}" step="1800">
        <span class="schedule-times-sep">hasta</span>
        <input type="time" class="schedule-time-input" id="end-${dow}" value="${day.end}" step="1800">
      </div>
      <span style="font-size:11.5px;color:var(--ink-light);margin-left:auto;">${day.on?calcFreeSlots(dow):'—'}</span>
    `;
    body.appendChild(row);
  });
  proRenderBlockedList();
}

function calcFreeSlots(dow){
  if(!currentPro) return '';
  const sched=proSchedules[currentPro.key][dow];
  if(!sched.on) return '';
  const [sh,sm]=sched.start.split(':').map(Number);
  const [eh,em]=sched.end.split(':').map(Number);
  const slots=Math.floor(((eh*60+em)-(sh*60+sm))/30);
  return `${slots} turnos disponibles`;
}

function proToggleDay(dow,checkbox){
  if(!currentPro) return;
  proSchedules[currentPro.key][dow].on=checkbox.checked;
  const timesEl=document.getElementById(`times-${dow}`);
  const label=checkbox.closest('.schedule-day-row').querySelector('.schedule-day-name');
  if(checkbox.checked){ timesEl.style.opacity='1'; timesEl.style.pointerEvents=''; label.classList.remove('off'); }
  else { timesEl.style.opacity='0.3'; timesEl.style.pointerEvents='none'; label.classList.add('off'); }
}

function proSaveSchedule(){
  if(!currentPro) return;
  [0,1,2,3,4,5,6].forEach(dow=>{
    const startEl=document.getElementById(`start-${dow}`);
    const endEl=document.getElementById(`end-${dow}`);
    if(startEl) proSchedules[currentPro.key][dow].start=startEl.value;
    if(endEl) proSchedules[currentPro.key][dow].end=endEl.value;
  });
  guardarEstado();
  showToast('Horario guardado','Tu horario fue actualizado correctamente.','✅');
  proRenderSchedule();
}

function proRenderBlockedList(){
  if(!currentPro) return;
  const list=document.getElementById('blockedList');
  const blocks=proBlockedDays[currentPro.key];
  list.innerHTML='';
  if(blocks.length===0){
    const empty=document.createElement('div');
    empty.style.cssText='padding:16px 20px;font-size:13px;color:var(--ink-light);text-align:center;';
    empty.textContent='Sin días bloqueados.';
    list.appendChild(empty);
    return;
  }
  blocks.forEach((b,i)=>{
    const d=new Date(b.date+'T12:00:00');
    const el=document.createElement('div');
    el.className='blocked-item';
    el.innerHTML=`<div class="blocked-item-info"><div class="blocked-item-label">${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}</div>${b.reason?`<div class="blocked-item-meta">${b.reason}</div>`:''}</div><button class="btn btn-outline" style="font-size:11px;padding:4px 10px;" onclick="proRemoveBlock(${i})">Desbloquear</button>`;
    list.appendChild(el);
  });
}

function proAddBlock(){
  if(!currentPro) return;
  const dateVal=document.getElementById('blockDate').value;
  const reason=document.getElementById('blockReason').value.trim();
  if(!dateVal){ avisar('Seleccioná una fecha.'); return; }
  if(proBlockedDays[currentPro.key].some(b=>b.date===dateVal)){ avisar('Esta fecha ya está bloqueada.'); return; }
  proBlockedDays[currentPro.key].push({date:dateVal,reason});
  guardarEstado();
  document.getElementById('blockDate').value='';
  document.getElementById('blockReason').value='';
  proRenderBlockedList();
  showToast('Día bloqueado','Fecha marcada como no disponible.','🚫');
}

function proRemoveBlock(idx){
  if(!currentPro) return;
  proBlockedDays[currentPro.key].splice(idx,1);
  guardarEstado();
  proRenderBlockedList();
}

// Sin sesión iniciada no hay panel: se vuelve al inicio
if(currentPro){ openProPage(); }
else { location.replace('inicio.html'); }

/* ---------- Ficha de la clienta ("Ver más") ---------- */
function escPro(t){
  return String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* Pasa un teléfono argentino al formato de WhatsApp: 549 + código de área + número */
function telWhatsApp(tel){
  let t = String(tel || '').replace(/\D/g, '').replace(/^00/, '');
  if(t.startsWith('549')) return t;
  if(t.startsWith('54'))  return '549' + t.slice(2);
  t = t.replace(/^0/, '');
  if(t.length > 10){                       // quita el "15" (ej: 3571 15 552233)
    for(const a of [2,3,4]){
      if(t.slice(a, a+2) === '15' && t.length - 2 === 10){ t = t.slice(0,a) + t.slice(a+2); break; }
    }
  }
  return '549' + t;
}

function proVerClienta(id){
  const r = bookingRecords.find(b => b.id === id);
  if(!r) return;

  const f = new Date(r.dateKey + 'T12:00:00');
  const fecha = `${DAY_NAMES[f.getDay()]} ${f.getDate()} de ${MONTHS[f.getMonth()]} de ${f.getFullYear()}`;
  let hora = r.slot + ' hs';
  if(r.dur){
    const fin = parseInt(r.slot) * 60 + parseInt(r.slot.slice(3)) + r.dur;
    hora += ` a ${p(Math.floor(fin/60))}:${p(fin%60)} hs`;
  }
  const estado = r.status === 'done' ? 'Realizado' : r.status === 'cancelled' ? 'Cancelado' : 'Confirmado';
  const nombre = r.nombreCompleto || r.nombre;

  const fila = (k, v) => `<div class="ficha-row"><span class="ficha-key">${k}</span><span class="ficha-val">${v}</span></div>`;

  const texto = `Hola ${r.nombre.split(' ')[0]}! 🌼 Te recordamos tu turno en Dandelión Estética: ${r.servicio}, ${fecha} a las ${r.slot} hs. Si no podés venir, avisanos con tiempo. ¡Te esperamos!`;
  const wa = r.tel ? `https://wa.me/${telWhatsApp(r.tel)}?text=${encodeURIComponent(texto)}` : '';
  const mail = r.email ? `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent('Recordatorio de tu turno - Dandelión Estética')}&body=${encodeURIComponent(texto)}` : '';

  document.getElementById('modalClienteBox').innerHTML = `
    <h3>${escPro(nombre)}</h3>
    ${fila('Teléfono', r.tel ? escPro(r.tel) : '—')}
    ${fila('Email', r.email ? escPro(r.email) : '—')}
    ${fila('Servicio', escPro(r.servicio))}
    ${fila('Fecha', fecha)}
    ${fila('Hora', hora)}
    ${fila('Duración', r.dur ? r.dur + ' min' : '—')}
    ${fila('Estado', estado)}
    ${fila('Nº de turno', escPro(r.tid || r.id))}
    ${fila('Aclaraciones', r.notas ? escPro(r.notas) : 'Sin aclaraciones')}
    <div class="adm-actions">
      ${wa   ? `<a class="btn btn-primary" href="${wa}" target="_blank" rel="noopener">💬 Recordar por WhatsApp</a>` : ''}
      ${mail ? `<a class="btn btn-outline" href="${mail}">✉️ Mail</a>` : ''}
      <button class="btn btn-outline" onclick="proCerrarFicha()">Cerrar</button>
    </div>`;
  document.getElementById('modalCliente').classList.add('open');
}

function proCerrarFicha(){ document.getElementById('modalCliente').classList.remove('open'); }
const _modalFicha = document.getElementById('modalCliente');
if(_modalFicha) _modalFicha.addEventListener('click', e => { if(e.target.id === 'modalCliente') proCerrarFicha(); });