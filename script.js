const display = document.getElementById('contadorDisplay');
const botonIncrementar = document.getElementById('incrementar');
const botonDecrementar = document.getElementById('decrementar');
const botonReiniciar = document.getElementById('reiniciar');
const STORAGE_KEY = 'contadorInteligente';

let contador = 0;

function cargarContador() {
  const valorGuardado = localStorage.getItem(STORAGE_KEY);
  if (valorGuardado !== null) {
    contador = Number(valorGuardado);
    if (Number.isNaN(contador)) {
      contador = 0;
    }
  }
}

function guardarContador() {
  localStorage.setItem(STORAGE_KEY, contador.toString());
}

function actualizarDisplay() {
  display.textContent = contador;
  if (contador > 0) {
    display.style.color = 'green';
  } else if (contador < 0) {
    display.style.color = 'red';
  } else {
    display.style.color = 'gray';
  }
  guardarContador();
}

botonIncrementar.addEventListener('click', () => {
  contador += 1;
  actualizarDisplay();
});

botonDecrementar.addEventListener('click', () => {
  contador -= 1;
  actualizarDisplay();
});

botonReiniciar.addEventListener('click', () => {
  contador = 0;
  actualizarDisplay();
});

cargarContador();
actualizarDisplay();

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoLista = document.getElementById('todoLista');
const TODO_STORAGE_KEY = 'listaDeTareasProyecto2';

let tareas = [];

function cargarTareas() {
  const tareasGuardadas = localStorage.getItem(TODO_STORAGE_KEY);
  if (tareasGuardadas) {
    try {
      tareas = JSON.parse(tareasGuardadas);
      if (!Array.isArray(tareas)) {
        tareas = [];
      }
    } catch (error) {
      tareas = [];
    }
  }
}

function guardarTareas() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tareas));
}

function renderTareas() {
  todoLista.innerHTML = '';
  tareas.forEach((tarea, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (tarea.completada) {
      li.classList.add('completada');
    }

    const texto = document.createElement('span');
    texto.textContent = tarea.texto;
    texto.addEventListener('click', () => {
      toggleTarea(index);
    });
    li.appendChild(texto);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => {
      eliminarTarea(index);
    });
    li.appendChild(botonEliminar);

    todoLista.appendChild(li);
  });
}

function agregarTarea(texto) {
  const valor = texto.trim();
  if (valor === '') {
    return;
  }
  tareas.push({ texto: valor, completada: false });
  guardarTareas();
  renderTareas();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTarea(index) {
  tareas[index].completada = !tareas[index].completada;
  guardarTareas();
  renderTareas();
}

function eliminarTarea(index) {
  tareas.splice(index, 1);
  guardarTareas();
  renderTareas();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  agregarTarea(todoInput.value);
});

cargarTareas();
renderTareas();

const numeroInput = document.getElementById('numeroInput');
const adivinarBtn = document.getElementById('adivinarBtn');
const nuevoJuegoBtn = document.getElementById('nuevoJuegoBtn');
const resultadoAdivina = document.getElementById('resultadoAdivina');
const intentosContador = document.getElementById('intentosContador');
const MAX_INTENTOS = 10;

let secreto;
let intentos;

function iniciarJuego() {
  secreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  resultadoAdivina.textContent = 'Ingresa un número y presiona Adivinar.';
  intentosContador.textContent = intentos;
  numeroInput.value = '';
  numeroInput.disabled = false;
  adivinarBtn.disabled = false;
}

function terminarJuego(mensaje) {
  resultadoAdivina.textContent = mensaje;
  numeroInput.disabled = true;
  adivinarBtn.disabled = true;
}

function verificarNumero() {
  const valor = Number(numeroInput.value);
  if (!valor || valor < 1 || valor > 100) {
    resultadoAdivina.textContent = 'Escribe un número entre 1 y 100.';
    return;
  }

  intentos += 1;
  intentosContador.textContent = intentos;

  if (valor === secreto) {
    terminarJuego('¡Correcto! Ganaste.');
    return;
  }

  if (intentos >= MAX_INTENTOS) {
    terminarJuego(`Perdiste. El número era ${secreto}.`);
    return;
  }

  if (valor < secreto) {
    resultadoAdivina.textContent = 'Muy bajo';
  } else {
    resultadoAdivina.textContent = 'Muy alto';
  }
}

adivinarBtn.addEventListener('click', verificarNumero);
nuevoJuegoBtn.addEventListener('click', iniciarJuego);

iniciarJuego();

const calculatorDisplay = document.getElementById('calculatorDisplay');
const calculatorButtons = document.querySelectorAll('.calculator-buttons button');
let calculatorInput = '0';

function updateCalculatorDisplay() {
  calculatorDisplay.value = calculatorInput;
}

