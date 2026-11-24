/* ==========================================================================
   PANEL DE ADMINISTRACIÓN (admin.html)
   Dashboard, turnos, clientes y servicios.
   ========================================================================== */

const adminTitles={dashboard:'Dashboard',turnos:'Turnos',clientes:'Clientes',servicios:'Servicios'};
function showAdminSection(name,el){ document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); document.getElementById('as-'+name).classList.add('active'); el.classList.add('active'); document.getElementById('adminPageTitle').textContent=adminTitles[name]; }

function goToClientPage(){ location.href = 'inicio.html'; }

/* ==========================================================================
   GESTIÓN DEL CATÁLOGO (pestaña "Servicios"):
   servicios, categorías y profesionales. Se guarda en el navegador
   (localStorage) con la clave 'dandelion_catalogo'.
   ========================================================================== */

const CLAVE_CATALOGO = 'dandelion_catalogo';

function vaciarYCopiar(destino, origen){
  Object.keys(destino).forEach(k => delete destino[k]);
  Object.assign(destino, origen);
}

function guardarCatalogo(){
  // La cuenta "admin" siempre ve todas las categorías
  if(PROFESSIONALS.admin) PROFESSIONALS.admin.services = Object.keys(SERVICES);
  const datos = { servicios: SERVICES, profesionales: PROFESSIONALS };
  escribirJSON(localStorage, CLAVE_CATALOGO, datos);   // copia de respaldo en el navegador
  fetch('catalogo.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(datos) })
    .then(r => r.json())
    .then(r => { if(!r.ok) throw new Error(r.error || 'error'); })
    .catch(e => avisar('No se pudo guardar en la base de datos: ' + e.message + '. Revisá que Apache y MySQL estén encendidos.'));
}

/* ---------- Utilidades ---------- */
function esc(t){
  return String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function slug(t){
  return String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
}
function claveLibre(base, existentes){
  let k = base || 'item', n = 2;
  while(existentes.includes(k)) k = (base || 'item') + (n++);
  return k;
}

let catTab = 'servicios';       // pestaña activa: servicios | categorias | profesionales
let catActiva = Object.keys(SERVICES)[0];   // categoría que se está viendo en "servicios"

/* ---------- Ventana emergente (modal) ---------- */
let _modalGuardar = null, _modalCancelar = null;

function abrirModal(titulo, camposHTML, alGuardar, alCancelar){
  _modalGuardar = alGuardar;
  _modalCancelar = alCancelar || null;
  document.getElementById('modalAdminBox').innerHTML = `
    <h3>${esc(titulo)}</h3>
    <div class="adm-fields">${camposHTML}</div>
    <div class="adm-error" id="modalError"></div>
    <div class="adm-actions">
      <button class="btn btn-outline" onclick="cancelarModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarModal()">Guardar</button>
    </div>`;
  document.getElementById('modalAdmin').classList.add('open');
}
function cerrarModal(){
  document.getElementById('modalAdmin').classList.remove('open');
  _modalGuardar = null; _modalCancelar = null;
}
function cancelarModal(){
  if(_modalCancelar) _modalCancelar();
  cerrarModal();
}
function confirmarModal(){
  if(!_modalGuardar) return;
  const error = _modalGuardar();
  if(error){ document.getElementById('modalError').textContent = error; return; }
  cerrarModal();
}
function campo(label, id, valor='', tipo='text', extra=''){
  return `<label class="adm-field"><span>${esc(label)}</span><input id="${id}" type="${tipo}" value="${esc(valor)}" ${extra}></label>`;
}
function v(id){ return document.getElementById(id).value.trim(); }

/* ---------- Dibujo de la pestaña ---------- */
function renderCatalogo(){
  const root = document.getElementById('catalogoRoot');
  const tabs = [['servicios','Servicios'],['categorias','Categorías'],['profesionales','Profesionales']];
  let html = `<div class="adm-tabs">` + tabs.map(([k,n]) =>
    `<button class="adm-tab ${catTab===k?'active':''}" onclick="catTab='${k}';renderCatalogo()">${n}</button>`).join('') + `</div>`;

  if(catTab === 'servicios')      html += vistaServicios();
  if(catTab === 'categorias')     html += vistaCategorias();
  if(catTab === 'profesionales')  html += vistaProfesionales();

  root.innerHTML = html;
}

/* ===== SERVICIOS ===== */
function vistaServicios(){
  const cats = Object.keys(SERVICES);
  if(cats.length === 0) return `<div class="card"><div class="card-body adm-vacio">Todavía no hay categorías. Creá una en la pestaña “Categorías”.</div></div>`;
  if(!SERVICES[catActiva]) catActiva = cats[0];

  const chips = cats.map(k =>
    `<button class="adm-chip ${k===catActiva?'active':''}" onclick="catActiva='${k}';renderCatalogo()">${iconoHTML(SERVICES[k])} ${esc(SERVICES[k].label)}</button>`).join('');

  const items = SERVICES[catActiva].items;
  const filas = items.length === 0
    ? `<tr><td colspan="4" class="adm-vacio">Esta categoría no tiene servicios todavía.</td></tr>`
    : items.map(s => `
      <tr>
        <td><strong>${esc(s.name)}</strong></td>
        <td>${s.durMin} min</td>
        <td>${s.price > 0 ? '$' + s.price.toLocaleString('es-AR') : 'A consultar'}</td>
        <td class="adm-acc">
          <button class="btn btn-outline" onclick="editarServicio('${s.id}')">Editar</button>
          <button class="btn btn-danger" onclick="borrarServicio('${s.id}')">Quitar</button>
        </td>
      </tr>`).join('');

  return `
    <div class="adm-chips">${chips}</div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">${iconoHTML(SERVICES[catActiva])} ${esc(SERVICES[catActiva].label)}</span>
        <button class="btn btn-primary" onclick="editarServicio(null)">+ Agregar servicio</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Servicio</th><th>Duración</th><th>Precio</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
    <p class="adm-nota">Precio $0 = se muestra “A consultar”.</p>`;
}

/* ---------- Fotos de los servicios (se suben desde la página) ---------- */
let fotosEdicion = [];       // fotos del servicio que se está editando
let fotosSubidas = [];       // subidas en esta ventana (si cancelás, se borran)
let fotosQuitadas = [];      // fotos que ya estaban y se quitaron (se borran recién al guardar)
let subiendoFotos = false;

function pedirServidor(datos){
  return fetch('subir_imagen.php', { method:'POST', body: datos }).then(r => r.json());
}
function borrarFotoServidor(ruta){
  const fd = new FormData(); fd.append('accion', 'borrar'); fd.append('ruta', ruta);
  return pedirServidor(fd).catch(() => {});
}

/* Achica la foto antes de subirla (las del celular pesan varios MB) */
async function achicarFoto(archivo, max = 1200){
  const bmp = await createImageBitmap(archivo);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, 'image/jpeg', 0.85));
}

