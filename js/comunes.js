/* ==========================================================================
   COMUNES — funciones que usan varias páginas:
   modo oscuro, login de profesionales, avisos (toast) y alerta de cancelación.
   Requiere config.js, estado.js y componentes.js cargados antes.
   ========================================================================== */

/* ---------- Modo oscuro ---------- */
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode")
      ? "dark"
      : "light"
  );
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

/* ---------- Componentes compartidos ---------- */
montarComponentes();

/* ---------- Login de profesionales ---------- */
function openLogin(){
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  document.getElementById('loginErr').classList.remove('show');
  setTimeout(()=>document.getElementById('loginUser').focus(),100);
}
function closeLogin(){ document.getElementById('loginOverlay').classList.remove('open'); }

const loginOverlay = document.getElementById('loginOverlay');
if(loginOverlay){
  loginOverlay.addEventListener('click',e=>{if(e.target===loginOverlay)closeLogin();});
  document.addEventListener('keydown',e=>{if(e.key==='Enter'&&loginOverlay.classList.contains('open'))doLogin();});
}

function doLogin(){
  const user=document.getElementById('loginUser').value.trim().toLowerCase();
  const pass=document.getElementById('loginPass').value;
  const pro=PROFESSIONALS[user];
  if(!pro||pro.pass!==pass){ document.getElementById('loginErr').classList.add('show'); document.getElementById('loginPass').value=''; document.getElementById('loginPass').focus(); return; }
  sessionStorage.setItem(CLAVE_PRO, user);
  closeLogin();
  location.href = (user === 'admin') ? 'admin.html' : 'profesional.html';
}

function togglePassword() {
  const input = document.getElementById("loginPass");

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

/* ---------- Avisos ---------- */
function showToast(title,body,icon='🔔'){
  document.getElementById('toastTitle').textContent=title;
  document.getElementById('toastBody').textContent=body;
  document.querySelector('.toast .toast-icon').textContent=icon;
  const t=document.getElementById('toast');t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer=setTimeout(()=>t.classList.remove('show'),5500);
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


/* ==========================================================================
   AVISOS Y CONFIRMACIONES (reemplazan a alert() y confirm() del navegador)
   - avisar('mensaje')                 -> cartelito que se va solo
   - if(await confirmar('¿Seguro?'))   -> ventana con Aceptar / Cancelar
   ========================================================================== */
function avisar(mensaje, icono = '⚠️'){
  showToast('Aviso', mensaje, icono);
}

function confirmar(mensaje, textoOk = 'Aceptar'){
  return new Promise(resolver => {
    const fondo = document.createElement('div');
    fondo.className = 'dlg-fondo';
    fondo.innerHTML = `
      <div class="dlg-caja" role="dialog" aria-modal="true">
        <p class="dlg-texto"></p>
        <div class="dlg-botones">
          <button type="button" class="btn btn-outline dlg-no">Cancelar</button>
          <button type="button" class="btn btn-primary dlg-si"></button>
        </div>
      </div>`;
    fondo.querySelector('.dlg-texto').textContent = mensaje;
    fondo.querySelector('.dlg-si').textContent = textoOk;
    const cerrar = valor => { document.removeEventListener('keydown', teclas); fondo.remove(); resolver(valor); };
    const teclas = e => { if(e.key === 'Escape') cerrar(false); };
    fondo.querySelector('.dlg-no').onclick = () => cerrar(false);
    fondo.querySelector('.dlg-si').onclick = () => cerrar(true);
    fondo.onclick = e => { if(e.target === fondo) cerrar(false); };
    document.addEventListener('keydown', teclas);
    document.body.appendChild(fondo);
    fondo.querySelector('.dlg-si').focus();
  });
}