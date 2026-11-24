/* ==========================================================================
   PASO 1 — DATOS (datos.html)
   Validación del formulario de la clienta. Si todo está bien, sigue a
   categorias.html.
   ========================================================================== */

/* Si la clienta vuelve atrás, se recuperan los datos que ya había cargado */
document.getElementById('cNombre').value   = cs.nombre;
document.getElementById('cApellido').value = cs.apellido;
document.getElementById('cTel').value      = cs.tel;
document.getElementById('cEmail').value    = cs.email;

function cGoStep2(){

  const n = document.getElementById('cNombre').value.trim();
  const a = document.getElementById('cApellido').value.trim();
  const t = document.getElementById('cTel').value.trim();
  const e = document.getElementById('cEmail').value.trim();

  // Limpiar mensaje anterior
  const oldMsg = document.getElementById('cFormError');
  if(oldMsg) oldMsg.remove();

  let error = '';

  // Nombre y apellido: solo letras, espacios y acentos
  const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,}$/.test(n);
  const apellidoValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,}$/.test(a);

  if(!nombreValido){
    error = 'Ingresá un nombre válido.';
  }
  else if(!apellidoValido){
    error = 'Ingresá un apellido válido.';
  }

  else if(!esTelefonoArgentino(t)){
    error = 'Ingresá un número de teléfono válido.';
  }

  // Email opcional, pero si se completa debe tener formato válido
  else if(e && !esEmailValido(e)){
    error = 'Ingresá un email válido. Ejemplo: nombre@gmail.com';
  }

  // Mostrar error sin alert
  if(error){
    const msg = document.createElement('div');
    msg.id = 'cFormError';
    msg.className = 'c-form-error';
    msg.textContent = error;

    document.querySelector('#cs1 .c-form-body').appendChild(msg);

    return;
  }

  // Datos válidos
  cs.nombre = n;
  cs.apellido = a;
  cs.tel = t;
  cs.email = e;
  guardarCs();

  location.href = 'categorias.html';
}

function esTelefonoArgentino(tel){

  // Sacamos espacios, guiones, paréntesis y puntos
  const limpio = tel.replace(/[\s().-]/g,'');

  return /^(\+?54?9?|0)?[1-9]\d{8,10}$/.test(limpio);
}


function esEmailValido(email){

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

}
