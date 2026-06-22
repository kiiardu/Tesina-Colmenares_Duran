<?php
echo "PHP FUNCIONA";
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dandelion Estética</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<section class="welcome-hero">
  <div class="hero-content">
    <span class="hero-subtitle">Centro de Estética & Bienestar</span>
    <h1 class="hero-title">Dandelion</h1>
    <p class="hero-description">
      Un espacio diseñado para resaltar tu belleza natural y brindarte el cuidado que te merecés. 
      Gestioná tus turnos, servicios y profesionales en un solo lugar de forma simple y relajante.
    </p>
    <a href="#dashboard-anchor" class="hero-btn">Comenzar Gestión</a>
  </div>
  
  <div class="hero-gallery">
    <div class="gallery-item large">
      <img src="https://i.pinimg.com/736x/d5/f8/e2/d5f8e27ad054e5a3a4daf6be73c2b2b5.jpg" alt="Spa y Relajación">
    </div>
    <div class="gallery-item text-card">
      <p class="card-quote">"El cuidado personal no es un lujo, es una prioridad."</p>
    </div>
    <div class="gallery-item">
      <img src="https://i.pinimg.com/736x/67/4e/ca/674eca2a4f492a3bc230e1cf1fef1b8f.jpg" alt="Estética Facial">
    </div>
    <div class="gallery-item">
      <img src="https://i.pinimg.com/1200x/2f/16/91/2f1691d69aed4cf505a35d103e6c631e.jpg" alt="Detalles Naturales">
    </div>
  </div>
</section>

<div id="dashboard-anchor"></div>

<div class="toast" id="toast">
  <div class="toast-icon">🔔</div>
  <div>
    <div class="toast-title" id="toastTitle">Recordatorio de turno</div>
    <div class="toast-body" id="toastBody"></div>
  </div>
</div>

<!-- CANCELLATION ALERT OVERLAY -->
<div id="cancelAlert">
  <div class="cancel-alert-box">
    <div class="cancel-alert-header">
      <div class="cancel-alert-icon">❌</div>
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
      <h2>Dandelion</h2>
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

<!-- ============================================================ PAGE: CLIENT BOOKING ============================================================ -->
<div class="page active" id="pageClient">
  <div class="home-btn" onclick="openLogin()" title="Acceso profesionales">🏠</div>
  <button class="theme-btn" onclick="toggleTheme()">🌙</button>
  <div class="client-header">
    <div class="client-brand-wrap">
      <div class="logo-circle-lg" style="margin:0;">
        <svg width="60" height="65" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M55 125 Q52 90 58 65" stroke="#cb9398" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <line x1="58" y1="65" x2="58" y2="28" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="83" y2="33" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="90" y2="51" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="87" y2="70" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="76" y2="86" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="34" y2="86" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="27" y2="69" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="29" y2="50" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <line x1="58" y1="65" x2="37" y2="32" stroke="#cb9398" stroke-width="2" stroke-linecap="round"/>
          <circle cx="58" cy="24" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="85" cy="29" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="92" cy="48" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="89" cy="68" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="78" cy="88" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="32" cy="88" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="23" cy="71" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="25" cy="47" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
          <circle cx="35" cy="28" r="5" stroke="#cb9398" stroke-width="1.8" fill="none"/>
        </svg>
      </div>
      <div class="client-brand-text">
        <div class="brand">Dandelion</div>
        <div class="brand-sub">Reservá tu turno</div>
      </div>
    </div>
  </div>

  <div class="progress" id="clientProgress">
    <div class="step active" id="cstep1"><div class="step-dot">1</div><div class="step-label">Datos</div></div>
    <div class="step-line" id="cline1"></div>
    <div class="step" id="cstep2"><div class="step-dot">2</div><div class="step-label">Categoría</div></div>
    <div class="step-line" id="cline2"></div>
    <div class="step" id="cstep3"><div class="step-dot">3</div><div class="step-label">Servicios</div></div>
    <div class="step-line" id="cline3"></div>
    <div class="step" id="cstep4"><div class="step-dot">4</div><div class="step-label">Turno</div></div>
  </div>

  <div class="client-container">

    <!-- SCREEN 1: DATOS -->