async function subirFotos(input){
  const estado = document.getElementById('fotosEstado');
  const archivos = [...input.files];
  input.value = '';
  subiendoFotos = true;
  for(let i = 0; i < archivos.length; i++){
    estado.textContent = `Subiendo foto ${i + 1} de ${archivos.length}...`;
    try{
      const blob = await achicarFoto(archivos[i]);
      const fd = new FormData(); fd.append('foto', blob, 'foto.jpg');
      const r = await pedirServidor(fd);
      if(!r.ok) throw new Error(r.error);
      fotosEdicion.push(r.ruta); fotosSubidas.push(r.ruta);
      dibujarFotos();
    }catch(e){
      estado.textContent = `No se pudo subir "${archivos[i].name}": ${e.message || 'error'}`;
      subiendoFotos = false;
      return;
    }
  }
  estado.textContent = '';
  subiendoFotos = false;
}

function quitarFoto(i){
  const ruta = fotosEdicion.splice(i, 1)[0];
  if(fotosSubidas.includes(ruta)){ fotosSubidas = fotosSubidas.filter(r => r !== ruta); borrarFotoServidor(ruta); }
  else fotosQuitadas.push(ruta);
  dibujarFotos();
}
function moverFoto(i, d){
  const j = i + d;
  if(j < 0 || j >= fotosEdicion.length) return;
  [fotosEdicion[i], fotosEdicion[j]] = [fotosEdicion[j], fotosEdicion[i]];
  dibujarFotos();
}
function dibujarFotos(){
  document.getElementById('fotosGrid').innerHTML = fotosEdicion.length === 0
    ? '<div class="adm-nota">Todavía no hay fotos.</div>'
    : fotosEdicion.map((r, i) => `
        <div class="adm-foto">
          <img src="${esc(r)}" alt="">
          <button type="button" class="adm-foto-x" title="Quitar" onclick="quitarFoto(${i})">✕</button>
          ${i === 0 ? '<span class="adm-foto-tag">Principal</span>'
                    : `<button type="button" class="adm-foto-izq" title="Mover a la izquierda" onclick="moverFoto(${i},-1)">‹</button>`}
        </div>`).join('');
}