function resetCalculator() {
  calculatorInput = '0';
  updateCalculatorDisplay();
}

function calcularExpresion(expresion) {
  const valido = /^[0-9+\-*/.() ]+$/;
  if (!valido.test(expresion)) {
    return null;
  }
  try {
    const resultado = Function(`"use strict"; return (${expresion})`)();
    if (resultado === Infinity || resultado === -Infinity || Number.isNaN(resultado)) {
      return null;
    }
    return resultado;
  } catch {
    return null;
  }
}

function applyCalculatorValue(value) {
  if (value === 'C') {
    resetCalculator();
    return;
  }
  if (value === '=') {
    const resultado = calcularExpresion(calculatorInput);
    if (resultado === null) {
      calculatorDisplay.value = 'Error';
      calculatorInput = '0';
      return;
    }
    calculatorInput = String(resultado);
    updateCalculatorDisplay();
    return;
  }

  const ultimo = calculatorInput.slice(-1);
  const operadores = ['+', '-', '*', '/'];
  if (operadores.includes(value)) {
    if (operadores.includes(ultimo)) {
      calculatorInput = calculatorInput.slice(0, -1) + value;
      updateCalculatorDisplay();
      return;
    }
    calculatorInput += value;
    updateCalculatorDisplay();
    return;
  }

  if (calculatorInput === '0') {
    calculatorInput = value;
  } else {
    calculatorInput += value;
  }
  updateCalculatorDisplay();
}

calculatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyCalculatorValue(button.dataset.value);
  });
});

resetCalculator();

const cambiarColorBtn = document.getElementById('cambiarColorBtn');
const restaurarColorBtn = document.getElementById('restaurarColorBtn');
const copiarColorBtn = document.getElementById('copiarColorBtn');
const colorCodigo = document.getElementById('colorCodigo');

const originalBackground = window.getComputedStyle(document.body).backgroundColor;

function rgbToHex(rgb) {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return '#ffffff';
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}

function generarColorHex() {
  const valor = Math.floor(Math.random() * 0xffffff);
  return `#${valor.toString(16).padStart(6, '0')}`;
}

function aplicarColor(color) {
  document.body.style.backgroundColor = color;
  colorCodigo.textContent = color;
}

function copiarAlPortapapeles(texto) {
  navigator.clipboard.writeText(texto).catch(() => {
    alert('No se pudo copiar el código.');
  });
}

cambiarColorBtn.addEventListener('click', () => {
  const nuevoColor = generarColorHex();
  aplicarColor(nuevoColor);
});

restaurarColorBtn.addEventListener('click', () => {
  const originalHex = rgbToHex(originalBackground);
  aplicarColor(originalHex);
});

copiarColorBtn.addEventListener('click', () => {
  copiarAlPortapapeles(colorCodigo.textContent);
});

aplicarColor(rgbToHex(originalBackground));

const minutosInput = document.getElementById('minutosInput');
const segundosInput = document.getElementById('segundosInput');
const iniciarTimerBtn = document.getElementById('iniciarTimerBtn');
const pausarTimerBtn = document.getElementById('pausarTimerBtn');
const reiniciarTimerBtn = document.getElementById('reiniciarTimerBtn');
const timerDisplay = document.getElementById('timerDisplay');
const timerMensaje = document.getElementById('timerMensaje');
let timerInterval = null;
let tiempoRestante = 0;

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}

function actualizarTimer() {
  timerDisplay.textContent = formatearTiempo(tiempoRestante);
}

function finalizarTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  tiempoRestante = 0;
  timerMensaje.textContent = '¡Tiempo terminado!';
}

function iniciarTimer() {
  if (timerInterval) {
    return;
  }

  if (tiempoRestante <= 0) {
    const minutos = Number(minutosInput.value) || 0;
    const segundos = Number(segundosInput.value) || 0;
    tiempoRestante = minutos * 60 + segundos;
  }

  if (tiempoRestante <= 0) {
    timerMensaje.textContent = 'Ingresa minutos o segundos válidos.';
    return;
  }

  timerMensaje.textContent = '';
  actualizarTimer();

  timerInterval = setInterval(() => {
    tiempoRestante -= 1;
    if (tiempoRestante <= 0) {
      finalizarTimer();
      actualizarTimer();
      return;
    }
    actualizarTimer();
  }, 1000);
}

function pausarTimer() {
  if (!timerInterval) {
    return;
  }
  clearInterval(timerInterval);
  timerInterval = null;
  timerMensaje.textContent = 'Pausado.';
}

function reiniciarTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  tiempoRestante = 0;
  minutosInput.value = '0';
  segundosInput.value = '0';
  timerMensaje.textContent = '';
  actualizarTimer();
}

