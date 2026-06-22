const PROFESSIONALS = {
  micaela:    { pass:'Micaelauñas',         name:'Micaela',         tag:'Manicurista', color:'#cb9398', services:['manicuria'], initials:'M' },
  iara:       { pass:'Iaradermatologia',    name:'Iara',            tag:'Dermatóloga', color:'#aa9acb', services:['dermatologia'], initials:'I' },
  martinalash:{ pass:'Martinapestañas',     name:'Martina',         tag:'Lashista', color:'#9aabcb', services:['lashista'], initials:'ML' },
  martinamaq: { pass:'Martinamaquillaje',   name:'Martina',         tag:'Maquilladora', color:'#c4b09a', services:['maquillaje'], initials:'MM' },
  veroyaide:  { pass:'Veroyaidepeluqueria', name:'Vero y Aide',     tag:'Peluqueras', color:'#b0c4a0', services:['peluqueria'], initials:'V·A' },
  admin:      { pass:'admin2024',           name:'Administración',  tag:'Todos los servicios', color:'#cb9398', services:['peluqueria','manicuria','maquillaje','dermatologia','lashista'], initials:'☆' },
};

const DEFAULT_SCHEDULE = {
  0: { on:false, start:'09:00', end:'17:00' },
  1: { on:true,  start:'09:00', end:'18:00' },
  2: { on:true,  start:'09:00', end:'18:00' },
  3: { on:true,  start:'09:00', end:'18:00' },
  4: { on:true,  start:'09:00', end:'18:00' },
  5: { on:true,  start:'09:00', end:'17:00' },
  6: { on:false, start:'09:00', end:'14:00' },
};

const proSchedules = {};
Object.keys(PROFESSIONALS).forEach(k => {
  proSchedules[k] = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
});

const proBlockedDays = {};
Object.keys(PROFESSIONALS).forEach(k => { proBlockedDays[k] = []; });

const SERVICES = {
  peluqueria:{ title:'✂️ Peluquería', sub:'Servicios de Vero y Aide.', icon:'✂️', label:'Peluquería', items:[
    {id:'p1',name:'Mechas',dur:'—',durMin:120,price:65000},
    {id:'p2',name:'Balayage',dur:'—',durMin:150,price:75000},
    {id:'p3',name:'Iluminación',dur:'—',durMin:120,price:60000},
    {id:'p4',name:'Color en crecimiento',dur:'—',durMin:60,price:30000},
    {id:'p5',name:'Corte',dur:'—',durMin:45,price:15000},
    {id:'p6',name:'Tratamiento Restructure',dur:'—',durMin:60,price:30000},
    {id:'p7',name:'Ampollas',dur:'—',durMin:30,price:15000},
    {id:'p8',name:'Peinado semirecogido',dur:'—',durMin:45,price:25000},
    {id:'p9',name:'Peinado recogido',dur:'—',durMin:60,price:30000},
    {id:'p10',name:'Lacio u ondas',dur:'—',durMin:60,price:18000},
  ]},
  manicuria:{ title:'💅 Manicuría', sub:'Servicios de Micaela.', icon:'💅', label:'Manicuría', items:[
    {id:'m1',name:'Semipermanente',dur:'—',durMin:60,price:0},
    {id:'m2',name:'Capping',dur:'—',durMin:75,price:0},
    {id:'m3',name:'Soft gel',dur:'—',durMin:90,price:0},
  ]},
  maquillaje:{ title:'💄 Maquillaje', sub:'Servicios de Martina.', icon:'💄', label:'Maquillaje', items:[
    {id:'mq1',name:'Maquillaje social',dur:'—',durMin:60,price:0},
    {id:'mq2',name:'Maquillaje novia',dur:'—',durMin:120,price:0},
    {id:'mq3',name:'Maquillaje quinceañera',dur:'—',durMin:90,price:0},
    {id:'mq4',name:'Maquillaje artístico',dur:'—',durMin:90,price:0},
    {id:'mq5',name:'Maquillaje noche/día',dur:'—',durMin:60,price:0},
  ]},
  dermatologia:{ title:'🌿 Dermatología', sub:'Tratamientos con Iara.', icon:'🌿', label:'Dermatología', items:[
    {id:'d1',name:'Combo 1: Limpieza Facial + Dermaplaning + Shock de hidratación + Masaje Facial',dur:'—',durMin:90,price:0},
    {id:'d2',name:'Combo 2: Radiofrecuencia + Perfilado y diseño de cejas + Limpieza Facial + Terapia Capilar',dur:'—',durMin:90,price:0},
    {id:'d3',name:'Combo 3: Peeling + Tratamiento Facial + Relax Premium',dur:'—',durMin:75,price:0},
  ]},
  lashista:{ title:'👁️ Lashista', sub:'Servicios de Martina — pestañas, cejas y combos.', icon:'👁️', label:'Lashista', items:[
    {id:'l1',name:'🦋 Lifting de pestañas + botox + nutrición',dur:'—',durMin:60,price:13500},
    {id:'l2',name:'🦋 Lifting de pestañas + botox + nutrición + tinte',dur:'—',durMin:75,price:5000},
    {id:'l3',name:'🌿 Diseño de cejas + perfilado',dur:'—',durMin:30,price:10000},
    {id:'l4',name:'🌿 Diseño de cejas + perfilado + tinte',dur:'—',durMin:40,price:12000},
    {id:'l5',name:'🌿 Laminado de cejas + diseño + perfilado + botox',dur:'—',durMin:60,price:5000},
    {id:'l6',name:'🌿 Laminado de cejas + diseño + perfilado + botox + tinte',dur:'—',durMin:70,price:16500},
    {id:'l7',name:'✨ Combo: Lifting de pestañas + botox + diseño de cejas + perfilado',dur:'—',durMin:90,price:18500},
    {id:'l8',name:'✨ Combo: Lifting + nutrición + diseño de cejas + perfilado + tinte',dur:'—',durMin:100,price:20000},
    {id:'l9',name:'✨ Combo: Lifting + nutrición + laminado de cejas + diseño + perfilado',dur:'—',durMin:110,price:22500},
  ]},
};

const MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DAY_SHORT=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function fd(d){ return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
function p(n){ return String(n).padStart(2,'0'); }
function add(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function fmt$(n){ return n===0?'A consultar':'$'+n.toLocaleString('es-AR'); }
function fmtTotal$(n){ return n===0?'A consultar':'$'+n.toLocaleString('es-AR'); }

const bookedSlots = new Set([
  `${fd(new Date())}|10:00`,
  `${fd(new Date())}|11:00`,
  `${fd(add(new Date(),1))}|09:00`,
  `${fd(add(new Date(),1))}|14:00`,
  `${fd(add(new Date(),2))}|09:00`,
  `${fd(add(new Date(),2))}|15:00`,
]);

const bookingRecords = [
  { id:'b0', dateKey:fd(new Date()), slot:'10:00', nombre:'Valentina G.', servicio:'Manicuría semipermanente', svcCat:'manicuria', status:'confirmed' },
  { id:'b1', dateKey:fd(new Date()), slot:'11:00', nombre:'Lucía F.', servicio:'Extensión pelo a pelo', svcCat:'lashista', status:'confirmed' },
  { id:'b2', dateKey:fd(add(new Date(),1)), slot:'09:00', nombre:'Martina L.', servicio:'Corte y color', svcCat:'peluqueria', status:'confirmed' },
  { id:'b3', dateKey:fd(add(new Date(),1)), slot:'14:00', nombre:'Camila T.', servicio:'Maquillaje social', svcCat:'maquillaje', status:'cancelled' },
  { id:'b4', dateKey:fd(add(new Date(),2)), slot:'09:00', nombre:'Florencia R.', servicio:'Consulta dermatológica', svcCat:'dermatologia', status:'confirmed' },
  { id:'b5', dateKey:fd(add(new Date(),2)), slot:'15:00', nombre:'Rosa P.', servicio:'Pedicuría semipermanente', svcCat:'manicuria', status:'done' },
];

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}
function goToClientPage(){ showPage('pageClient'); }

let currentPro = null;

function openLogin(){
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  document.getElementById('loginErr').classList.remove('show');
  setTimeout(()=>document.getElementById('loginUser').focus(),100);
}
function closeLogin(){ document.getElementById('loginOverlay').classList.remove('open'); }
document.getElementById('loginOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('loginOverlay'))closeLogin();});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&document.getElementById('loginOverlay').classList.contains('open'))doLogin();});

function doLogin(){
  const user=document.getElementById('loginUser').value.trim().toLowerCase();
  const pass=document.getElementById('loginPass').value;
  const pro=PROFESSIONALS[user];
  if(!pro||pro.pass!==pass){ document.getElementById('loginErr').classList.add('show'); document.getElementById('loginPass').value=''; document.getElementById('loginPass').focus(); return; }
  currentPro={key:user,...pro};
  closeLogin();
  openProPage();
}

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

  showPage('pagePro');
}

function proLogout(){ currentPro=null; showPage('pageClient'); }
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
          if(booking.status==='confirmed'){
            const actions=document.createElement('div');
            actions.className='pro-slot-actions';
            const cancelBtn=document.createElement('button');
            cancelBtn.className='btn btn-danger';
            cancelBtn.style.cssText='font-size:11px;padding:4px 10px;';
            cancelBtn.textContent='Cancelar';
            cancelBtn.onclick=()=>proCancelBooking(booking.id,dKey,slot);
            actions.appendChild(cancelBtn);
            el.appendChild(actions);
          }
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

function proBlockDay(){
  if(!proSelectedDayKey||!currentPro) return;
  const hasBookings=bookingRecords.some(b=>b.dateKey===proSelectedDayKey&&b.status==='confirmed');
  if(hasBookings&&!confirm('Hay turnos confirmados para este día. ¿Querés bloquearlo igual?')) return;
  proBlockedDays[currentPro.key].push({date:proSelectedDayKey,reason:'Bloqueado manualmente'});
  proRenderCal();
  const d=new Date(proSelectedDayKey+'T12:00:00');
  proOpenDay(d.getFullYear(),d.getMonth(),d.getDate(),proSelectedDayKey);
  showToast('Día bloqueado',`${proSelectedDayKey} marcado como no disponible.`,'🚫');
}

function proUnblockDay(){
  if(!proSelectedDayKey||!currentPro) return;
  proBlockedDays[currentPro.key]=proBlockedDays[currentPro.key].filter(b=>b.date!==proSelectedDayKey);
  proRenderCal();
  const d=new Date(proSelectedDayKey+'T12:00:00');
  proOpenDay(d.getFullYear(),d.getMonth(),d.getDate(),proSelectedDayKey);
  showToast('Día disponible',`${proSelectedDayKey} ya acepta reservas.`,'✅');
}

function proCancelBooking(bookingId,dateKey,slot){
  if(!confirm('¿Confirmás la cancelación de este turno?')) return;
  const rec=bookingRecords.find(b=>b.id===bookingId);
  if(rec){
    rec.status='cancelled';
    bookedSlots.delete(`${dateKey}|${slot}`);
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
  if(!dateVal){ alert('Seleccioná una fecha.'); return; }
  if(proBlockedDays[currentPro.key].some(b=>b.date===dateVal)){ alert('Esta fecha ya está bloqueada.'); return; }
  proBlockedDays[currentPro.key].push({date:dateVal,reason});
  document.getElementById('blockDate').value='';
  document.getElementById('blockReason').value='';
  proRenderBlockedList();
  showToast('Día bloqueado','Fecha marcada como no disponible.','🚫');
}

function proRemoveBlock(idx){
  if(!currentPro) return;
  proBlockedDays[currentPro.key].splice(idx,1);
  proRenderBlockedList();
}

const adminTitles={dashboard:'Dashboard',turnos:'Turnos',clientes:'Clientes',servicios:'Servicios'};
function showAdminSection(name,el){ document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); document.getElementById('as-'+name).classList.add('active'); el.classList.add('active'); document.getElementById('adminPageTitle').textContent=adminTitles[name]; }

const cs={nombre:'',apellido:'',tel:'',email:'',categoria:'',servicios:[],selDay:null,selSlot:null,calY:0,calM:0,lastBookingId:null};

function cSetStep(n){
  [1,2,3,4,5].forEach(i=>{
    document.getElementById('cs'+i).classList.toggle('active',i===n);
    const s=document.getElementById('cstep'+i);
    if(s){s.classList.toggle('active',i===n);s.classList.toggle('done',i<n);}
    const l=document.getElementById('cline'+i);
    if(l) l.classList.toggle('done',i<n);
  });
  document.getElementById('clientProgress').style.display=n===5?'none':'';
  window.scrollTo({top:0,behavior:'smooth'});
}

function cGoBack(to){ cSetStep(to); }

function cGoStep2(){
  const n=document.getElementById('cNombre').value.trim();
  const a=document.getElementById('cApellido').value.trim();
  const t=document.getElementById('cTel').value.trim();
  if(!n||!a||!t){alert('Por favor completá nombre, apellido y teléfono.');return;}
  cs.nombre=n;cs.apellido=a;cs.tel=t;cs.email=document.getElementById('cEmail').value.trim();
  cSetStep(2);
}

function cGoStep3(cat){
  cs.categoria=cat;
  if(cs.categoria!==cat) cs.servicios=[];
  const data=SERVICES[cat];
  document.getElementById('cServTitle').textContent=data.title;
  document.getElementById('cServSub').textContent=data.sub;
  const list=document.getElementById('cServList');
  list.innerHTML='';
  data.items.forEach(s=>{
    const isSelected=cs.servicios.some(sel=>sel.id===s.id);
    const el=document.createElement('div');
    el.className='service-item'+(isSelected?' selected':'');
    el.id='csvc-'+s.id;
    el.innerHTML=`<div class="service-info"><div class="service-name">${s.name}</div><div class="service-meta">⏱ ${s.dur}</div></div><div class="service-price">${fmt$(s.price)}</div><div class="service-check">✓</div>`;
    el.onclick=()=>cToggleService(s,el);
    list.appendChild(el);
  });
  cUpdateSelectedBar();
  cSetStep(3);
}

function cToggleService(s,el){
  const idx=cs.servicios.findIndex(sel=>sel.id===s.id);
  if(idx>=0){ cs.servicios.splice(idx,1); el.classList.remove('selected'); }
  else { cs.servicios.push(s); el.classList.add('selected'); }
  cUpdateSelectedBar();
  document.getElementById('cBtnContServ').disabled=cs.servicios.length===0;
}

function cUpdateSelectedBar(){
  const bar=document.getElementById('cSelectedBar');
  const chips=document.getElementById('cSelectedChips');
  const totalP=document.getElementById('cTotalPrice');
  const totalD=document.getElementById('cTotalDur');
  if(cs.servicios.length===0){ bar.classList.remove('visible'); document.getElementById('cBtnContServ').disabled=true; return; }
  bar.classList.add('visible');
  chips.innerHTML='';
  let sumDur=0;
  cs.servicios.forEach(s=>{
    sumDur+=s.durMin;
    const chip=document.createElement('span');
    chip.className='ssb-chip';
    chip.innerHTML=`${s.name} <span class="ssb-chip-remove" onclick="cRemoveService('${s.id}')">×</span>`;
    chips.appendChild(chip);
  });
  const hasPrice=cs.servicios.some(s=>s.price>0);
  const allHavePrice=cs.servicios.every(s=>s.price>0);
  const sumPrice=cs.servicios.reduce((a,s)=>a+s.price,0);
  totalP.textContent=allHavePrice?fmt$(sumPrice):(hasPrice?fmt$(sumPrice)+' + consultar':'A consultar');
  totalD.textContent=sumDur+' min';
  document.getElementById('cBtnContServ').disabled=false;
}

function cRemoveService(id){
  cs.servicios=cs.servicios.filter(s=>s.id!==id);
  const el=document.getElementById('csvc-'+id);
  if(el) el.classList.remove('selected');
  cUpdateSelectedBar();
}

function cGoStep4(){
  if(cs.servicios.length===0) return;
  const names=cs.servicios.map(s=>s.name).join(' + ');
  const totalDur=cs.servicios.reduce((a,s)=>a+s.durMin,0);
  document.getElementById('cSelectedPill').textContent=SERVICES[cs.categoria].icon+' '+names+' · '+totalDur+' min total';
  const now=new Date();
  cs.calY=now.getFullYear();cs.calM=now.getMonth();
  cs.selDay=null;cs.selSlot=null;
  cRenderCal();
  document.getElementById('cTimeslotSec').style.display='none';
  document.getElementById('cSummarySection').style.display='none';
  cSetStep(4);
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
}

function isDayBlockedForCat(dKey,cat){
  return Object.keys(PROFESSIONALS).some(k=>{
    const pro=PROFESSIONALS[k];
    return pro.services.includes(cat) && proBlockedDays[k].some(b=>b.date===dKey);
  });
}

function cPrevMonth(){ const now=new Date(); if(cs.calM===0){cs.calM=11;cs.calY--;}else cs.calM--; if(cs.calY<now.getFullYear()||(cs.calY===now.getFullYear()&&cs.calM<now.getMonth())){cs.calM=now.getMonth();cs.calY=now.getFullYear();} cs.selDay=null; document.getElementById('cTimeslotSec').style.display='none'; document.getElementById('cSummarySection').style.display='none'; cRenderCal(); }
function cNextMonth(){ if(cs.calM===11){cs.calM=0;cs.calY++;}else cs.calM++; cs.selDay=null; document.getElementById('cTimeslotSec').style.display='none'; document.getElementById('cSummarySection').style.display='none'; cRenderCal(); }

function cSelectDay(y,m,d){
  cs.selDay=new Date(y,m,d);cs.selSlot=null;
  cRenderCal();cRenderSlots();
  document.getElementById('cTimeslotSec').style.display='block';
  document.getElementById('cSummarySection').style.display='none';
  document.getElementById('cTimeslotTitle').textContent=`Horarios para el ${DAY_NAMES[cs.selDay.getDay()]} ${d} de ${MONTHS[m]}`;
}

function allSlots(){ const s=[]; for(let h=8;h<20;h++){s.push(`${p(h)}:00`);s.push(`${p(h)}:30`);} return s; }

function cRenderSlots(){
  const grid=document.getElementById('cSlotsGrid');grid.innerHTML='';
  const dateKey=fd(cs.selDay);
  allSlots().forEach(slot=>{
    const key=`${dateKey}|${slot}`;
    const taken=bookedSlots.has(key);
    const el=document.createElement('div');
    el.className='slot'+(taken?' taken':'');
    el.textContent=slot;
    if(!taken) el.onclick=()=>cSelectSlot(slot,el);
    grid.appendChild(el);
  });
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

async function cConfirm(){
  if(!cs.selDay || !cs.selSlot) return;

  const dKey = fd(cs.selDay);
  const bId = 'b' + Date.now();
  const names = cs.servicios.map(s => s.name).join(' + ');
  const totalPrice = cs.servicios.reduce((a,s) => a + s.price, 0);

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
      categoria: cs.servicio,
      servicio: cs.servicios[0].name
    })
  });

  const texto = await respuesta.text();

  if(texto.trim() !== "ok"){
    alert("No se pudo guardar el turno en la base de datos");
    console.log(texto);
    return;
  }

  bookedSlots.add(`${dKey}|${cs.selSlot}`);

  cs.lastBookingId = bId;

  bookingRecords.push({
    id: bId,
    dateKey: dKey,
    slot: cs.selSlot,
    nombre: cs.nombre + ' ' + cs.apellido.charAt(0) + '.',
    servicio: names,
    svcCat: cs.servicio,
    status: 'confirmed'
  });

  const d = cs.selDay;
  const dateStr = `${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;

  document.getElementById('cConfNombre').textContent = cs.nombre + ' ' + cs.apellido;
  document.getElementById('cConfServ').textContent = names;
  document.getElementById('cConfDate').textContent = dateStr;
  document.getElementById('cConfTime').textContent = cs.selSlot + ' hs';
  document.getElementById('cConfPrice').textContent = fmt$(totalPrice);

  document.getElementById('cSuccessIcon').textContent = '🌼';
  document.getElementById('cSuccessTitle').textContent = '¡Turno confirmado!';
  document.getElementById('cSuccessText').textContent = 'Tu turno fue agendado exitosamente.\nTe mandamos un recordatorio por WhatsApp un día antes.';
  document.getElementById('cNotifBadge').style.display = '';
  document.getElementById('cCancelledNotice').style.display = 'none';
  document.getElementById('cCancelBtn').style.display = '';

  const tbody = document.getElementById('adminTurnosTbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `<td style="color:var(--ink-light);font-size:11px;">#T-${Math.floor(Math.random()*900)+100}</td><td>${dateStr.split(' ').slice(0,3).join(' ')} · ${cs.selSlot}</td><td><strong>${cs.nombre} ${cs.apellido}</strong></td><td>${names}</td><td>—</td><td><span class="badge badge-confirmed">Confirmado</span></td>`;

  tbody.insertBefore(tr, tbody.firstChild);

  const cnt = document.getElementById('statTurnos');
  cnt.textContent = parseInt(cnt.textContent) + 1;

  cSetStep(5);
  setTimeout(() => showToast('Recordatorio activado', `${names} · ${cs.selSlot} hs`, '🔔'), 1100);
}