function editarServicio(id){
  const items = SERVICES[catActiva].items;
  const s = id ? items.find(x => x.id === id) : null;
  fotosEdicion = s && s.imgs ? [...s.imgs] : [];
  fotosSubidas = []; fotosQuitadas = [];

  abrirModal(s ? 'Editar servicio' : 'Nuevo servicio',
    campo('Nombre', 'fNombre', s ? s.name : '') +
    campo('Duración (minutos)', 'fDur', s ? s.durMin : 60, 'number', 'min="5" step="5"') +
    campo('Precio ($, 0 = a consultar)', 'fPrecio', s ? s.price : 0, 'number', 'min="0" step="500"') +
    `<div class="adm-field"><span>Fotos (se ven en el carrusel de la clienta)</span>
       <div class="adm-fotos" id="fotosGrid"></div>
       <label class="btn btn-outline adm-subir">＋ Agregar fotos
         <input type="file" accept="image/*" multiple hidden onchange="subirFotos(this)">
       </label>
       <div class="adm-nota" id="fotosEstado"></div>
     </div>`,
    () => {
      const name = v('fNombre'), durMin = parseInt(v('fDur')), price = parseInt(v('fPrecio')) || 0;
      if(subiendoFotos) return 'Esperá a que terminen de subir las fotos.';
      if(!name) return 'Poné un nombre para el servicio.';
      if(!(durMin >= 5)) return 'La duración tiene que ser de al menos 5 minutos.';
      if(price < 0) return 'El precio no puede ser negativo.';
      if(s){ s.name = name; s.durMin = durMin; s.price = price; s.imgs = [...fotosEdicion]; }
      else { items.push({ id: 's' + Date.now(), name, dur:'—', durMin, price, imgs: [...fotosEdicion] }); }
      fotosQuitadas.forEach(borrarFotoServidor);
      guardarCatalogo(); renderCatalogo();
    },
    () => { fotosSubidas.forEach(borrarFotoServidor); }   // al cancelar, se borran las que se subieron
  );
  dibujarFotos();
}

async function borrarServicio(id){
  const items = SERVICES[catActiva].items;
  const s = items.find(x => x.id === id);
  if(!s || !(await confirmar(`¿Quitar "${s.name}" del catálogo?`, 'Quitar'))) return;
  (s.imgs || []).forEach(borrarFotoServidor);
  items.splice(items.indexOf(s), 1);
  guardarCatalogo(); renderCatalogo();
}