iniciarTimerBtn.addEventListener('click', iniciarTimer);
pausarTimerBtn.addEventListener('click', pausarTimer);
reiniciarTimerBtn.addEventListener('click', reiniciarTimer);

const mayusculasCheckbox = document.getElementById('mayusculasCheckbox');
const minusculasCheckbox = document.getElementById('minusculasCheckbox');
const numerosCheckbox = document.getElementById('numerosCheckbox');
const simbolosCheckbox = document.getElementById('simbolosCheckbox');
const longitudRange = document.getElementById('longitudRange');
const longitudValor = document.getElementById('longitudValor');
const generarPasswordBtn = document.getElementById('generarPasswordBtn');
const copiarPasswordBtn = document.getElementById('copiarPasswordBtn');
const passwordDisplay = document.getElementById('passwordDisplay');

function generarPassword(longitud, opciones) {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*()_+[]{}|;:,.<>?';
  let caracteres = '';

  if (opciones.mayusculas) caracteres += mayusculas;
  if (opciones.minusculas) caracteres += minusculas;
  if (opciones.numeros) caracteres += numeros;
  if (opciones.simbolos) caracteres += simbolos;

  if (caracteres === '') {
    return '';
  }

  let contraseña = '';
  for (let i = 0; i < longitud; i += 1) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contraseña += caracteres[indice];
  }

  return contraseña;
}

function actualizarLongitud() {
  longitudValor.textContent = longitudRange.value;
}

function generarPasswordClick() {
  const longitud = Number(longitudRange.value);
  const opciones = {
    mayusculas: mayusculasCheckbox.checked,
    minusculas: minusculasCheckbox.checked,
    numeros: numerosCheckbox.checked,
    simbolos: simbolosCheckbox.checked,
  };

  const contraseña = generarPassword(longitud, opciones);
  if (contraseña === '') {
    passwordDisplay.textContent = 'Selecciona al menos un tipo de carácter.';
    return;
  }

  passwordDisplay.textContent = contraseña;
}

function copiarPassword() {
  const texto = passwordDisplay.textContent;
  if (!texto || texto === 'Selecciona al menos un tipo de carácter.') {
    return;
  }
  navigator.clipboard.writeText(texto).catch(() => {
    alert('No se pudo copiar la contraseña.');
  });
}

longitudRange.addEventListener('input', actualizarLongitud);
generarPasswordBtn.addEventListener('click', generarPasswordClick);
copiarPasswordBtn.addEventListener('click', copiarPassword);

const themeToggle = document.getElementById('themeToggle');
const themeModeLabel = document.getElementById('themeModeLabel');
const THEME_STORAGE_KEY = 'temaPreferido';

function aplicarTema(tema) {
  document.body.classList.toggle('dark-mode', tema === 'dark');
  document.body.classList.toggle('light-mode', tema === 'light');
  themeToggle.checked = tema === 'dark';
  themeModeLabel.textContent = tema === 'dark' ? 'Modo oscuro' : 'Modo claro';
}

function guardarTema(tema) {
  localStorage.setItem(THEME_STORAGE_KEY, tema);
}

function cargarTema() {
  const temaGuardado = localStorage.getItem(THEME_STORAGE_KEY);
  if (temaGuardado === 'dark' || temaGuardado === 'light') {
    return temaGuardado;
  }
  return 'dark';
}

themeToggle.addEventListener('change', () => {
  const tema = themeToggle.checked ? 'dark' : 'light';
  aplicarTema(tema);
  guardarTema(tema);
});

const temaInicial = cargarTema();
aplicarTema(temaInicial);

const piedraBtn = document.getElementById('piedraBtn');
const papelBtn = document.getElementById('papelBtn');
const tijeraBtn = document.getElementById('tijeraBtn');
const usuarioEleccion = document.getElementById('usuarioEleccion');
const computadoraEleccion = document.getElementById('computadoraEleccion');
const resultadoRps = document.getElementById('resultadoRps');
const puntosUsuario = document.getElementById('puntosUsuario');
const puntosComputadora = document.getElementById('puntosComputadora');
const reiniciarRpsBtn = document.getElementById('reiniciarRpsBtn');

let marcadorUsuario = 0;
let marcadorComputadora = 0;

function elegirComputadora() {
  const opciones = ['Piedra', 'Papel', 'Tijera'];
  return opciones[Math.floor(Math.random() * opciones.length)];
}

function determinarGanador(usuario, computadora) {
  if (usuario === computadora) {
    return 'Empate';
  }
  if (
    (usuario === 'Piedra' && computadora === 'Tijera') ||
    (usuario === 'Papel' && computadora === 'Piedra') ||
    (usuario === 'Tijera' && computadora === 'Papel')
  ) {
    return 'Usuario';
  }
  return 'Computadora';
}

