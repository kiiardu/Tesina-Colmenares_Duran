/* ==========================================================================
   CONFIG — datos fijos del sistema (profesionales, servicios, utilidades)
   Se carga en todas las páginas.
   ========================================================================== */

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

/* Catálogo editado desde el panel de administración: se lee de la base de datos (catalogo.php) */
(function(){
  let g = null, servidorOk = false;
  const local = () => { try{ return JSON.parse(localStorage.getItem('dandelion_catalogo')); }catch(e){ return null; } };
  try{
    const x = new XMLHttpRequest();
    x.open('GET', 'catalogo.php', false);   // síncrono: el catálogo tiene que estar antes de que cargue la página
    x.send();
    if(x.status === 200){ g = JSON.parse(x.responseText); servidorOk = true; }
  }catch(e){}
  if(!servidorOk) g = local();               // sin servidor: se usa la copia del navegador
  else if(!g){                               // base vacía: se sube lo que había en este navegador (una sola vez)
    g = local();
    if(g){
      try{
        const x = new XMLHttpRequest();
        x.open('POST', 'catalogo.php', false);
        x.setRequestHeader('Content-Type', 'application/json');
        x.send(JSON.stringify(g));
      }catch(e){}
    }
  }
  if(!g) return;
  if(g.servicios){ Object.keys(SERVICES).forEach(k => delete SERVICES[k]); Object.assign(SERVICES, g.servicios); }
  if(g.profesionales){ Object.keys(PROFESSIONALS).forEach(k => delete PROFESSIONALS[k]); Object.assign(PROFESSIONALS, g.profesionales); }
})();

/* Ícono de una categoría: la imagen subida o, si no hay, el emoji */
function escHTML(t){
  return String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function iconoHTML(c){
  return c.iconImg ? `<img class="ico-img" src="${escHTML(c.iconImg)}" alt="">` : escHTML(c.icon);
}

const MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DAY_SHORT=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

/* ---------- Utilidades de fecha y formato ---------- */
function fd(d){ return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
function p(n){ return String(n).padStart(2,'0'); }
function add(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function fmt$(n){ return n===0?'A consultar':'$'+n.toLocaleString('es-AR'); }
function fmtTotal$(n){ return n===0?'A consultar':'$'+n.toLocaleString('es-AR'); }