/* ===== CATEGORÍAS ===== */
function vistaCategorias(){
  const filas = Object.keys(SERVICES).map(k => {
    const c = SERVICES[k];
    return `
      <tr>
        <td><strong>${iconoHTML(c)} ${esc(c.label)}</strong></td>
        <td>${esc(c.sub)}</td>
        <td>${c.items.length}</td>
        <td class="adm-acc">
          <button class="btn btn-outline" onclick="editarCategoria('${k}')">Editar</button>
          <button class="btn btn-danger" onclick="borrarCategoria('${k}')">Quitar</button>
        </td>
      </tr>`;
  }).join('');
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Categorías</span>
        <button class="btn btn-primary" onclick="editarCategoria(null)">+ Agregar categoría</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Categoría</th><th>Descripción</th><th>Servicios</th><th></th></tr></thead>
        <tbody>${filas || '<tr><td colspan="4" class="adm-vacio">No hay categorías.</td></tr>'}</tbody>
      </table>
    </div>`;
}

/* ---------- Ícono (imagen) de la categoría ---------- */
let iconoEdicion = '';    // ícono actual en la ventana ('' = usa el emoji)
let iconoSubido = '';     // ícono subido en esta ventana (si cancelás, se borra)
let iconoViejo = '';      // ícono que ya existía y se reemplazó o quitó (se borra recién al guardar)

async function subirIcono(input){
  const archivo = input.files[0]; input.value = '';
  if(!archivo) return;
  const estado = document.getElementById('iconoEstado');
  estado.textContent = 'Subiendo ícono...'; subiendoFotos = true;
  try{
    const blob = await achicarFoto(archivo, 256);
    const fd = new FormData(); fd.append('foto', blob, 'icono.jpg');
    const r = await pedirServidor(fd);
    if(!r.ok) throw new Error(r.error);
    quitarIcono(true);
    iconoEdicion = iconoSubido = r.ruta;
    estado.textContent = '';
  }catch(e){
    estado.textContent = 'No se pudo subir el ícono: ' + (e.message || 'error');
  }
  subiendoFotos = false;
  dibujarIcono();
}
function quitarIcono(sinDibujar){
  if(iconoEdicion){
    if(iconoEdicion === iconoSubido){ borrarFotoServidor(iconoSubido); iconoSubido = ''; }
    else iconoViejo = iconoEdicion;
  }
  iconoEdicion = '';
  if(sinDibujar !== true) dibujarIcono();
}
function dibujarIcono(){
  const emoji = (document.getElementById('fCatIcono') || {}).value || '✨';
  document.getElementById('iconoVista').innerHTML = iconoEdicion
    ? `<div class="adm-foto adm-foto-icono"><img src="${esc(iconoEdicion)}" alt=""><button type="button" class="adm-foto-x" title="Quitar" onclick="quitarIcono()">✕</button></div>`
    : `<div class="adm-foto adm-foto-icono adm-icono-emoji">${esc(emoji)}</div>`;
}

function bloqueFotosHTML(){
  return `<div class="adm-field"><span>Fotos de la categoría (la primera es la que se ve en la tarjeta)</span>
       <div class="adm-fotos" id="fotosGrid"></div>
       <label class="btn btn-outline adm-subir">＋ Agregar fotos
         <input type="file" accept="image/*" multiple hidden onchange="subirFotos(this)">
       </label>
       <div class="adm-nota" id="fotosEstado"></div>
     </div>`;
}

function editarCategoria(key){
  const c = key ? SERVICES[key] : null;
  fotosEdicion = c && c.imgs ? [...c.imgs] : [];
  fotosSubidas = []; fotosQuitadas = [];
  iconoEdicion = c && c.iconImg ? c.iconImg : ''; iconoSubido = ''; iconoViejo = '';

  abrirModal(c ? 'Editar categoría' : 'Nueva categoría',
    campo('Nombre', 'fCatNombre', c ? c.label : '') +
    campo('Emoji (se usa si no subís un ícono)', 'fCatIcono', c ? c.icon : '✨', 'text', 'maxlength="4" oninput="dibujarIcono()"') +
    `<div class="adm-field"><span>Ícono (imagen, opcional)</span>
       <div class="adm-fotos" id="iconoVista"></div>
       <label class="btn btn-outline adm-subir">Subir ícono
         <input type="file" accept="image/*" hidden onchange="subirIcono(this)">
       </label>
       <div class="adm-nota" id="iconoEstado"></div>
     </div>` +
    campo('Descripción corta', 'fCatSub', c ? c.sub : '') +
    bloqueFotosHTML(),
    () => {
      const label = v('fCatNombre'), icon = v('fCatIcono') || '✨', sub = v('fCatSub');
      if(subiendoFotos) return 'Esperá a que terminen de subir las imágenes.';
      if(!label) return 'Poné un nombre para la categoría.';
      if(c){
        c.label = label; c.icon = icon; c.sub = sub; c.title = icon + ' ' + label;
        c.imgs = [...fotosEdicion];
        if(iconoEdicion) c.iconImg = iconoEdicion; else delete c.iconImg;
      } else {
        const k = claveLibre(slug(label), Object.keys(SERVICES));
        SERVICES[k] = { title: icon + ' ' + label, sub, icon, label, imgs: [...fotosEdicion], items: [] };
        if(iconoEdicion) SERVICES[k].iconImg = iconoEdicion;
        catActiva = k;
      }
      fotosQuitadas.forEach(borrarFotoServidor);
      if(iconoViejo) borrarFotoServidor(iconoViejo);
      guardarCatalogo(); renderCatalogo();
    },
    () => { fotosSubidas.forEach(borrarFotoServidor); if(iconoSubido) borrarFotoServidor(iconoSubido); }
  );
  dibujarFotos(); dibujarIcono();
}

async function borrarCategoria(key){
  const c = SERVICES[key];
  if(!c) return;
  const msg = `¿Quitar la categoría "${c.label}"` + (c.items.length ? ` y sus ${c.items.length} servicios` : '') + '?';
  if(!(await confirmar(msg, 'Quitar'))) return;
  // Se borran también sus fotos del servidor
  (c.imgs || []).forEach(borrarFotoServidor);
  if(c.iconImg) borrarFotoServidor(c.iconImg);
  c.items.forEach(s => (s.imgs || []).forEach(borrarFotoServidor));
  delete SERVICES[key];
  // Las profesionales dejan de atender esa categoría
  Object.values(PROFESSIONALS).forEach(p => { p.services = p.services.filter(s => s !== key); });
  guardarCatalogo(); renderCatalogo();
}

/* ===== PROFESIONALES ===== */
function vistaProfesionales(){
  const filas = Object.keys(PROFESSIONALS).filter(k => k !== 'admin').map(k => {
    const p = PROFESSIONALS[k];
    const cats = p.services.map(s => SERVICES[s] ? SERVICES[s].label : s).join(', ') || '—';
    return `
      <tr>
        <td><span class="adm-dot" style="background:${esc(p.color)}">${esc(p.initials)}</span></td>
        <td><strong>${esc(p.name)}</strong><br><small>${esc(p.tag)}</small></td>
        <td>${esc(k)}</td>
        <td>${esc(cats)}</td>
        <td class="adm-acc">
          <button class="btn btn-outline" onclick="editarProfesional('${k}')">Editar</button>
          <button class="btn btn-danger" onclick="borrarProfesional('${k}')">Quitar</button>
        </td>
      </tr>`;
  }).join('');
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Profesionales</span>
        <button class="btn btn-primary" onclick="editarProfesional(null)">+ Agregar profesional</button>
      </div>
      <table class="data-table">
        <thead><tr><th></th><th>Nombre</th><th>Usuario</th><th>Atiende</th><th></th></tr></thead>
        <tbody>${filas || '<tr><td colspan="5" class="adm-vacio">No hay profesionales.</td></tr>'}</tbody>
      </table>
    </div>`;
}