function jugarRps(opcionUsuario) {
  const opcionComputadora = elegirComputadora();
  usuarioEleccion.textContent = opcionUsuario;
  computadoraEleccion.textContent = opcionComputadora;
  const ganador = determinarGanador(opcionUsuario, opcionComputadora);

  if (ganador === 'Usuario') {
    resultadoRps.textContent = '¡Ganaste!';
    marcadorUsuario += 1;
  } else if (ganador === 'Computadora') {
    resultadoRps.textContent = 'Perdiste.';
    marcadorComputadora += 1;
  } else {
    resultadoRps.textContent = 'Empate.';
  }

  puntosUsuario.textContent = marcadorUsuario;
  puntosComputadora.textContent = marcadorComputadora;
}

function reiniciarMarcador() {
  marcadorUsuario = 0;
  marcadorComputadora = 0;
  usuarioEleccion.textContent = '-';
  computadoraEleccion.textContent = '-';
  resultadoRps.textContent = '-';
  puntosUsuario.textContent = marcadorUsuario;
  puntosComputadora.textContent = marcadorComputadora;
}

piedraBtn.addEventListener('click', () => jugarRps('Piedra'));
papelBtn.addEventListener('click', () => jugarRps('Papel'));
tijeraBtn.addEventListener('click', () => jugarRps('Tijera'));
reiniciarRpsBtn.addEventListener('click', reiniciarMarcador);

// Proyecto 10: Galería con filtros y modal
const galleryGrid = document.getElementById('galleryGrid');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const galleryFilters = Array.from(document.querySelectorAll('.gallery-filter'));
const gallerySearch = document.getElementById('gallerySearch');
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

function filtrarGaleria(filtro, textoBusqueda) {
  const busqueda = textoBusqueda.trim().toLowerCase();
  galleryItems.forEach((item) => {
    const categoria = item.dataset.category;
    const keywords = item.dataset.keywords.toLowerCase();
    const titulo = item.querySelector('p').textContent.toLowerCase();
    const coincideFiltro = filtro === 'all' || categoria === filtro;
    const coincideBusqueda =
      busqueda === '' || keywords.includes(busqueda) || titulo.includes(busqueda);

    item.style.display = coincideFiltro && coincideBusqueda ? 'block' : 'none';
  });
}

function activarFiltro(filtro) {
  galleryFilters.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filtro);
  });
  filtrarGaleria(filtro, gallerySearch.value);
}

function abrirModal(item) {
  const imagen = item.querySelector('img');
  modalImage.src = imagen.src;
  modalImage.alt = imagen.alt;
  modalCaption.textContent = item.querySelector('p').textContent;
  galleryModal.classList.add('open');
}

function cerrarModal() {
  galleryModal.classList.remove('open');
}

galleryFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    activarFiltro(filterButton.dataset.filter);
  });
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => abrirModal(item));
});

gallerySearch.addEventListener('input', () => {
  const filtroActivo = galleryFilters.find((button) => button.classList.contains('active'))?.dataset.filter || 'all';
  filtrarGaleria(filtroActivo, gallerySearch.value);
});

modalClose.addEventListener('click', cerrarModal);
galleryModal.addEventListener('click', (event) => {
  if (event.target === galleryModal) {
    cerrarModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && galleryModal.classList.contains('open')) {
    cerrarModal();
  }
});

function mostrarSoloProyecto(seccionId) {
  const secciones = document.querySelectorAll('section[id^="Proyecto-"]');
  secciones.forEach((seccion) => {
    const esSeleccionada = seccion.id === seccionId;
    seccion.classList.toggle('section-hidden', !esSeleccionada);
  });
}

function marcarEnlaceActivo(enlaceSeleccionado) {
  const enlaces = document.querySelectorAll('#Indice-links a');
  enlaces.forEach((enlace) => {
    enlace.classList.toggle('active', enlace === enlaceSeleccionado);
  });
}

const enlacesProyecto = document.querySelectorAll('#Indice-links a');
if (enlacesProyecto.length) {
  enlacesProyecto.forEach((enlace) => {
    enlace.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = enlace.getAttribute('href');
      const proyectoId = hash.replace('#', 'Proyecto-');
      mostrarSoloProyecto(proyectoId);
      marcarEnlaceActivo(enlace);
      window.location.hash = hash;
    });

    if (window.location.hash === enlace.getAttribute('href')) {
      mostrarSoloProyecto('Proyecto-' + enlace.getAttribute('href').replace('#', ''));
      marcarEnlaceActivo(enlace);
    }
  });
}

activarFiltro('all');

actualizarLongitud();
actualizarTimer();