<div class="c-screen active" id="cs1">
      <div class="c-card split-card">
        <div class="c-card-form-side">
          <div class="c-card-title">¡Hola! ¿Cómo te llamás?</div>
          <div class="c-card-sub">Completá tus datos para reservar tu turno. Te mandamos un recordatorio por WhatsApp el día antes.</div>
          <div class="c-form-body">
            <div class="c-form-row">
              <div class="c-form-group"><label class="c-form-label">Nombre</label><input type="text" class="c-form-input" id="cNombre" placeholder="Tu nombre"></div>
              <div class="c-form-group"><label class="c-form-label">Apellido</label><input type="text" class="c-form-input" id="cApellido" placeholder="Tu apellido"></div>
            </div>
            <div class="c-form-group"><label class="c-form-label">Teléfono (WhatsApp)</label><input type="tel" class="c-form-input" id="cTel" placeholder="+54 351 000 0000"></div>
            <div class="c-form-group"><label class="c-form-label">Email <span style="opacity:.45;font-size:9px;">(opcional)</span></label><input type="email" class="c-form-input" id="cEmail" placeholder="correo@ejemplo.com"></div>
            <button class="c-btn c-btn-primary" onclick="cGoStep2()">Continuar →</button>
          </div>
        </div>
        
        <div class="c-card-visual">
          <img src="https://i.pinimg.com/736x/e4/72/9f/e4729f4f6e969ffd8bcdd1a561236e9c.jpg" alt="Estética y Bienestar">
        </div>
      </div>
    </div>

    <!-- SCREEN 2: CATEGORÍAS -->
    <div class="c-screen" id="cs2">
      <div class="c-back-link" onclick="cGoBack(1)">← Volver</div>
      <div class="c-card">
        <div class="c-card-title">¿Qué servicio necesitás?</div>
        <div class="c-card-sub">Elegí el rubro y luego podés seleccionar varios servicios.</div>
        <div class="cat-grid">
          <div class="cat-btn" onclick="cGoStep3('peluqueria')">
            <img class="cat-img" src="peluqueria.jpg" alt="Peluquería">
            <div class="cat-name">Peluquería</div>
            <div class="cat-desc">Vero y Aide — mechas, color, peinados</div>
          </div>
          <div class="cat-btn" onclick="cGoStep3('manicuria')">
            <img class="cat-img" src="manicura.jpg" alt="Manicuría">
            <div class="cat-name">Manicuría</div>
            <div class="cat-desc">Micaela — semipermanente, capping, soft gel</div>
          </div>
          <div class="cat-btn" onclick="cGoStep3('maquillaje')">
            <img class="cat-img" src="maquillaje.jpg" alt="Maquillaje">
            <div class="cat-name">Maquillaje</div>
            <div class="cat-desc">Martina — social, novia, artístico</div>
          </div>
          <div class="cat-btn" onclick="cGoStep3('dermatologia')">
            <img class="cat-img" src="dermatologia.jpg" alt="Dermatología">
            <div class="cat-name">Dermatología</div>
            <div class="cat-desc">Iara — combos de tratamientos faciales</div>
          </div>
          <div class="cat-btn" onclick="cGoStep3('lashista')">
            <img class="cat-img" src="lashista.jpg" alt="Lashista">
            <div class="cat-name">Lashista</div>
            <div class="cat-desc">Martina — pestañas, cejas, combos</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SCREEN 3: SERVICIOS (multi-select) -->
    <div class="c-screen" id="cs3">
      <div class="c-back-link" onclick="cGoBack(2)">← Volver</div>
      <div class="c-card">
        <div class="c-card-title" id="cServTitle">Servicios</div>
        <div class="c-card-sub" id="cServSub">Podés seleccionar uno o varios servicios.</div>
        <div class="selected-services-bar" id="cSelectedBar">
          <div class="ssb-title">Seleccionados</div>
          <div class="ssb-chips" id="cSelectedChips"></div>
          <div class="ssb-total">Total: <span id="cTotalPrice">$0</span> · <span id="cTotalDur">0 min</span></div>
        </div>
        <div class="service-list" id="cServList"></div>
        <div class="c-btn-wrap">
          <button class="c-btn c-btn-primary" id="cBtnContServ" onclick="cGoStep4()" disabled>Elegir fecha y hora →</button>
        </div>
      </div>
    </div>

    <!-- SCREEN 4: CALENDARIO -->
    <div class="c-screen" id="cs4">
      <div class="c-back-link" onclick="cGoBack(3)">← Volver</div>
      <div class="c-card">
        <div class="c-card-title">Elegí tu turno</div>
        <div class="pill" id="cSelectedPill"></div>
        <div class="cal-nav">
          <button class="cal-nav-btn" onclick="cPrevMonth()">&#8249;</button>
          <div class="cal-month-title" id="cCalTitle"></div>
          <button class="cal-nav-btn" onclick="cNextMonth()">&#8250;</button>
        </div>
        <div class="cal-grid-wrap">
          <div class="cal-weekdays"><div class="cal-wd">Do</div><div class="cal-wd">Lu</div><div class="cal-wd">Ma</div><div class="cal-wd">Mi</div><div class="cal-wd">Ju</div><div class="cal-wd">Vi</div><div class="cal-wd">Sá</div></div>
          <div class="cal-days" id="cCalDays"></div>
        </div>
        <div class="timeslot-section" id="cTimeslotSec" style="display:none;">
          <div class="timeslot-title" id="cTimeslotTitle">Horarios disponibles</div>
          <div class="slots-grid" id="cSlotsGrid"></div>
        </div>
        <div id="cSummarySection" style="display:none;">
          <div class="summary-box">
            <div class="summary-row"><span class="summary-key">Servicios</span><span class="summary-val" id="cSumServ">—</span></div>
            <div class="summary-row"><span class="summary-key">Fecha</span><span class="summary-val" id="cSumDate">—</span></div>
            <div class="summary-row"><span class="summary-key">Hora</span><span class="summary-val" id="cSumTime">—</span></div>
            <div class="summary-row"><span class="summary-key">Duración total</span><span class="summary-val" id="cSumDur">—</span></div>
            <div class="summary-row"><span class="summary-key">Total</span><span class="summary-val" id="cSumPrice">—</span></div>
          </div>
          <div class="c-btn-wrap"><button class="c-btn c-btn-primary" onclick="cConfirm()">Confirmar turno ✓</button></div>
        </div>
      </div>
    </div>

    <!-- SCREEN 5: ÉXITO -->
    <div class="c-screen" id="cs5">
      <div class="c-card">
        <div class="success-screen">
          <div class="success-icon" id="cSuccessIcon">🌼</div>
          <div class="success-title" id="cSuccessTitle">¡Turno confirmado!</div>
          <div class="success-text" id="cSuccessText">Tu turno fue agendado exitosamente.<br>Te mandamos un recordatorio por WhatsApp un día antes.</div>
          <div class="notif-badge" id="cNotifBadge">🔔 Recordatorio automático activado</div>
          <div class="cancelled-notice" id="cCancelledNotice" style="display:none;">
            <p>❌ Tu turno fue cancelado. Si querés podés reservar uno nuevo.</p>
          </div>
          <div class="confirm-card">
            <div class="confirm-row"><span class="confirm-icon">👤</span><span class="confirm-key">Clienta</span><span class="confirm-val" id="cConfNombre">—</span></div>
            <div class="confirm-row"><span class="confirm-icon">💆</span><span class="confirm-key">Servicio</span><span class="confirm-val" id="cConfServ">—</span></div>
            <div class="confirm-row"><span class="confirm-icon">📅</span><span class="confirm-key">Fecha</span><span class="confirm-val" id="cConfDate">—</span></div>
            <div class="confirm-row"><span class="confirm-icon">🕐</span><span class="confirm-key">Hora</span><span class="confirm-val" id="cConfTime">—</span></div>
            <div class="confirm-row"><span class="confirm-icon">💰</span><span class="confirm-key">Total</span><span class="confirm-val" id="cConfPrice">—</span></div>
          </div>
          <div class="success-actions">
            <button class="c-btn c-btn-primary" onclick="cAddAnotherService()">➕ Agregar otro servicio</button>
            <button class="c-btn c-btn-back" id="cCancelBtn" onclick="cCancelBooking()" style="border:1.5px solid rgba(180,80,80,0.3);color:#a04040;">❌ Cancelar este turno</button>
            <button class="c-btn c-btn-back" onclick="cReset()">Reservar un turno nuevo</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- ============================================================ PAGE: PRO ============================================================ -->
