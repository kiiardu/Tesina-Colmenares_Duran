/* ==========================================================================
   PASO 3 — SERVICIOS (servicios.html)
   Lista de servicios de la categoría elegida, con selección múltiple.
   ========================================================================== */

// Sin datos o sin categoría no se puede seguir: se vuelve al paso que falta
if(!cs.nombre){ location.replace('datos.html'); }
else if(!cs.categoria){ location.replace('categorias.html'); }

function renderServicios(){

  const cat = cs.categoria;
  const data = SERVICES[cat];

  const tit = document.getElementById('cServTitle');
  tit.innerHTML = iconoHTML(data) + ' ';
  tit.append(document.createTextNode(data.label));
  document.getElementById('cServSub').textContent = data.sub;

  const list = document.getElementById('cServList');

  list.innerHTML = '';


  /* Imágenes de respaldo por categoría (se usan si un servicio no tiene las suyas) */
  const serviceImages = {
    peluqueria:   ['imagenes/peluqueria/peluqueria.jpg', 'imagenes/peluqueria/peluqueria2.jpg', 'imagenes/peluqueria/peluqueria3.jpg'],
    manicuria:    ['imagenes/manicuria/manicura_tradicional.jpg', 'imagenes/manicuria/soft_gel.jpg'],
    maquillaje:   ['imagenes/maquillaje/maquillaje.jpg', 'imagenes/maquillaje/maquillaje3.jpg'],
    dermatologia: ['imagenes/dermatologia/dermaplaning.jpg', 'imagenes/dermatologia/masaje_facial.jpg'],
    lashista:     ['imagenes/lashista/lashista.jpg', 'imagenes/lashista/lashista2.jpg', 'imagenes/lashista/lashista3.jpg']
  };

  /* Imágenes específicas de cada servicio (clave = id del servicio en config.js) */
  const imagenesPorServicio = {

    /* PELUQUERÍA */
    p1:  ['imagenes/peluqueria/mechas.jpg'],
    p2:  ['imagenes/peluqueria/balayage1.jpg', 'imagenes/peluqueria/balayage2.jpg', 'imagenes/peluqueria/balayage3.jpg',
          'imagenes/peluqueria/balayage4.jpg', 'imagenes/peluqueria/balayage5.jpg', 'imagenes/peluqueria/balayage6.jpg'],
    p3:  ['imagenes/peluqueria/iluminacion1.jpg', 'imagenes/peluqueria/iluminacion2.jpg'],          // ejemplo
    p4:  ['imagenes/peluqueria/correcciones_color1.jpg', 'imagenes/peluqueria/correcciones_color2.jpg'],
    p5:  ['imagenes/peluqueria/cortes1.jpg', 'imagenes/peluqueria/cortes2.jpg', 'imagenes/peluqueria/cortes3.jpg',
          'imagenes/peluqueria/cortes4.jpg', 'imagenes/peluqueria/cortes5.jpg'],
    p6:  ['imagenes/peluqueria/restructure1.jpg'],                                                  // ejemplo
    p7:  ['imagenes/peluqueria/ampollas1.jpg'],                                                     // ejemplo
    p8:  ['imagenes/peluqueria/semirecogido1.jpg', 'imagenes/peluqueria/semirecogido2.jpg'],        // ejemplo
    p9:  ['imagenes/peluqueria/recogido1.jpg', 'imagenes/peluqueria/recogido2.jpg'],                // ejemplo
    p10: ['imagenes/peluqueria/lacio1.jpg', 'imagenes/peluqueria/ondas1.jpg'],                      // ejemplo

    /* MANICURÍA */
    m1: ['imagenes/manicuria/semipermanente.jpg'],
    m2: ['imagenes/manicuria/capping.jpg'],
    m3: ['imagenes/manicuria/soft_gel.jpg'],

    /* MAQUILLAJE */
    mq1: ['imagenes/maquillaje/maq_social1.jpeg'],
    mq2: ['imagenes/maquillaje/maq_novia.jpeg'],
    mq3: ['imagenes/maquillaje/maq_quince.jpeg'],
    mq4: ['imagenes/maquillaje/maq_artistico1.jpeg', 'imagenes/maquillaje/maq_artistico2.jpeg', 'imagenes/maquillaje/maq_artistico3.jpeg'],
    mq5: ['imagenes/maquillaje/maq_noche_dia1.jpg'],                                                // ejemplo

    /* DERMATOLOGÍA */
    d1: ['imagenes/dermatologia/tratamiento_y_limpieza_facial_profunda.jpg', 'imagenes/dermatologia/dermaplaning.jpg',
         'imagenes/dermatologia/masaje_facial.jpg'],
    d2: ['imagenes/dermatologia/radio_frecuencia.jpg', 'imagenes/dermatologia/alta_frecuencia.jpg',
         'imagenes/dermatologia/tratamiento_y_limpieza_facial_profunda.jpg'],
    d3: ['imagenes/dermatologia/masaje_facial.jpg', 'imagenes/dermatologia/masajes_corporales.jpg'],

    /* LASHISTA */
    l1: ['imagenes/lashista/lifting.jpeg', 'imagenes/lashista/lifting2.jpeg'],
    l2: ['imagenes/lashista/lifting.jpeg', 'imagenes/lashista/lifting2.jpeg'],
    l3: ['imagenes/lashista/cejas1.jpg', 'imagenes/lashista/cejas2.jpg'],                           // ejemplo
    l4: ['imagenes/lashista/cejas1.jpg', 'imagenes/lashista/cejas2.jpg'],                           // ejemplo
    l5: ['imagenes/lashista/laminado_y_otros.jpeg'],
    l6: ['imagenes/lashista/laminado_y_otros.jpeg'],
    l7: ['imagenes/lashista/lifting_y_otros.jpeg'],
    l8: ['imagenes/lashista/lifting_y_otros.jpeg'],
    l9: ['imagenes/lashista/lifting_y_otros.jpeg', 'imagenes/lashista/laminado_y_otros.jpeg']

  };


  data.items.forEach(s => {

    const isSelected =
      cs.servicios.some(sel => sel.id === s.id);

    const images = s.imgs || [];

    const el = document.createElement('div');

    el.className =
      'service-item' +
      (isSelected ? ' selected' : '');

    el.id = 'csvc-' + s.id;


    /* Carrusel */

    let imagesHTML = '';

    images.forEach((img, index) => {

      imagesHTML += `
        <img
          src="${img}"
          class="${index === 0 ? 'active' : ''}"
          alt="${data.label}"
        >
      `;

    });


    let dotsHTML = '';

    images.forEach((img, index) => {

      dotsHTML += `
        <span
          class="carousel-dot ${index === 0 ? 'active' : ''}"
        ></span>
      `;

    });


    el.innerHTML = `

      <div
        class="service-carousel"
        data-current="0"
      >

        ${imagesHTML}

        <button
          class="carousel-prev"
          onclick="event.stopPropagation(); serviceMove(this,-1)"
        >
          ‹
        </button>

        <button
          class="carousel-next"
          onclick="event.stopPropagation(); serviceMove(this,1)"
        >
          ›
        </button>

        <div class="carousel-dots">
          ${dotsHTML}
        </div>

      </div>


      <div class="service-info">

        <div class="service-name">
          ${s.name}
        </div>

        <div class="service-meta">
          ⏱ ${s.durMin} min
        </div>

      </div>


      <div class="service-price">
        ${fmt$(s.price)}
      </div>


      <div class="service-check">
        ✓
      </div>

    `;


    /* Con una sola foto no hace falta carrusel (sin flechas ni puntitos) */
    if(images.length === 1){
      el.querySelector('.service-carousel').classList.add('una-foto');
    }

    /* Sin fotos cargadas: se muestra el ícono de la categoría */
    if(images.length === 0){
      const c = el.querySelector('.service-carousel');
      c.classList.add('sin-foto');
      c.innerHTML = `<span>${iconoHTML(data)}</span>`;
    }


    /* Click en la tarjeta */

    el.onclick = () => cToggleService(s, el);


    /* Click en los puntitos */

    const dots =
      el.querySelectorAll('.carousel-dot');

    dots.forEach((dot, index) => {

      dot.onclick = function(e){

        e.stopPropagation();

        const carousel =
          el.querySelector('.service-carousel');

        updateServiceCarousel(
          carousel,
          index
        );

      };

    });


    list.appendChild(el);

  });


  cUpdateSelectedBar();
}

function updateServiceCarousel(carousel, index){

  const images = carousel.querySelectorAll('img');
  const dots = carousel.querySelectorAll('.carousel-dot');

  images.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  carousel.dataset.current = index;
}


function serviceMove(button, direction){

  const carousel = button.closest('.service-carousel');

  if(!carousel) return;

  const images = carousel.querySelectorAll('img');

  if(images.length === 0) return;

  let current = Number(carousel.dataset.current || 0);

  current += direction;

  if(current < 0){
    current = images.length - 1;
  }

  if(current >= images.length){
    current = 0;
  }

  updateServiceCarousel(carousel, current);
}

function cToggleService(s,el){
  const idx=cs.servicios.findIndex(sel=>sel.id===s.id);
  if(idx>=0){ cs.servicios.splice(idx,1); el.classList.remove('selected'); }
  else { cs.servicios.push(s); el.classList.add('selected'); }
  guardarCs();
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
  guardarCs();
  const el=document.getElementById('csvc-'+id);
  if(el) el.classList.remove('selected');
  cUpdateSelectedBar();
}

function cGoStep4(){
  if(cs.servicios.length===0) return;
  guardarCs();
  location.href = 'turno.html';
}

if(cs.nombre && cs.categoria){ renderServicios(); }