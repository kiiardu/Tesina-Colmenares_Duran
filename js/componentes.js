/* ==========================================================================
   COMPONENTES — bloques de HTML que se repiten en varias páginas.
   En vez de copiarlos en cada archivo .html se definen una sola vez acá y
   montarComponentes() los agrega a la página al cargar.

   - Aviso (toast) y alerta de cancelación: todas las páginas.
   - Login de profesionales: páginas que tienen el botón 🏠 (.home-btn).
   - Pie de página: todas, salvo las que tengan data-sin-pie en el <body>.
   ========================================================================== */

const COMPONENTES = {

toast: `
<div class="toast" id="toast">
  <div class="toast-icon">🔔</div>
  <div>
    <div class="toast-title" id="toastTitle">Recordatorio de turno</div>
    <div class="toast-body" id="toastBody"></div>
  </div>
</div>
`,

alertaCancelacion: `
<!-- CANCELLATION ALERT OVERLAY -->
<div id="cancelAlert">
  <div class="cancel-alert-box">
    <div class="cancel-alert-header">
      <div class="cancel-alert-icon"><img class="icono-grande" src="imagenes/iconos Dandelion/equis.png" alt=""></div>
      <h2>Turno cancelado</h2>
      <p id="cancelAlertWho">por la clienta</p>
    </div>
    <div class="cancel-alert-body">
      <div class="cancel-alert-detail">
        <div class="cancel-alert-row"><span class="cancel-alert-key">Clienta</span><span class="cancel-alert-val" id="caName">—</span></div>
        <div class="cancel-alert-row"><span class="cancel-alert-key">Servicio</span><span class="cancel-alert-val" id="caService">—</span></div>
        <div class="cancel-alert-row"><span class="cancel-alert-key">Fecha</span><span class="cancel-alert-val" id="caDate">—</span></div>
        <div class="cancel-alert-row"><span class="cancel-alert-key">Hora</span><span class="cancel-alert-val" id="caTime">—</span></div>
      </div>
      <div class="cancel-alert-msg" id="cancelAlertMsg">El turno fue cancelado. El horario quedó <strong>libre</strong> nuevamente.</div>
      <button class="cancel-alert-btn" onclick="closeCancelAlert()">Entendido ✓</button>
    </div>
  </div>
</div>
`,

login: `
<!-- LOGIN OVERLAY -->
<div id="loginOverlay">
  <div class="login-modal" style="position:relative;">
    <div class="login-header">
      <button class="login-close" onclick="closeLogin()">×</button>
      <div class="login-logo">
        <svg width="32" height="34" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M55 125 Q52 90 58 65" stroke="#deb8bc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <line x1="58" y1="65" x2="58" y2="30" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="82" y2="35" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="88" y2="52" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="85" y2="70" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="35" y2="84" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="28" y2="68" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="30" y2="50" stroke="#deb8bc" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="58" cy="27" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="83" cy="31" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="90" cy="49" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="87" cy="68" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="33" cy="86" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="24" cy="70" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
          <circle cx="26" cy="47" r="4" stroke="#deb8bc" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      <h2>Dandelión</h2>
      <p>Acceso para profesionales</p>
    </div>
    <div class="login-body">
      <div class="login-err" id="loginErr">Usuario o contraseña incorrectos.</div>
      <div class="l-group">
        <label class="l-label">Usuario</label>
        <input type="text" class="l-input" id="loginUser" placeholder="tu nombre de usuaria" autocomplete="username">
      </div>
  <div class="l-group">
    <label class="l-label">Contraseña</label>
    
    <div class="pass-wrap">
      <input type="password" class="l-input" id="loginPass" placeholder="••••••••" autocomplete="current-password">
      <button type="button" class="pass-toggle" onclick="togglePassword()">👁</button>
    </div>
  </div>
      <button class="login-btn" onclick="doLogin()">Ingresar →</button>
    </div>
  </div>
</div>
`,

pie: `
<footer class="site-footer">

  <div class="footer-logo">Dandelión</div>

  <p class="footer-tagline">
    Belleza, cuidado y bienestar en un solo lugar.
  </p>

  <div class="footer-line"></div>

  <div class="footer-info">

    <div class="footer-item">
      <span class="footer-label">VISITANOS</span>
      <a href="https://www.google.com/maps/place/Felipe+Varela+41,+X5850+R%C3%ADo+Tercero,+C%C3%B3rdoba/@-32.1733,-64.1193,17z/data=!4m6!3m5!1s0x95cd6f39e3c8e8bb:0x35ce9de3b5ad8683!8m2!3d-32.1735328!4d-64.1193185!16s%2Fg%2F11ynymg0jg?hl=es&entry=ttu&g_ep=EgoyMDI2MTEwMS4wIKXMDSoASAFQAw%3D%3D">Felipe Varela 41 - Río Tercero, Córdoba</a>
    </div>

    <div class="footer-item">
      <span class="footer-label">CONTACTO</span>
      <a href="https://wa.me/5493571554285" target="_blank" rel="noopener">+54 9 3571 55-4285</a>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=berraveronica896@gmail.com&su=Consulta%20desde%20la%20web" target="_blank" rel="noopener">berraveronica896@gmail.com</a>
    </div>

    <div class="footer-item">
      <span class="footer-label">SEGUINOS</span>
      <div class="footer-socials">
        <a href="https://www.instagram.com/veroberra1?jplx=MWdzeHNsM2Z3ZjlhbQ==">Instagram</a>
      </div>
    </div>

  </div>

  <div class="footer-bottom">
    © 2026 Dandelión
  </div>

</footer>
`,

};

function montarComponentes(){
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', COMPONENTES.toast + COMPONENTES.alertaCancelacion);

  if(document.querySelector('[data-login]')){
    body.insertAdjacentHTML('afterbegin', COMPONENTES.login);
  }

  if(!body.hasAttribute('data-sin-pie')){
    body.insertAdjacentHTML('beforeend', COMPONENTES.pie);
  }

  aplicarLogo();
}

const LOGO = 'imagenes/iconos Dandelion/logo_dandelion.png';

function aplicarLogo(){
  // Reemplaza el dibujo (svg) por la imagen en: encabezados, panel admin y ventana de login
  document.querySelectorAll('.logo-circle-lg svg, .logo-circle-sidebar svg, .login-logo svg').forEach(svg => {
    const img = document.createElement('img');
    img.src = LOGO; img.alt = 'Dandelión'; img.className = 'logo-img';
    svg.replaceWith(img);
  });

  // Ícono de la pestaña del navegador
  let link = document.querySelector('link[rel~="icon"]');
  if(!link){ link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.href = LOGO;
}