function cCancelBooking(){
  if(!cs.lastBookingId) return;
  if(!confirm('¿Querés cancelar este turno?')) return;
  const rec=bookingRecords.find(b=>b.id===cs.lastBookingId);
  if(rec){
    bookedSlots.delete(`${rec.dateKey}|${rec.slot}`);
    rec.status='cancelled';
    // 🔔 NOTIFICACIÓN: Mostrar cartelito de cancelación para la profesional
    showCancelAlert(rec,'client');
    showToast('Turno cancelado', 'Tu turno fue cancelado exitosamente.', '❌');
  }
  document.getElementById('cSuccessIcon').textContent='❌';
  document.getElementById('cSuccessTitle').textContent='Turno cancelado';
  document.getElementById('cSuccessText').textContent='Tu turno fue cancelado. Podés reservar uno nuevo cuando quieras.';
  document.getElementById('cNotifBadge').style.display='none';
  document.getElementById('cCancelledNotice').style.display='block';
  document.getElementById('cCancelBtn').style.display='none';
}

function cAddAnotherService(){
  cs.servicios=[];
  cs.selDay=null;cs.selSlot=null;
  cSetStep(2);
}

function cReset(){
  Object.assign(cs,{nombre:'',apellido:'',tel:'',email:'',categoria:'',servicios:[],selDay:null,selSlot:null,lastBookingId:null});
  document.getElementById('cNombre').value='';
  document.getElementById('cApellido').value='';
  document.getElementById('cTel').value='';
  document.getElementById('cEmail').value='';
  cs.servicios=[];
  cSetStep(1);
  document.getElementById('clientProgress').style.display='';
}