<div class="page" id="pagePro">
  <div class="pro-topbar">
    <div class="pro-topbar-left">
      <div class="pro-avatar-sm" id="proAvatarTop"></div>
      <div>
        <div class="pro-topbar-name" id="proNameTop">—</div>
        <div class="pro-topbar-tag" id="proTagTop">—</div>
      </div>
    </div>
    <div class="pro-topbar-right">
      <button class="theme-btn" onclick="toggleTheme()">🌙</button>
      <button class="pro-logout" onclick="proLogout()">← Salir</button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="pro-tabs">
    <div class="pro-tab active" onclick="proSwitchTab('calendar',this)">📅 Turnos</div>
    <div class="pro-tab" onclick="proSwitchTab('schedule',this)">🕐 Mi horario</div>
  </div>

  <div class="pro-content">
    <!-- TAB: CALENDAR -->
    <div class="pro-tab-content active" id="proTabCalendar">
      <div class="svc-tabs" id="proSvcTabs"></div>
      <div class="pro-cal-card">
        <div class="pro-cal-header">
          <div class="pro-cal-title" id="proCalSvcTitle">Calendario</div>
          <div class="pro-cal-nav">
            <button class="pro-cal-nav-btn" onclick="proCalPrev()">&#8249;</button>
            <div class="pro-cal-month" id="proCalMonth"></div>
            <button class="pro-cal-nav-btn" onclick="proCalNext()">&#8250;</button>
          </div>
        </div>
        <div class="pro-cal-body">
          <div class="pro-cal-weekdays">
            <div class="pro-cal-wd">Do</div><div class="pro-cal-wd">Lu</div><div class="pro-cal-wd">Ma</div>
            <div class="pro-cal-wd">Mi</div><div class="pro-cal-wd">Ju</div><div class="pro-cal-wd">Vi</div><div class="pro-cal-wd">Sá</div>
          </div>
          <div class="pro-cal-days" id="proCalDays"></div>
          <div class="pro-day-panel" id="proDayPanel">
            <div class="pro-day-panel-header">
              <div class="pro-day-panel-title" id="proDayPanelTitle">Turnos del día</div>
              <div class="pro-day-panel-actions">
                <button class="btn btn-danger" id="proBlockDayBtn" onclick="proBlockDay()" style="font-size:12px;padding:6px 12px;">🚫 Bloquear día</button>
                <button class="btn btn-outline" style="font-size:12px;padding:6px 12px;" onclick="document.getElementById('proDayPanel').classList.remove('open')">Cerrar</button>
              </div>
            </div>
            <div class="pro-slot-list" id="proSlotList"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: SCHEDULE -->
    <div class="pro-tab-content" id="proTabSchedule">
      <div class="schedule-card">
        <div class="schedule-header">
          <div class="schedule-title">Mi horario de trabajo</div>
          <p style="font-size:12px;color:var(--ink-light);margin-top:4px;">Configurá los días y horas en que trabajás. Los clientes solo podrán reservar en estos horarios.</p>
        </div>
        <div class="schedule-body" id="scheduleBody"></div>
        <div style="padding:0 22px 22px;">
          <button class="schedule-save-btn" onclick="proSaveSchedule()">Guardar horario ✓</button>
        </div>
      </div>

      <div class="block-section">
        <div class="schedule-header" style="padding:18px 22px;border-bottom:1px solid var(--border);">
          <div class="schedule-title">Días u horarios bloqueados</div>
          <p style="font-size:12px;color:var(--ink-light);margin-top:4px;">Bloqueá fechas específicas o rangos horarios en los que no vas a estar disponible.</p>
        </div>
        <div class="blocked-list" id="blockedList"></div>
        <div class="add-block-form">
          <div class="add-block-group">
            <label class="add-block-label">Fecha</label>
            <input type="date" class="schedule-time-input" id="blockDate" style="width:100%;">
          </div>
          <div class="add-block-group">
            <label class="add-block-label">Motivo (opcional)</label>
            <input type="text" class="schedule-time-input" id="blockReason" placeholder="Ej: Vacaciones" style="width:100%;">
          </div>
          <button class="btn btn-primary" onclick="proAddBlock()" style="height:36px;white-space:nowrap;">+ Bloquear</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ============================================================ PAGE: ADMIN ============================================================ -->
