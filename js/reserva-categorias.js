/* ==========================================================================
   PASO 2 — CATEGORÍAS (categorias.html)
   La clienta elige el rubro y sigue a servicios.html.
   ========================================================================== */

// Sin datos de la clienta no se puede seguir: se vuelve al paso 1
if(!cs.nombre){ location.replace('datos.html'); }

function cGoStep3(cat){

  const cambioCategoria = cs.categoria !== cat;

  if(cambioCategoria){
    cs.servicios = [];
  }

  cs.categoria = cat;
  guardarCs();

  location.href = 'servicios.html';
}


/* Las tarjetas se arman con las categorías cargadas en el panel de administración */
function renderCategorias(){
  const grid = document.getElementById('catGrid');
  grid.innerHTML = Object.keys(SERVICES).map(k => {
    const c = SERVICES[k];
    const foto = c.imgs && c.imgs[0];
    const imagen = foto
      ? `<img src="${escHTML(foto)}" alt="${escHTML(c.label)}">`
      : `<div class="cat-sin-foto">${iconoHTML(c)}</div>`;
    return `
      <div class="cat-btn" data-cat="${escHTML(k)}">
        <div class="cat-image">${imagen}</div>
        <div class="cat-info">
          <div class="cat-name">${escHTML(c.label)}</div>
          <div class="cat-desc">${escHTML(c.sub)}</div>
        </div>
      </div>`;
  }).join('') || '<p style="padding:10px 24px">Todavía no hay categorías cargadas.</p>';
  grid.querySelectorAll('.cat-btn').forEach(el => el.onclick = () => cGoStep3(el.dataset.cat));
}
renderCategorias();