function editarProfesional(key){
  const p = key ? PROFESSIONALS[key] : null;
  const checks = Object.keys(SERVICES).map(k =>
    `<label class="adm-check"><input type="checkbox" class="fCats" value="${k}" ${p && p.services.includes(k) ? 'checked' : ''}> ${iconoHTML(SERVICES[k])} ${esc(SERVICES[k].label)}</label>`).join('');

  abrirModal(p ? 'Editar profesional' : 'Nueva profesional',
    campo('Usuario (para ingresar)', 'fProUser', key || '', 'text', key ? 'readonly' : '') +
    campo('Contraseña', 'fProPass', p ? p.pass : '') +
    campo('Nombre', 'fProNombre', p ? p.name : '') +
    campo('Rol (ej: Manicurista)', 'fProTag', p ? p.tag : '') +
    campo('Iniciales', 'fProIni', p ? p.initials : '', 'text', 'maxlength="3"') +
    campo('Color', 'fProColor', p ? p.color : '#cb9398', 'color') +
    `<div class="adm-field"><span>Categorías que atiende</span><div class="adm-checks">${checks || '<em>No hay categorías.</em>'}</div></div>`,
    () => {
      const user = key || slug(v('fProUser'));
      const pass = v('fProPass'), name = v('fProNombre'), tag = v('fProTag');
      const initials = v('fProIni') || name.charAt(0).toUpperCase();
      const color = document.getElementById('fProColor').value;
      const services = [...document.querySelectorAll('.fCats:checked')].map(c => c.value);
      if(!user) return 'Poné un usuario.';
      if(!p && (user === 'admin' || PROFESSIONALS[user])) return 'Ese usuario ya existe.';
      if(!pass) return 'Poné una contraseña.';
      if(!name) return 'Poné un nombre.';
      const datos = { pass, name, tag, color, services, initials };
      if(p) Object.assign(p, datos); else PROFESSIONALS[user] = datos;
      guardarCatalogo(); renderCatalogo();
    });
}

async function borrarProfesional(key){
  const p = PROFESSIONALS[key];
  if(!p || !(await confirmar(`¿Quitar a "${p.name}" (${key})?`, 'Quitar'))) return;
  delete PROFESSIONALS[key];
  guardarCatalogo(); renderCatalogo();
}