<div class="page" id="pageAdmin" style="flex-direction:row;">
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-circle-sidebar">
        <svg width="30" height="30" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div class="sidebar-logo-text">
        <div class="logo-name">Dandelion</div>
        <div class="logo-tag">Gestión de Estética</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      <div class="nav-item active" onclick="showAdminSection('dashboard',this)">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/></svg>
        <span>Dashboard</span>
      </div>
      <div class="nav-item" onclick="showAdminSection('turnos',this)">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><polyline points="12 7 12 12 15 15" stroke-width="2"/></svg>
        <span>Turnos</span>
      </div>
      <div class="nav-section-label">Gestión</div>
      <div class="nav-item" onclick="showAdminSection('clientes',this)">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke-width="2"/></svg>
        <span>Clientes</span>
      </div>
      <div class="nav-item" onclick="showAdminSection('servicios',this)">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2"/><path d="M2 17l10 5 10-5" stroke-width="2"/><path d="M2 12l10 5 10-5" stroke-width="2"/></svg>
        <span>Servicios</span>
      </div>
    </nav>
    <div class="portal-link" onclick="goToClientPage()">
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2"/><polyline points="15 3 21 3 21 9" stroke-width="2"/><line x1="10" y1="14" x2="21" y2="3" stroke-width="2"/></svg>
      <span>Portal clientas</span>
    </div>
  </aside>
  <div class="admin-main">
    <header class="topbar">
      <h1 class="page-title" id="adminPageTitle">Dashboard</h1>
      <div class="topbar-right">
        <button class="theme-btn" onclick="toggleTheme()">🌙</button>
        
        <button class="btn btn-primary" style="font-size:12px;padding:7px 14px;" onclick="goToClientPage()">🌼 Portal clientas</button>
        
        <div class="avatar">A</div>