function showCancelAlert(booking, cancelledBy){
  const d=new Date(booking.dateKey+'T12:00:00');
  const dateStr=`${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  document.getElementById('caName').textContent=booking.nombre;
  document.getElementById('caService').textContent=booking.servicio;
  document.getElementById('caDate').textContent=dateStr;
  document.getElementById('caTime').textContent=booking.slot+' hs';
  
  // Texto dinámico según quién canceló
  if(cancelledBy==='pro'){
    document.getElementById('cancelAlertWho').textContent='cancelado por la profesional';
    document.getElementById('cancelAlertMsg').innerHTML = 'La profesional canceló este turno. El horario quedó <strong>libre</strong> nuevamente.';
  } else {
    document.getElementById('cancelAlertWho').textContent='cancelado por la clienta';
    document.getElementById('cancelAlertMsg').innerHTML = 'La clienta canceló su turno. El horario quedó <strong>libre</strong> nuevamente.';
  }
  
  document.getElementById('cancelAlert').classList.add('open');
}

function closeCancelAlert(){ 
  document.getElementById('cancelAlert').classList.remove('open'); 
}

function showToast(title,body,icon='🔔'){
  document.getElementById('toastTitle').textContent=title;
  document.getElementById('toastBody').textContent=body;
  document.querySelector('.toast .toast-icon').textContent=icon;
  const t=document.getElementById('toast');t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer=setTimeout(()=>t.classList.remove('show'),5500);
}

// ==========================================================================
// AUTO-SCROLL SUAVE AL AVANZAR EN EL FORMULARIO
// ==========================================================================
document.addEventListener("click", function(event) {
  // Si hacen clic en un botón que los lleva al siguiente paso o al botón de volver
  if (
    event.target.classList.contains("c-btn") || 
    event.target.classList.contains("c-back-link") ||
    event.target.classList.contains("cat-btn")
  ) {
    // Buscamos el contenedor del formulario
    const container = document.querySelector(".client-container");
    if (container) {
      // Hacemos que la pantalla baje sola de forma suave hasta ahí
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode")
      ? "dark"
      : "light"
  );
}

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});

function togglePassword() {
  const input = document.getElementById("loginPass");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}