renderCatalogo();

/* Tablas del panel: se arman con los turnos reales (nada de datos de ejemplo) */
const ESTADOS_TURNO = {
  confirmed: ['badge-confirmed', 'Confirmado'],
  done:      ['badge-done',      'Realizado'],
  cancelled: ['badge-cancelled', 'Cancelado'],
};

function profesionalDe(cat){
  const k = Object.keys(PROFESSIONALS).find(k => k !== 'admin' && PROFESSIONALS[k].services.includes(cat));
  return k ? PROFESSIONALS[k].name : '—';
}
function fechaCorta(dateKey){ const [y,m,d] = dateKey.split('-'); return `${d}/${m}`; }
function nombreDe(r){ return r.nombreCompleto || r.nombre; }
function filaVacia(cols, texto){ return `<tr><td colspan="${cols}" class="adm-vacio">${texto}</td></tr>`; }

function renderAdmin(){
  const hoy = fd(new Date());
  const todos = [...bookingRecords].sort((a,b) => (b.dateKey + b.slot).localeCompare(a.dateKey + a.slot));
  const activos = todos.filter(r => r.status !== 'cancelled');

  /* Contadores */
  const clientas = new Set(todos.map(nombreDe));
  document.getElementById('statHoy').textContent       = activos.filter(r => r.dateKey === hoy).length;
  document.getElementById('statProx').textContent      = todos.filter(r => r.status === 'confirmed' && r.dateKey >= hoy).length;
  document.getElementById('statClientas').textContent  = clientas.size;
  document.getElementById('statCanc').textContent      = todos.filter(r => r.status === 'cancelled').length;

  /* Turnos de hoy */
  const deHoy = activos.filter(r => r.dateKey === hoy).sort((a,b) => a.slot.localeCompare(b.slot));
  document.getElementById('adminApptList').innerHTML = deHoy.length === 0
    ? '<div class="adm-vacio">No hay turnos para hoy.</div>'
    : deHoy.map(r => {
        const [cls, txt] = ESTADOS_TURNO[r.status] || ESTADOS_TURNO.confirmed;
        return `<div class="appt-item">
          <div class="appt-time">${esc(r.slot)}</div><div class="appt-dot ${r.status === 'done' ? 'done' : ''}"></div>
          <div class="appt-info"><div class="appt-name">${esc(nombreDe(r))}</div><div class="appt-service">${esc(r.servicio)}</div></div>
          <div class="appt-prof">${esc(profesionalDe(r.svcCat))}</div><span class="badge ${cls}">${txt}</span></div>`;
      }).join('');

  /* Todos los turnos */
  document.getElementById('adminTurnosTbody').innerHTML = todos.length === 0
    ? filaVacia(6, 'Todavía no hay turnos reservados.')
    : todos.map(r => {
        const [cls, txt] = ESTADOS_TURNO[r.status] || ESTADOS_TURNO.confirmed;
        return `<tr><td style="color:var(--ink-light);font-size:11px;">${esc(r.tid || r.id)}</td>
          <td>${fechaCorta(r.dateKey)} · ${esc(r.slot)}</td><td><strong>${esc(nombreDe(r))}</strong></td>
          <td>${esc(r.servicio)}</td><td>${esc(profesionalDe(r.svcCat))}</td>
          <td><span class="badge ${cls}">${txt}</span></td></tr>`;
      }).join('');

  /* Clientas (se arman agrupando los turnos por nombre) */
  const porClienta = {};
  todos.forEach(r => {
    const n = nombreDe(r);
    if(!porClienta[n]) porClienta[n] = { nombre:n, tel:r.tel || '—', turnos:0, ultimo:r.dateKey };
    if(r.tel && porClienta[n].tel === '—') porClienta[n].tel = r.tel;
    porClienta[n].turnos++;
  });
  const lista = Object.values(porClienta);
  document.getElementById('adminClientesTbody').innerHTML = lista.length === 0
    ? filaVacia(4, 'Todavía no hay clientas.')
    : lista.map(c => `<tr><td><strong>${esc(c.nombre)}</strong></td><td>${esc(c.tel)}</td><td>${c.turnos}</td><td>${fechaCorta(c.ultimo)}</td></tr>`).join('');
}

renderAdmin();