</div>
        <button class="btn btn-primary" style="font-size:12px;padding:7px 14px;" onclick="goToClientPage()">🌼 Portal clientas</button>
        <div class="avatar">A</div>
      </div>
    </header>
    <div class="admin-content">
      <div class="admin-section active" id="as-dashboard">
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Turnos hoy</div><div class="stat-value" id="statTurnos">8</div><div class="stat-sub">↑ 2 más que ayer</div></div>
          <div class="stat-card"><div class="stat-label">Clientes activos</div><div class="stat-value">142</div><div class="stat-sub">+5 este mes</div></div>
          <div class="stat-card"><div class="stat-label">Ingresos del mes</div><div class="stat-value">$84k</div><div class="stat-sub">Cobrado: $71.200</div></div>
          <div class="stat-card"><div class="stat-label">Pendientes de pago</div><div class="stat-value">3</div><div class="stat-sub">$12.800 por cobrar</div></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Turnos de hoy</span></div>
          <div class="card-body">
            <div class="appt-list" id="adminApptList">
              <div class="appt-item"><div class="appt-time">09:00<small>AM</small></div><div class="appt-dot"></div><div class="appt-info"><div class="appt-name">Valentina García</div><div class="appt-service">Manicuría semipermanente · 60 min</div></div><div class="appt-prof">Sofía M.</div><span class="badge badge-confirmed">Confirmado</span></div>
              <div class="appt-item"><div class="appt-time">10:30<small>AM</small></div><div class="appt-dot"></div><div class="appt-info"><div class="appt-name">Lucía Fernández</div><div class="appt-service">Extensión de pestañas · 90 min</div></div><div class="appt-prof">Carla R.</div><span class="badge badge-confirmed">Confirmado</span></div>
              <div class="appt-item"><div class="appt-time">12:00<small>PM</small></div><div class="appt-dot done"></div><div class="appt-info"><div class="appt-name">Martina López</div><div class="appt-service">Corte y color · 120 min</div></div><div class="appt-prof">Ana P.</div><span class="badge badge-done">Realizado</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-section" id="as-turnos">
        <div class="card">
          <table class="data-table">
            <thead><tr><th>#ID</th><th>Fecha y hora</th><th>Cliente</th><th>Servicio</th><th>Profesional</th><th>Estado</th></tr></thead>
            <tbody id="adminTurnosTbody">
              <tr><td style="color:var(--ink-light);font-size:11px;">#T-0041</td><td>30 mar · 09:00</td><td><strong>Valentina García</strong></td><td>Manicuría semipermanente</td><td>Sofía M.</td><td><span class="badge badge-confirmed">Confirmado</span></td></tr>
              <tr><td style="color:var(--ink-light);font-size:11px;">#T-0042</td><td>30 mar · 10:30</td><td><strong>Lucía Fernández</strong></td><td>Extensión de pestañas</td><td>Carla R.</td><td><span class="badge badge-confirmed">Confirmado</span></td></tr>
              <tr><td style="color:var(--ink-light);font-size:11px;">#T-0040</td><td>30 mar · 12:00</td><td><strong>Martina López</strong></td><td>Corte y color</td><td>Ana P.</td><td><span class="badge badge-done">Realizado</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="admin-section" id="as-clientes">
        <div class="card">
          <table class="data-table">
            <thead><tr><th>Nombre</th><th>Teléfono</th><th>Último turno</th></tr></thead>
            <tbody>
              <tr><td><strong>Valentina García</strong></td><td>+54 351 4521890</td><td>30/03</td></tr>
              <tr><td><strong>Lucía Fernández</strong></td><td>+54 351 4879023</td><td>30/03</td></tr>
              <tr><td><strong>Martina López</strong></td><td>+54 351 4123456</td><td>28/03</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="admin-section" id="as-servicios">
        <div class="card">
          <table class="data-table">
            <thead><tr><th>Servicio</th><th>Duración</th><th>Precio</th><th>Profesional</th></tr></thead>
            <tbody>
              <tr><td><strong>Manicuría semipermanente</strong></td><td>60 min</td><td>$4.800</td><td>Sofía M.</td></tr>
              <tr><td><strong>Extensión de pestañas</strong></td><td>90 min</td><td>$8.500</td><td>Carla R.</td></tr>
              <tr><td><strong>Corte y color</strong></td><td>120 min</td><td>$12.000</td><td>Ana P.</td></tr>
              <tr><td><strong>Maquillaje social</strong></td><td>75 min</td><td>$6.500</td><td>Lara N.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>