/**
 * SERVIU Frontend v4.0 - SIN TOKENS, SIN HEADERS CUSTOM
 * Usa text/plain para evitar preflight CORS
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbyF02I-jGPHs50iv2FcrJPxNrILZEyAll2A4qkAmnjnr-6tRPcN5GZ6smL4JhThPXin/exec';

// ============================================
// CACHE
// ============================================
const Cache = {
  config: null, entidades: [], evaluadores: [], asignaciones: [],
  entidadesById: new Map(), evaluadoresById: new Map(), asignacionesByEvaluador: new Map(),
  loaded: { config: false, entidades: false, evaluadores: false, asignaciones: false },
  clear() {
    this.config = null; this.entidades = []; this.evaluadores = []; this.asignaciones = [];
    this.entidadesById.clear(); this.evaluadoresById.clear(); this.asignacionesByEvaluador.clear();
    Object.keys(this.loaded).forEach(k => this.loaded[k] = false);
  },
  indexEntidades(data) { this.entidades = data || []; this.entidadesById.clear(); this.entidades.forEach(e => this.entidadesById.set(String(e.id), e)); this.loaded.entidades = true; },
  indexEvaluadores(data) { this.evaluadores = data || []; this.evaluadoresById.clear(); this.evaluadores.forEach(e => this.evaluadoresById.set(String(e.id), e)); this.loaded.evaluadores = true; },
  indexAsignaciones(data) { this.asignaciones = data || []; this.asignacionesByEvaluador.clear(); this.asignaciones.forEach(a => { const key = String(a.evaluador_id); if (!this.asignacionesByEvaluador.has(key)) this.asignacionesByEvaluador.set(key, []); this.asignacionesByEvaluador.get(key).push(a); }); this.loaded.asignaciones = true; },
  getEntidad(id) { return this.entidadesById.get(String(id)); },
  getEvaluador(id) { return this.evaluadoresById.get(String(id)); },
  getAsignacionesByEvaluador(id) { return this.asignacionesByEvaluador.get(String(id)) || []; }
};

let currentUser = null;
let adminTabInit = new Set();

// ============================================
// UTILIDADES DOM
// ============================================
const $ = id => document.getElementById(id);
const show = id => { const el = $(id); if (el) el.style.display = 'block'; };
const hide = id => { const el = $(id); if (el) el.style.display = 'none'; };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(id);
  if (el) el.classList.add('active');
}

function showMessage(id, text, type) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'message ' + type;
  el.style.display = 'block';
  if (el._timeout) clearTimeout(el._timeout);
  el._timeout = setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function normalizarRUT(rut) {
  const limpio = rut.trim().replace(/\./g, '').replace(/\s/g, '');
  if (limpio.toUpperCase() === 'ADMIN') return 'ADMIN';
  return limpio.toLowerCase();
}

// ============================================
// BARRA DE PROGRESO
// ============================================
const Progress = {
  overlay: null, text: null, queue: [],
  init() { this.overlay = $('progressOverlay'); this.text = $('progressText'); },
  show(text) {
    if (!this.overlay) this.init();
    this.queue.push(text || 'Cargando...');
    if (this.text) this.text.textContent = this.queue[this.queue.length - 1];
    if (this.overlay) this.overlay.style.display = 'flex';
  },
  update(text) {
    if (this.queue.length > 0) this.queue[this.queue.length - 1] = text;
    if (this.text) this.text.textContent = text;
  },
  hide() {
    this.queue.pop();
    if (this.queue.length === 0) { if (this.overlay) this.overlay.style.display = 'none'; }
    else { if (this.text) this.text.textContent = this.queue[this.queue.length - 1]; }
  }
};

// ============================================
// API - SIN headers custom, SIN tokens
// Content-Type: text/plain evita preflight CORS
// ============================================
async function apiFetch(url, options = {}, retries = 2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  // Configuraciones por defecto necesarias para Google Apps Script
  const defaultOptions = {
    mode: 'cors',
    redirect: 'follow', // OBLIGATORIO para que el navegador siga la redirección de Google
    ...options,
    signal: controller.signal
  };

  try {
    const res = await fetch(url, defaultOptions);
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (retries > 0 && err.name !== 'AbortError') {
      await new Promise(r => setTimeout(r, 1000));
      return apiFetch(url, options, retries - 1);
    }
    throw err;
  }
}

async function apiPost(payload) {
  return apiFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  });
}

async function apiGet(action, params = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  return apiFetch(API_URL + '?' + qs);
}

// ============================================
// CARGA DE DATOS
// ============================================
async function cargarConfig(force = false) {
  if (Cache.loaded.config && !force) return Cache.config;
  const data = await apiGet('config');
  Cache.config = data;
  Cache.loaded.config = true;
  return data;
}

async function cargarEntidades(force = false) {
  if (Cache.loaded.entidades && !force) return Cache.entidades;
  const data = await apiGet('entidades');
  Cache.indexEntidades(data.entidades);
  return Cache.entidades;
}

async function cargarEvaluadores(force = false) {
  if (Cache.loaded.evaluadores && !force) return Cache.evaluadores;
  const data = await apiGet('evaluadores');
  Cache.indexEvaluadores(data.evaluadores);
  return Cache.evaluadores;
}

async function cargarAsignaciones(force = false) {
  if (Cache.loaded.asignaciones && !force) return Cache.asignaciones;
  const data = await apiGet('asignaciones');
  Cache.indexAsignaciones(data.asignaciones);
  return Cache.asignaciones;
}

async function cargarAsignacionesEvaluador(evaluadorId, force = false) {
  const key = String(evaluadorId);
  if (Cache.asignacionesByEvaluador.has(key) && !force) return Cache.getAsignacionesByEvaluador(evaluadorId);
  const data = await apiGet('asignaciones', { evaluador_id: evaluadorId });
  const asigs = data.asignaciones || [];
  Cache.asignacionesByEvaluador.set(key, asigs);
  return asigs;
}

async function cargarDatosBase() {
  const [config, entidades, evaluadores] = await Promise.all([cargarConfig(), cargarEntidades(), cargarEvaluadores()]);
  return { config, entidades, evaluadores };
}

// ============================================
// LOGIN
// ============================================
$('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const rutRaw = $('loginRut').value.trim();
  const isAdminInput = rutRaw.toUpperCase() === 'ADMIN';
  const rut = isAdminInput ? 'ADMIN' : normalizarRUT(rutRaw);
  const password = $('loginPassword').value;

  Progress.show('Verificando credenciales...');

  try {
    const data = await apiGet('login', { rut, password });
    Progress.hide();

    if (data.error) {
      showMessage('loginError', data.error, 'error');
      return;
    }

    currentUser = data;

    if (data.admin || isAdminInput) {
      Progress.show('Cargando panel de administracion...');
      showScreen('adminScreen');
      await initAdmin();
      Progress.hide();
    } else {
      Progress.show('Cargando sus asignaciones...');
      showScreen('mainScreen');
      $('userName').textContent = data.nombre || data.nombre_completo || 'Evaluador';
      await initEvaluador();
      Progress.hide();
    }
  } catch (err) {
    Progress.hide();
    showMessage('loginError', 'Error de conexion: ' + err.message, 'error');
    console.error('Login error:', err);
  }
});

// ============================================
// LOGOUT
// ============================================
$('btnLogout').addEventListener('click', logout);
$('btnAdminLogout').addEventListener('click', logout);

function logout() {
  currentUser = null;
  adminTabInit.clear();
  Cache.clear();
  $('loginRut').value = '';
  $('loginPassword').value = '';
  showScreen('loginScreen');
}

// ============================================
// PANEL EVALUADOR
// ============================================
async function initEvaluador() {
  await Promise.all([cargarConfig(), cargarEntidades(), cargarAsignacionesEvaluador(currentUser.evaluador_id)]);
  renderAsignaciones();
}

function renderAsignaciones() {
  const container = $('listaAsignaciones');
  const asigs = Cache.getAsignacionesByEvaluador(currentUser.evaluador_id);

  if (!asigs || asigs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;">No tienes asignaciones pendientes.</p>';
    return;
  }

  const porEntidad = new Map();
  asigs.forEach(a => {
    const key = String(a.entidad_id);
    if (!porEntidad.has(key)) {
      const entidad = Cache.getEntidad(a.entidad_id) || { nombre: a.entidad_nombre, provincia: 'N/A', programa: 'N/A' };
      porEntidad.set(key, { entidad, etapas: [] });
    }
    porEntidad.get(key).etapas.push(a);
  });

  const frag = document.createDocumentFragment();
  porEntidad.forEach((grupo, entId) => {
    const div = document.createElement('div');
    div.className = 'asignacion-item';
    div.onclick = () => seleccionarEntidad(entId);
    div.innerHTML = `
      <h3>${escHtml(grupo.entidad.nombre)}</h3>
      <p><strong>Provincia:</strong> ${escHtml(grupo.entidad.provincia || 'N/A')} | <strong>Programa:</strong> ${escHtml(grupo.entidad.programa || 'N/A')}</p>
      <p><strong>Etapas asignadas:</strong> ${grupo.etapas.length}</p>
      <div style="margin-top:0.5rem;">${grupo.etapas.map(e => `<span class="etapa-badge">Etapa ${e.etapa_num}</span>`).join('')}</div>
    `;
    frag.appendChild(div);
  });

  container.innerHTML = '';
  container.appendChild(frag);
}

function seleccionarEntidad(entidadId) {
  const entidad = Cache.getEntidad(entidadId);
  const etapas = Cache.getAsignacionesByEvaluador(currentUser.evaluador_id).filter(a => String(a.entidad_id) === String(entidadId));
  if (!entidad) return;

  currentUser.entidadSeleccionada = entidad;
  currentUser.etapasDisponibles = etapas;

  hide('panelAsignaciones');
  show('panelCalificacion');

  $('califEntidad').textContent = escHtml(entidad.nombre);
  $('califPrograma').textContent = escHtml(entidad.programa || 'N/A');
  $('califProvincia').textContent = escHtml(entidad.provincia || 'N/A');

  renderSelectorEtapa(etapas);
}

function renderSelectorEtapa(etapas) {
  const container = $('itemsContainer');
  const select = document.createElement('select');
  select.id = 'selectEtapa';
  select.innerHTML = '<option value="">-- Seleccione Etapa --</option>' + etapas.map(e => `<option value="${e.etapa_num}">Etapa ${e.etapa_num}</option>`).join('');
  select.onchange = cargarItemsCalificacion;
  container.innerHTML = '<p><strong>Seleccione la Etapa a Calificar</strong></p>';
  container.appendChild(select);
  $('itemsCalifContainer').innerHTML = '';
}

async function cargarItemsCalificacion() {
  const etapaNum = $('selectEtapa').value;
  if (!etapaNum) { $('itemsCalifContainer').innerHTML = ''; return; }

  const etapaInfo = Cache.config?.etapas?.find(e => e.num == etapaNum);
  if (!etapaInfo) return;

  Progress.show('Cargando calificacion existente...');
  const califExistente = await buscarCalificacionExistente(currentUser.entidadSeleccionada.id, etapaNum);
  Progress.hide();

  // Llamamos a la nueva funcion para renderizar la tabla dinámica
  renderEvaluationTable(etapaInfo.items, califExistente?.notas || {});
}

function renderEvaluationTable(items, notasGuardadas) {
  const container = $('itemsCalifContainer');
  const etapaNum = $('selectEtapa').value;
  
  // Limpiar contenedores superiores de herencia visual si es necesario
  const itemsContainer = $('itemsContainer');
  if (itemsContainer && itemsContainer.children.length > 1) {
    while (itemsContainer.childNodes.length > 2) {
      itemsContainer.removeChild(itemsContainer.lastChild);
    }
  }
  
  // Extraer dinámicamente los textos de la hoja Config mediante el Cache
  const etapaInfo = Cache.config?.etapas?.find(e => e.num == etapaNum);
  const etapaNombreLargo = etapaInfo?.etapa_nombre || "ORGANIZACIÓN DE LA DEMANDA / DIAGNÓSTICO TÉCNICO Y/O SOCIAL";
  
  // Si en tu hoja Config guardas la descripción larga del cuadro, se mapeará aquí. 
  // Si no se encuentra, usará el texto oficial de respaldo.
  const etapaDescripcion = etapaInfo?.descripcion || "Comprende: diagnóstico del estado de la situación de las familias y/o su necesidad habitacional, reforzamiento de la organización de las familias para el proceso de postulación, aprobación participativa del proyecto habitacional, acompañamiento durante la gestación de (los) proyecto(s) y/o tramitación para la presentación de antecedentes técnicos y sociales a SERVIU, según corresponda.";

  let tableHTML = `
    <div class="contenedor-matriz">
      <!-- Encabezado Dinámico Estilo Matriz SERVIU (image_bbc8da.png) -->
      <div class="header-etapa">
        <div class="titulo-etapa">
          <strong>ETAPA ${etapaNum}. ${escHtml(etapaNombreLargo)}</strong>
          <p>${escHtml(etapaDescripcion)}</p>
        </div>
        <div class="rango-calificaciones">
          <div class="rango-item"><strong>MALO</strong><br>(0-50)</div>
          <div class="rango-item"><strong>ACEPTABLE</strong><br>(51-79)</div>
          <div class="rango-item"><strong>BUENO</strong><br>(80-100)</div>
        </div>
      </div>

      <div class="tabla-evaluacion-container">
        <table class="tabla-evaluacion" id="evalTable">
          <thead>
            <tr>
              <th class="text-center" style="width: 80px; text-align: center;">Ítem N°</th>
              <th>Factor / Descripción</th>
              <th class="text-center" style="width: 120px; text-align: center;">Nota (1-100)</th>
            </tr>
          </thead>
          <tbody id="evalTbody">
  `;

  items.forEach(item => {
        const itemNum = item.num || item.numero || item.item_num || item.id || '-';
        const itemNombre = item.factor || item.descripcion || item.nombre || item.Item_nombre || 'Sin descripción';
    const val = notasGuardadas[itemNum] !== undefined ? notasGuardadas[itemNum] : '';

    tableHTML += `
      <tr data-item="${itemNum}">
        <td class="text-center" style="text-align: center; width: 80px;"><strong>${itemNum}</strong></td>
        <td>${escHtml(itemNombre)}</td>
        <td class="text-center" style="position: relative; text-align: center; width: 120px;">
          <div class="input-wrapper">
            <input type="number" class="nota-input" id="item_${itemNum}" data-num="${itemNum}" min="1" max="100" value="${escHtml(val)}" required>
            <span class="error-msg" id="error_${itemNum}"></span>
          </div>
        </td>
      </tr>
    `;
  });

  tableHTML += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 0 !important; border: none !important;">
                <div class="celda-total-matriz">
                  <div class="texto-precalif"><strong>PRECALIFICACIÓN ETAPA ${etapaNum}.</strong></div>
                  <div id="badgeRango" class="badge-rango-dinamico">-</div>
                  <div id="promedioFinal" class="valor-promedio-final">-</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = tableHTML;

  // Añadir eventos a los inputs para el cálculo
  const inputs = container.querySelectorAll('.nota-input');
  inputs.forEach(input => {
    input.addEventListener('input', calcularTotalesTabla);
  });
  
  // Ejecutar cálculo por si hay notas persistidas de revisiones previas
  calcularTotalesTabla();
}

function calcularTotalesTabla() {
  const inputs = document.querySelectorAll('.nota-input');
  let sum = 0;
  let count = 0;
  let tieneErrores = false;

  inputs.forEach(input => {
    const val = parseInt(input.value);
    const itemNum = input.dataset.num;
    const errorSpan = $('error_' + itemNum);

    if (input.value === '') {
      input.classList.remove('invalid');
      if (errorSpan) errorSpan.textContent = '';
      return;
    }

    if (isNaN(val) || val < 1 || val > 100) {
      input.classList.add('invalid');
      if (errorSpan) errorSpan.textContent = '¡1-100!';
      tieneErrores = true;
    } else {
      input.classList.remove('invalid');
      if (errorSpan) errorSpan.textContent = '';
      sum += val;
      count++;
    }
  });

  const promedioCell = $('promedioFinal');
  const badgeRango = $('badgeRango');

  if (promedioCell && badgeRango) {
    // Si todas las notas están ingresadas y no hay errores de rango
    if (count > 0 && count === inputs.length && !tieneErrores) {
      const promedio = Math.round(sum / inputs.length);
      promedioCell.textContent = promedio;

      // Definición de Rangos según límites SERVIU (Imagen 1)
      badgeRango.className = "badge-rango-dinamico"; // Reset
      if (promedio >= 80) {
        badgeRango.textContent = "BUENO";
        badgeRango.classList.add("Bueno");
      } else if (promedio >= 51) {
        badgeRango.textContent = "ACEPTABLE";
        badgeRango.classList.add("Aceptable");
      } else {
        badgeRango.textContent = "MALO";
        badgeRango.classList.add("Malo");
      }
    } else {
      // Estado inicial o cálculo parcial
      promedioCell.textContent = count > 0 ? Math.round(sum / count) + "..." : "-";
      badgeRango.textContent = "-";
      badgeRango.className = "badge-rango-dinamico";
    }
  }
}

async function buscarCalificacionExistente(entidadId, etapaNum) {
  try {
    const data = await apiGet('calificaciones', { entidad_id: entidadId, etapa_num: etapaNum });
    return data.calificaciones?.find(c => c.evaluador_id == currentUser.evaluador_id) || null;
  } catch (err) { return null; }
}

// ============================================
// GUARDAR CALIFICACION
// ============================================
$('formCalificacion').addEventListener('submit', async function(e) {
  e.preventDefault();

  const etapaNum = $('selectEtapa').value;
  if (!etapaNum) { showMessage('califMessage', 'Seleccione una etapa', 'error'); return; }

  const etapaInfo = Cache.config?.etapas?.find(e => e.num == etapaNum);
  if (!etapaInfo) return;

  const notas = {};
  for (const item of etapaInfo.items) {
    const itemNum = item.num || item.numero || item.item_num || item.id || '-';
    const input = $('item_' + itemNum);
    if (!input) continue;
    const valor = parseInt(input.value);
    if (isNaN(valor) || valor < 1 || valor > 100) {
      showMessage('califMessage', `La nota del item ${itemNum} debe ser entre 1 y 100`, 'error');
      return;
    }
    notas[itemNum] = valor;
  }

  const payload = {
    action: 'guardar_calificacion',
    evaluador_id: currentUser.evaluador_id,
    evaluador_nombre: currentUser.nombre,
    entidad_id: currentUser.entidadSeleccionada.id,
    entidad_nombre: currentUser.entidadSeleccionada.nombre,
    etapa_num: etapaNum,
    notas: notas
  };

  Progress.show('Guardando calificacion...');
  try {
    const data = await apiPost(payload);
    Progress.hide();
    if (data.success) {
      showMessage('califMessage', '✅ Calificacion guardada exitosamente', 'success');
      setTimeout(volverALista, 2000);
    } else {
      showMessage('califMessage', data.error || 'Error al guardar', 'error');
    }
  } catch (err) {
    Progress.hide();
    showMessage('califMessage', 'Error de conexion: ' + err.message, 'error');
  }
});

$('btnVolver').addEventListener('click', volverALista);
$('btnCancelar').addEventListener('click', volverALista);

async function volverALista() {
  hide('panelCalificacion');
  show('panelAsignaciones');
  $('califMessage').style.display = 'none';
  await cargarAsignacionesEvaluador(currentUser.evaluador_id, true);
  renderAsignaciones();
}

// ============================================
// PANEL ADMIN
// ============================================
async function initAdmin() {
  Progress.show('Cargando datos...');
  await cargarDatosBase();
  Progress.hide();
  await initTab('tabEvaluadores');
}

function setupAdminNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const tabId = this.dataset.tab;
      if (!tabId) return;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      $(tabId).classList.add('active');
      if (!adminTabInit.has(tabId)) await initTab(tabId);
    });
  });
}

async function initTab(tabId) {
  if (adminTabInit.has(tabId)) return;
  adminTabInit.add(tabId);
  switch (tabId) {
    case 'tabEvaluadores': await cargarEvaluadoresAdmin(); break;
    case 'tabEntidades': await cargarEntidadesAdmin(); break;
    case 'tabAsignaciones': await initAsignacionesMasivas(); break;
    case 'tabReportes':
      $('tablaResumen').innerHTML = '<p style="text-align:center;color:#888;">Presione "Generar" para ver resultados</p>';
      hide('panelReporteDetalle'); break;
    case 'tabCarga': break;
    case 'tabConfig': $('chkVerNotas').checked = Cache.config?.ver_notas_otros || false; break;
  }
}

// ============================================
// ADMIN: EVALUADORES
// ============================================
$('formEvaluador').addEventListener('submit', async function(e) {
  e.preventDefault();
  const payload = {
    action: 'crear_evaluador',
    nombre_completo: $('evalNombre').value.trim(),
    rut: $('evalRut').value.trim(),
    password: $('evalPassword').value
  };
  Progress.show('Creando evaluador...');
  try {
    const data = await apiPost(payload);
    Progress.hide();
    if (data.success) { alert('✅ Evaluador creado exitosamente'); $('formEvaluador').reset(); await cargarEvaluadores(true); await cargarEvaluadoresAdmin(); }
    else { alert('Error: ' + (data.error || 'No se pudo crear')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
});

async function cargarEvaluadoresAdmin() {
  const container = $('listaEvaluadoresAdmin');
  const data = Cache.evaluadores;
  if (data.length === 0) { container.innerHTML = '<p style="text-align:center;color:#888;">No hay evaluadores</p>'; return; }

  const table = document.createElement('table');
  table.className = 'tabla-admin';
  table.innerHTML = `<thead><tr><th>Nombre</th><th>RUT</th><th>Activo</th><th>Acciones</th></tr></thead>`;
  const tbody = document.createElement('tbody');

  data.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escHtml(e.nombre)}</td>
      <td>${escHtml(e.rut)}</td>
      <td>${escHtml(e.activo)}</td>
      <td>
        <button class="btn-icon" title="Editar" data-action="edit-pass" data-id="${escHtml(e.id)}">✏️</button>
        <button class="btn-icon btn-delete" title="Eliminar" data-action="delete" data-id="${escHtml(e.id)}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(table);
  tbody.addEventListener('click', handleEvaluadorAction);
  actualizarSelectEvaluadores(data);
}

function handleEvaluadorAction(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'edit-pass') editarPassword(id);
  else if (action === 'delete') borrarEvaluador(id);
}

function actualizarSelectEvaluadores(evaluadores) {
  const select = $('asigEvaluadorMasivo');
  if (!select) return;
  const activos = evaluadores.filter(e => e.activo === 'SI');
  select.innerHTML = '<option value="">-- Seleccione Evaluador --</option>' +
    activos.map(e => `<option value="${escHtml(e.id)}">${escHtml(e.nombre)} (${escHtml(e.rut)})</option>`).join('');
}

// ============================================
// ADMIN: ENTIDADES
// ============================================
$('formEntidad').addEventListener('submit', async function(e) {
  e.preventDefault();
  let proyectos = [];
  try {
    const jsonText = $('entProyectos').value.trim();
    if (jsonText) proyectos = JSON.parse(jsonText);
  } catch (err) { alert('Error en formato JSON de proyectos'); return; }

  const payload = {
    action: 'crear_entidad',
    nombre_entidad: $('entNombre').value.trim(),
    rut: $('entRut').value.trim(),
    provincia: $('entProvincia').value.trim(),
    programa: $('entPrograma').value.trim(),
    proyectos: proyectos,
    total_familias: proyectos.reduce((sum, p) => sum + (parseInt(p.familias) || 0), 0)
  };
  Progress.show('Creando entidad...');
  try {
    const data = await apiPost(payload);
    Progress.hide();
    if (data.success) { alert('✅ Entidad creada exitosamente'); $('formEntidad').reset(); await cargarEntidades(true); await cargarEntidadesAdmin(); }
    else { alert('Error: ' + (data.error || 'No se pudo crear')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
});

async function cargarEntidadesAdmin() {
  const container = $('listaEntidadesAdmin');
  const data = Cache.entidades;
  if (data.length === 0) { container.innerHTML = '<p style="text-align:center;color:#888;">No hay entidades</p>'; return; }

  const table = document.createElement('table');
  table.className = 'tabla-admin';
  table.innerHTML = `<thead><tr><th>ID</th><th>Nombre</th><th>RUT</th><th>Provincia</th><th>Programa</th><th>Familias</th></tr></thead>`;
  const tbody = document.createElement('tbody');

  data.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escHtml(e.id)}</td>
      <td>${escHtml(e.nombre)}</td>
      <td>${escHtml(e.rut)}</td>
      <td>${escHtml(e.provincia)}</td>
      <td>${escHtml(e.programa)}</td>
      <td>${escHtml(e.total_familias || 0)}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(table);
}

// ============================================
// ADMIN: ASIGNACIONES MASIVAS
// ============================================
let asignacionesDebounceTimer = null;

async function initAsignacionesMasivas() {
  Progress.show('Cargando datos de asignaciones...');
  await Promise.all([cargarEntidades(), cargarEvaluadores(), cargarAsignaciones()]);
  Progress.hide();

  const provincias = [...new Set(Cache.entidades.map(e => e.provincia).filter(Boolean))].sort();
  const filtroSelect = $('filtroProvincia');
  filtroSelect.innerHTML = '<option value="">Todas las provincias</option>' +
    provincias.map(p => `<option value="${escHtml(p)}">${escHtml(p)}</option>`).join('');

  filtroSelect.onchange = () => {
    if (asignacionesDebounceTimer) clearTimeout(asignacionesDebounceTimer);
    asignacionesDebounceTimer = setTimeout(renderTablaAsignacionesCheck, 150);
  };

  renderEvaluadoresCheck();
  renderTablaAsignacionesCheck();
  await cargarAsignacionesAdmin();
}

function renderEvaluadoresCheck() {
  const container = $('listaEvaluadoresCheck');
  const activos = Cache.evaluadores.filter(e => e.activo === 'SI');
  if (activos.length === 0) { container.innerHTML = '<p style="text-align:center;color:#888;">No hay evaluadores activos</p>'; return; }

  const frag = document.createDocumentFragment();
  activos.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'check-item';
    div.innerHTML = `
      <input type="checkbox" class="check-eval" value="${escHtml(ev.id)}" id="eval_${escHtml(ev.id)}" data-nombre="${escHtml(ev.nombre)}">
      <label for="eval_${escHtml(ev.id)}">${escHtml(ev.nombre)}<span class="rut-small">${escHtml(ev.rut)}</span></label>
    `;
    frag.appendChild(div);
  });
  container.innerHTML = '';
  container.appendChild(frag);
}

function renderTablaAsignacionesCheck() {
  const filtroProvincia = $('filtroProvincia').value;
  const tbody = $('tablaAsignacionesBody');
  let entidadesFiltradas = Cache.entidades;
  if (filtroProvincia) entidadesFiltradas = entidadesFiltradas.filter(e => e.provincia === filtroProvincia);

  const frag = document.createDocumentFragment();
  entidadesFiltradas.forEach(ent => {
    const tr = document.createElement('tr');
    tr.id = 'row_' + escHtml(ent.id);
    const etapasHtml = [1,2,3,4,5,6].map(et =>
      `<label><input type="checkbox" class="check-etapa-item" data-entidad="${escHtml(ent.id)}" data-etapa="${et}" disabled> E${et}</label>`
    ).join('');

    tr.innerHTML = `
      <td><input type="checkbox" class="check-entidad" data-id="${escHtml(ent.id)}" data-nombre="${escHtml(ent.nombre)}"></td>
      <td><strong>${escHtml(ent.nombre)}</strong></td>
      <td>${escHtml(ent.provincia || 'N/A')}</td>
      <td>${escHtml(ent.programa || 'N/A')}</td>
      <td>${ent.proyectos ? ent.proyectos.length : 0}</td>
      <td class="check-etapa">${etapasHtml}</td>
    `;
    frag.appendChild(tr);
  });

  tbody.innerHTML = '';
  tbody.appendChild(frag);
}

$('tablaAsignacionesCheck').addEventListener('change', function(e) {
  const chk = e.target;
  if (!chk.classList.contains('check-entidad')) return;
  const entId = chk.dataset.id;
  const row = $('row_' + entId);
  if (!row) return;
  const etapas = row.querySelectorAll('.check-etapa-item');
  etapas.forEach(el => { el.disabled = !chk.checked; if (!chk.checked) el.checked = false; });
  row.classList.toggle('seleccionada', chk.checked);
});

$('checkAllEntidades').addEventListener('change', function() {
  const checked = this.checked;
  document.querySelectorAll('.check-entidad').forEach(chk => {
    if (chk.checked !== checked) { chk.checked = checked; chk.dispatchEvent(new Event('change')); }
  });
});

$('checkAllEntidadesHeader').addEventListener('change', function() {
  $('checkAllEntidades').checked = this.checked;
  $('checkAllEntidades').dispatchEvent(new Event('change'));
});

$('checkAllEval').addEventListener('change', function() {
  document.querySelectorAll('.check-eval').forEach(chk => chk.checked = this.checked);
});

// ============================================
// ADMIN: FUNCIONES EVALUADORES
// ============================================
async function editarPassword(evalId) {
  const ev = Cache.getEvaluador(evalId);
  const nuevaPass = prompt('Evaluador: ' + escHtml(ev?.nombre || evalId) + '\n\nIngrese nueva contrasena:');
  if (nuevaPass?.trim()) await cambiarPassword(evalId, nuevaPass.trim());
}

async function cambiarPassword(evalId, nuevaPassword) {
  Progress.show('Actualizando contrasena...');
  try {
    const data = await apiPost({ action: 'cambiar_password', evaluador_id: evalId, password: nuevaPassword });
    Progress.hide();
    if (data.success) { alert('Contrasena actualizada correctamente'); await cargarEvaluadores(true); await cargarEvaluadoresAdmin(); }
    else { alert('Error: ' + (data.error || 'No se pudo actualizar')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
}

async function borrarEvaluador(evalId) {
  if (!confirm('¿Esta seguro de eliminar este evaluador?')) return;
  Progress.show('Eliminando evaluador...');
  try {
    const data = await apiPost({ action: 'borrar_evaluador', evaluador_id: evalId });
    Progress.hide();
    if (data.success) { alert('Evaluador eliminado'); await cargarEvaluadores(true); await cargarEvaluadoresAdmin(); }
    else { alert('Error: ' + (data.error || 'No se pudo eliminar')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
}

// ============================================
// ADMIN: ASIGNACIONES EXISTENTES
// ============================================
async function cargarAsignacionesAdmin() {
  const container = $('listaAsignacionesAdmin');
  if (Cache.asignaciones.length === 0) { container.innerHTML = '<p style="text-align:center;color:#888;">No hay asignaciones</p>'; return; }

  const table = document.createElement('table');
  table.className = 'tabla-admin';
  table.innerHTML = `<thead><tr><th>Evaluador</th><th>Entidad</th><th>Etapa</th><th>Acciones</th></tr></thead>`;
  const tbody = document.createElement('tbody');

  Cache.asignaciones.forEach(a => {
    const evaluador = Cache.getEvaluador(a.evaluador_id);
    const entidad = Cache.getEntidad(a.entidad_id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escHtml(evaluador?.nombre || a.evaluador_nombre || 'N/A')}</td>
      <td>${escHtml(entidad?.nombre || a.entidad_nombre || 'N/A')}</td>
      <td>Etapa ${escHtml(a.etapa_num)}</td>
      <td><button class="btn-icon btn-delete" data-action="del-asig" data-eval="${escHtml(a.evaluador_id)}" data-ent="${escHtml(a.entidad_id)}" data-etapa="${escHtml(a.etapa_num)}">🗑️</button></td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.innerHTML = '';
  container.appendChild(table);

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="del-asig"]');
    if (btn) borrarAsignacion(btn.dataset.eval, btn.dataset.ent, btn.dataset.etapa);
  });
}

async function borrarAsignacion(evalId, entId, etapaNum) {
  if (!confirm('¿Eliminar esta asignacion?')) return;
  Progress.show('Eliminando asignacion...');
  try {
    const data = await apiPost({ action: 'borrar_asignacion', evaluador_id: evalId, entidad_id: entId, etapa_num: etapaNum });
    Progress.hide();
    if (data.success) { await cargarAsignaciones(true); await cargarAsignacionesAdmin(); }
    else { alert('Error: ' + (data.error || 'No se pudo eliminar')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
}

// ============================================
// ADMIN: GUARDAR ASIGNACIONES MASIVAS
// ============================================
$('btnGuardarAsignaciones').addEventListener('click', async function() {
  const evaluadoresSeleccionados = [];
  document.querySelectorAll('#listaEvaluadoresCheck .check-eval:checked').forEach(chk => {
    evaluadoresSeleccionados.push({ id: chk.value, nombre: chk.dataset.nombre });
  });

  if (evaluadoresSeleccionados.length === 0) {
    showMessage('asignMessage', 'Seleccione al menos un evaluador', 'error');
    return;
  }

  const asignaciones = [];
  document.querySelectorAll('.check-entidad:checked').forEach(chkEnt => {
    const entId = chkEnt.dataset.id;
    const entNombre = chkEnt.dataset.nombre;
    document.querySelectorAll(`.check-etapa-item[data-entidad="${entId}"]:checked`).forEach(chkEt => {
      evaluadoresSeleccionados.forEach(ev => {
        asignaciones.push({
          evaluador_id: ev.id, evaluador_nombre: ev.nombre,
          entidad_id: entId, entidad_nombre: entNombre,
          etapa_num: parseInt(chkEt.dataset.etapa)
        });
      });
    });
  });

  if (asignaciones.length === 0) {
    showMessage('asignMessage', 'Seleccione al menos una entidad y etapa', 'error');
    return;
  }

  Progress.show('Guardando ' + asignaciones.length + ' asignaciones...');
  try {
    const data = await apiPost({ action: 'guardar_asignaciones_masivas', asignaciones });
    Progress.hide();
    if (data.success) {
      showMessage('asignMessage', '✅ ' + asignaciones.length + ' asignaciones guardadas', 'success');
      await cargarAsignaciones(true); await cargarAsignacionesAdmin();
      document.querySelectorAll('.check-entidad, .check-etapa-item, #listaEvaluadoresCheck input').forEach(chk => chk.checked = false);
      document.querySelectorAll('.check-etapa-item').forEach(e => e.disabled = true);
      document.querySelectorAll('.tabla-check tr').forEach(r => r.classList.remove('seleccionada'));
    } else {
      showMessage('asignMessage', data.error || 'Error al guardar', 'error');
    }
  } catch (err) {
    Progress.hide();
    showMessage('asignMessage', 'Error de conexion: ' + err.message, 'error');
  }
});

$('btnLimpiarAsignaciones').addEventListener('click', function() {
  document.querySelectorAll('.check-entidad, .check-etapa-item, #listaEvaluadoresCheck input').forEach(chk => chk.checked = false);
  document.querySelectorAll('.check-etapa-item').forEach(e => e.disabled = true);
  document.querySelectorAll('.tabla-check tr').forEach(r => r.classList.remove('seleccionada'));
  showMessage('asignMessage', 'Seleccion limpiada', 'success');
});

// ============================================
// ADMIN: REPORTES
// ============================================
$('btnGenerarResumen').addEventListener('click', generarResumenReporte);

async function generarResumenReporte() {
  Progress.show('Generando reporte...');
  try {
    const data = await apiGet('reporte_resumen');
    Progress.hide();
    const container = $('tablaResumen');
    if (!data.reporte || data.reporte.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#888;">No hay calificaciones registradas</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'tabla-admin';
    table.innerHTML = `<thead><tr><th>Entidad</th><th>Etapa</th><th>Evaluaciones</th><th>Promedio</th><th>Acciones</th></tr></thead>`;
    const tbody = document.createElement('tbody');

    data.reporte.forEach(r => {
      const promedio = r.promedio ? r.promedio.toFixed(1) : 'N/A';
      let clase = 'malo';
      if (r.promedio >= 70) clase = 'bueno';
      else if (r.promedio >= 50) clase = 'aceptable';

      const tr = document.createElement('tr');
      tr.className = 'tabla-resumen-row';
      tr.innerHTML = `
        <td>${escHtml(r.entidad_nombre)}</td>
        <td>Etapa ${escHtml(r.etapa_num)}</td>
        <td>${escHtml(r.cantidad_evaluadores)}</td>
        <td class="${escHtml(clase)}">${escHtml(promedio)}</td>
        <td><button class="btn-secondary" data-action="ver-detalle" data-ent="${escHtml(r.entidad_id)}" data-etapa="${escHtml(r.etapa_num)}">Ver</button></td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);

    tbody.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="ver-detalle"]');
      if (btn) verDetalleReporte(btn.dataset.ent, btn.dataset.etapa);
    });
  } catch (err) {
    Progress.hide();
    $('tablaResumen').innerHTML = '<p style="text-align:center;color:#c00;">Error generando reporte</p>';
  }
}

async function verDetalleReporte(entidadId, etapaNum) {
  Progress.show('Cargando detalle...');
  try {
    const data = await apiGet('reporte_detalle', { entidad_id: entidadId, etapa_num: etapaNum });
    Progress.hide();
    const container = $('contenidoReporteDetalle');
    const frag = document.createDocumentFragment();

    (data.calificaciones || []).forEach(c => {
      const div = document.createElement('div');
      div.className = 'reporte-fila';
      let notasHtml = '';
      Object.entries(c.notas || {}).forEach(([k, v]) => {
        notasHtml += `<div class="reporte-item">Item ${escHtml(k)}: <span class="nota">${escHtml(v)}</span></div>`;
      });
      div.innerHTML = `
        <h4>${escHtml(c.evaluador_nombre)}</h4>
        <p class="fecha">${escHtml(c.fecha || 'Sin fecha')}</p>
        <div class="reporte-items">${notasHtml}</div>
      `;
      frag.appendChild(div);
    });

    const etapaInfo = Cache.config?.etapas?.find(e => e.num == etapaNum);
    if (etapaInfo?.items) {
      const promediosDiv = document.createElement('div');
      promediosDiv.className = 'promedios-finales';
      let promHtml = '<h4>Promedios por Item</h4>';
      etapaInfo.items.forEach(item => {
        const notas = (data.calificaciones || []).map(c => c.notas?.[item.num]).filter(n => n !== undefined);
        const prom = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : 'N/A';
        promHtml += `<p>Item ${escHtml(item.num)} (${escHtml(item.nombre)}): <strong>${escHtml(prom)}</strong></p>`;
      });
      promediosDiv.innerHTML = promHtml;
      frag.appendChild(promediosDiv);
    }

    container.innerHTML = '';
    container.appendChild(frag);
    show('panelReporteDetalle');
  } catch (err) {
    Progress.hide();
    alert('Error cargando detalle: ' + err.message);
  }
}

$('btnCerrarReporte').addEventListener('click', () => hide('panelReporteDetalle'));

$('btnVerPantalla').addEventListener('click', function() {
  const contenido = $('contenidoReporteDetalle').innerHTML;
  const ventana = window.open('', '_blank');
  ventana.document.write('<html><head><title>Reporte Detallado</title><link rel="stylesheet" href="assets/styles.css"></head><body><div class="container">' + contenido + '</div></body></html>');
  ventana.document.close();
});

$('btnDescargarXLSX').addEventListener('click', function() {
  const tabla = $('contenidoReporteDetalle');
  let csv = 'Evaluador,Fecha,Item,Nota\n';
  tabla.querySelectorAll('.reporte-fila').forEach(fila => {
    const evaluador = fila.querySelector('h4')?.textContent || '';
    const fecha = fila.querySelector('.fecha')?.textContent || '';
    fila.querySelectorAll('.reporte-item').forEach(item => {
      const texto = item.textContent.trim().replace(':', ',');
      csv += `"${evaluador}","${fecha}",${texto}\n`;
    });
  });
  downloadCSV(csv, 'reporte_detalle.csv');
});

// ============================================
// ADMIN: PLANTILLAS
// ============================================
function descargarPlantilla(tipo) {
  let csv = '', nombre = '';
  if (tipo === 'evaluadores') {
    nombre = 'plantilla_evaluadores.csv';
    csv = 'nombre_completo,rut,password\nJuan Perez,12.345.678-9,password123\n';
  } else if (tipo === 'entidades') {
    nombre = 'plantilla_entidades.csv';
    csv = 'nombre_entidad,rut,provincia,programa\nEntidad Ejemplo,00.000.000-0,Osorno,DS49\n';
  } else if (tipo === 'proyectos') {
    nombre = 'plantilla_proyectos.csv';
    csv = 'entidad_nombre,codigo,nombre_proyecto,comuna,modalidad,familias,ano\nEntidad Ejemplo,PRJ001,Proyecto Demo,Osorno,CNT,100,2024\n';
  }
  downloadCSV(csv, nombre);
}

function downloadCSV(csv, nombre) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombre;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ============================================
// ADMIN: CARGA MASIVA
// ============================================
$('btnProcesarCarga').addEventListener('click', async function() {
  const tipo = $('tipoCargaMasiva').value;
  const file = $('fileCargaMasiva').files[0];

  if (!file) { showMessage('cargaMessage', 'Seleccione un archivo', 'error'); return; }

  Progress.show('Procesando archivo...');
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = await apiPost({ action: 'carga_masiva', tipo: tipo, contenido: e.target.result });
      Progress.hide();
      if (data.success) {
        showMessage('cargaMessage', '✅ Carga completada: ' + (data.procesados || 0) + ' registros', 'success');
        if (tipo === 'evaluadores') { await cargarEvaluadores(true); if (adminTabInit.has('tabEvaluadores')) await cargarEvaluadoresAdmin(); }
        if (tipo === 'entidades') { await cargarEntidades(true); if (adminTabInit.has('tabEntidades')) await cargarEntidadesAdmin(); }
      } else {
        showMessage('cargaMessage', data.error || 'Error en la carga', 'error');
      }
    } catch (err) {
      Progress.hide();
      showMessage('cargaMessage', 'Error de conexion: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
});

// ============================================
// ADMIN: CONFIGURACION
// ============================================
$('btnGuardarConfig').addEventListener('click', async function() {
  const verNotas = $('chkVerNotas').checked;
  Progress.show('Guardando configuracion...');
  try {
    const data = await apiPost({ action: 'guardar_config', ver_notas_otros: verNotas });
    Progress.hide();
    if (data.success) { Cache.config.ver_notas_otros = verNotas; alert('Configuracion guardada'); }
    else { alert('Error: ' + (data.error || 'No se pudo guardar')); }
  } catch (err) { Progress.hide(); alert('Error de conexion: ' + err.message); }
});

// ============================================
// UTILIDAD: Escape HTML
// ============================================
const escHtmlCache = new Map();
function escHtml(str) {
  if (str == null) return '';
  const s = String(str);
  if (escHtmlCache.has(s)) return escHtmlCache.get(s);
  const escaped = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  if (s.length < 100) escHtmlCache.set(s, escaped);
  return escaped;
}

// ============================================
// INICIALIZACION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  showScreen('loginScreen');
  setupAdminNav();
});
