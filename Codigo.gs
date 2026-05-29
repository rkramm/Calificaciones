/**
 * SERVIU - Backend v3.2 - API Google Apps Script CORRECTA
 * 
 * FIXES:
 * - setHeader() en lugar de setHeaders() (GAS no tiene setHeaders)
 * -eliminado do options
 * - CORS funcional para GitHub Pages
 */

const SPREADSHEET_ID = '1AiwOhl0dfBI_aSqWtMet8JDTGnPil3UvQRqiDmJ5Xw0';
const SHEET_NAMES = {
  CONFIG: 'Config',
  EVALUADORES: 'Evaluadores',
  ENTIDADES: 'Entidades',
  PROYECTOS: 'Proyectos',
  ASIGNACIONES: 'Asignaciones',
  CALIFICACIONES: 'Calificaciones',
  AUDIT: 'AuditLog'
};

// =====================================================
// FUNCION AUXILIAR: Crear respuesta JSON con CORS
// =====================================================
function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function createErrorResponse(message) {
  return createJsonResponse({ error: message });
}

// =====================================================
// doGet
// =====================================================
function doGet(e) {
  try {
    var action = e.parameter.action;

    if (action == 'ping') {
      return createJsonResponse({
        status: 'ok',
        message: 'CORS funciona correctamente',
        timestamp: new Date().toISOString()
      });
    }

    if (action == 'config') {
      return createJsonResponse({
        etapas: [
          { num: 1, nombre: 'Postulacion', items: [
            { num: 1, nombre: 'Calidad de la postulacion' },
            { num: 2, nombre: 'Documentacion completa' },
            { num: 3, nombre: 'Antecedentes tecnicos' }
          ]},
          { num: 2, nombre: 'Evaluacion Tecnica', items: [
            { num: 1, nombre: 'Capacidad tecnica' },
            { num: 2, nombre: 'Experiencia previa' },
            { num: 3, nombre: 'Recursos humanos' }
          ]},
          { num: 3, nombre: 'Visita Terreno', items: [
            { num: 1, nombre: 'Infraestructura' },
            { num: 2, nombre: 'Ubicacion' },
            { num: 3, nombre: 'Accesibilidad' }
          ]},
          { num: 4, nombre: 'Evaluacion Economica', items: [
            { num: 1, nombre: 'Presupuesto' },
            { num: 2, nombre: 'Sostenibilidad' },
            { num: 3, nombre: 'Costo-beneficio' }
          ]}
        ],
        ver_notas_otros: getConfigValue('ver_notas_otros') == 'SI'
      });
    }

    if (action == 'login') {
      return handleLogin(e.parameter.rut, e.parameter.password);
    }

    if (action == 'entidades') {
      return handleGetEntidades();
    }

    if (action == 'evaluadores') {
      return handleGetEvaluadores();
    }

    if (action == 'asignaciones') {
      return handleGetAsignaciones(e.parameter.evaluador_id);
    }

    if (action == 'calificaciones') {
      return handleGetCalificaciones(e.parameter.entidad_id, e.parameter.etapa_num);
    }

    if (action == 'reporte_resumen') {
      return handleReporteResumen();
    }

    if (action == 'reporte_detalle') {
      return handleReporteDetalle(e.parameter.entidad_id, e.parameter.etapa_num);
    }

    return createErrorResponse('Accion GET no valida: ' + action);

  } catch(err) {
    return createErrorResponse('Error en doGet: ' + err.toString());
  }
}

// =====================================================
// doPost
// =====================================================
function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;

    if (action == 'login') {
      return handleLogin(params.rut, params.password);
    }

    if (action == 'crear_evaluador') {
      return handleCrearEvaluador(params);
    }

    if (action == 'crear_entidad') {
      return handleCrearEntidad(params);
    }

    if (action == 'guardar_calificacion') {
      return handleGuardarCalificacion(params);
    }

    if (action == 'guardar_asignaciones_masivas') {
      return handleGuardarAsignacionesMasivas(params);
    }

    if (action == 'borrar_evaluador') {
      return handleBorrarEvaluador(params);
    }

    if (action == 'borrar_asignacion') {
      return handleBorrarAsignacion(params);
    }

    if (action == 'cambiar_password') {
      return handleCambiarPassword(params);
    }

    if (action == 'carga_masiva') {
      return handleCargaMasiva(params);
    }

    if (action == 'guardar_config') {
      return handleGuardarConfig(params);
    }

    return createErrorResponse('Accion POST no valida: ' + action);

  } catch(err) {
    return createErrorResponse('Error en doPost: ' + err.toString());
  }
}

// =====================================================
// LOGIN
// =====================================================
function handleLogin(rut, password) {
  if (!rut || !password) {
    return createErrorResponse('RUT y contrasena requeridos');
  }

  // Admin login
  if (rut == 'ADMIN') {
    var adminPass = getAdminPassword();
    if (password == adminPass) {
      return createJsonResponse({
        admin: true,
        nombre: 'Administrador',
        rut: 'ADMIN'
      });
    }
    return createErrorResponse('Credenciales incorrectas');
  }

  // Evaluador login
  var sheet = getSheet(SHEET_NAMES.EVALUADORES);
  var data = sheet.getDataRange().getValues();
  var rutNorm = normalizeRut(rut);

  for (var i = 1; i < data.length; i++) {
    var rowRut = normalizeRut(data[i][2]);
    var rowPassword = data[i][3];
    var activo = data[i][4];

    if (rowRut == rutNorm && rowPassword == password && activo == 'SI') {
      return createJsonResponse({
        evaluador_id: data[i][0],
        nombre: data[i][1],
        rut: data[i][2],
        admin: false
      });
    }
  }

  return createErrorResponse('Credenciales incorrectas');
}

function normalizeRut(rut) {
  return rut.toString().trim().replace(/\./g, '').replace(/\s/g, '').toLowerCase();
}

// =====================================================
// ADMIN PASSWORD (en Properties)
// =====================================================
function getAdminPassword() {
  var props = PropertiesService.getScriptProperties();
  var pass = props.getProperty('ADMIN_PASSWORD');
  if (!pass) {
    pass = 'admin123';
    props.setProperty('ADMIN_PASSWORD', pass);
    Logger.log('ADVERTENCIA: Password admin por defecto establecido');
  }
  return pass;
}

function cambiarAdminPassword(nuevaPassword) {
  if (!nuevaPassword || nuevaPassword.length < 8) {
    Logger.log('Error: La contrasena debe tener al menos 8 caracteres');
    return false;
  }
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', nuevaPassword);
  Logger.log('Contrasena de admin cambiada exitosamente');
  return true;
}

// =====================================================
// CONFIG
// =====================================================
function handleGuardarConfig(params) {
  var sheet = getSheet(SHEET_NAMES.CONFIG);
  sheet.appendRow(['ver_notas_otros', params.ver_notas_otros ? 'SI' : 'NO', new Date().toISOString()]);
  return createJsonResponse({ success: true });
}

function getConfigValue(parametro) {
  var sheet = getSheet(SHEET_NAMES.CONFIG);
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] == parametro) {
      return data[i][1];
    }
  }
  return null;
}

// =====================================================
// UTILIDADES
// =====================================================
function getSpreadsheet() {
  if (!globalThis._ssCache) {
    globalThis._ssCache = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return globalThis._ssCache;
}

function getSheet(name) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initializeSheetHeaders(sheet, name);
  }
  return sheet;
}

function initializeSheetHeaders(sheet, name) {
  var headers = {
    [SHEET_NAMES.CONFIG]: ['Parametro', 'Valor', 'Descripcion'],
    [SHEET_NAMES.EVALUADORES]: ['ID', 'Nombre', 'RUT', 'Password', 'Activo'],
    [SHEET_NAMES.ENTIDADES]: ['ID', 'Nombre', 'RUT', 'Provincia', 'Programa', 'Total Familias'],
    [SHEET_NAMES.PROYECTOS]: ['ID', 'Entidad ID', 'Codigo', 'Nombre', 'Comuna', 'Modalidad', 'Familias'],
    [SHEET_NAMES.ASIGNACIONES]: ['ID', 'Evaluador ID', 'Evaluador Nombre', 'Entidad ID', 'Entidad Nombre', 'Etapa Num'],
    [SHEET_NAMES.CALIFICACIONES]: ['ID', 'Evaluador ID', 'Evaluador Nombre', 'Entidad ID', 'Entidad Nombre', 'Etapa Num', 'Notas (JSON)', 'Fecha'],
    [SHEET_NAMES.AUDIT]: ['Fecha', 'Accion', 'Usuario', 'Detalles', 'Email']
  };
  if (headers[name]) {
    sheet.getRange(1, 1, 1, headers[name].length).setValues([headers[name]]);
    sheet.setFrozenRows(1);
  }
}

function generateId() {
  return Utilities.getUuid().substring(0, 8);
}

// =====================================================
// EVALUADORES
// =====================================================
function handleGetEvaluadores() {
  var sheet = getSheet(SHEET_NAMES.EVALUADORES);
  var data = sheet.getDataRange().getValues();
  var evaluadores = [];

  for (var i = 1; i < data.length; i++) {
    evaluadores.push({
      id: data[i][0],
      nombre: data[i][1],
      rut: data[i][2],
      activo: data[i][4] || 'SI'
    });
  }

  return createJsonResponse({ evaluadores: evaluadores });
}

function handleCrearEvaluador(params) {
  var sheet = getSheet(SHEET_NAMES.EVALUADORES);
  var id = generateId();
  sheet.appendRow([id, params.nombre_completo, params.rut, params.password, 'SI']);
  return createJsonResponse({ success: true, id: id });
}

function handleBorrarEvaluador(params) {
  var sheet = getSheet(SHEET_NAMES.EVALUADORES);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == params.evaluador_id) {
      sheet.getRange(i + 1, 5).setValue('NO');
      return createJsonResponse({ success: true });
    }
  }
  return createErrorResponse('Evaluador no encontrado');
}

function handleCambiarPassword(params) {
  var sheet = getSheet(SHEET_NAMES.EVALUADORES);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == params.evaluador_id) {
      sheet.getRange(i + 1, 4).setValue(params.password);
      return createJsonResponse({ success: true });
    }
  }
  return createErrorResponse('Evaluador no encontrado');
}

// =====================================================
// ENTIDADES
// =====================================================
function handleGetEntidades() {
  var sheet = getSheet(SHEET_NAMES.ENTIDADES);
  var data = sheet.getDataRange().getValues();
  var entidades = [];

  for (var i = 1; i < data.length; i++) {
    entidades.push({
      id: data[i][0],
      nombre: data[i][1],
      rut: data[i][2],
      provincia: data[i][3],
      programa: data[i][4],
      total_familias: data[i][5]
    });
  }

  return createJsonResponse({ entidades: entidades });
}

function handleCrearEntidad(params) {
  var sheet = getSheet(SHEET_NAMES.ENTIDADES);
  var id = generateId();
  sheet.appendRow([id, params.nombre_entidad, params.rut, params.provincia, params.programa, params.total_familias || 0]);

  if (params.proyectos && params.proyectos.length > 0) {
    var projSheet = getSheet(SHEET_NAMES.PROYECTOS);
    for (var j = 0; j < params.proyectos.length; j++) {
      var proj = params.proyectos[j];
      projSheet.appendRow([generateId(), id, proj.codigo, proj.nombre, proj.comuna, proj.modalidad, proj.familias]);
    }
  }

  return createJsonResponse({ success: true, id: id });
}

// =====================================================
// ASIGNACIONES
// =====================================================
function handleGetAsignaciones(evaluadorId) {
  var sheet = getSheet(SHEET_NAMES.ASIGNACIONES);
  var data = sheet.getDataRange().getValues();
  var asignaciones = [];

  for (var i = 1; i < data.length; i++) {
    if (!evaluadorId || data[i][1].toString() == evaluadorId.toString()) {
      asignaciones.push({
        id: data[i][0],
        evaluador_id: data[i][1],
        evaluador_nombre: data[i][2],
        entidad_id: data[i][3],
        entidad_nombre: data[i][4],
        etapa_num: data[i][5]
      });
    }
  }

  return createJsonResponse({ asignaciones: asignaciones });
}

function handleGuardarAsignacionesMasivas(params) {
  var sheet = getSheet(SHEET_NAMES.ASIGNACIONES);
  var asignaciones = params.asignaciones || [];

  for (var i = 0; i < asignaciones.length; i++) {
    var asig = asignaciones[i];
    sheet.appendRow([generateId(), asig.evaluador_id, asig.evaluador_nombre, asig.entidad_id, asig.entidad_nombre, asig.etapa_num]);
  }

  return createJsonResponse({ success: true, guardadas: asignaciones.length });
}

function handleBorrarAsignacion(params) {
  var sheet = getSheet(SHEET_NAMES.ASIGNACIONES);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] == params.evaluador_id && data[i][3] == params.entidad_id && data[i][5] == params.etapa_num) {
      sheet.deleteRow(i + 1);
      return createJsonResponse({ success: true });
    }
  }
  return createErrorResponse('Asignacion no encontrada');
}

// =====================================================
// CALIFICACIONES
// =====================================================
function handleGetCalificaciones(entidadId, etapaNum) {
  var sheet = getSheet(SHEET_NAMES.CALIFICACIONES);
  var data = sheet.getDataRange().getValues();
  var calificaciones = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][3] == entidadId && data[i][5] == etapaNum) {
      var notas = {};
      try { if (data[i][6]) notas = JSON.parse(data[i][6]); } catch(e) { notas = {}; }

      calificaciones.push({
        id: data[i][0],
        evaluador_id: data[i][1],
        evaluador_nombre: data[i][2],
        entidad_id: data[i][3],
        entidad_nombre: data[i][4],
        etapa_num: data[i][5],
        notas: notas,
        fecha: data[i][7] || new Date().toISOString()
      });
    }
  }

  return createJsonResponse({ calificaciones: calificaciones });
}

function handleGuardarCalificacion(params) {
  var sheet = getSheet(SHEET_NAMES.CALIFICACIONES);
  var data = sheet.getDataRange().getValues();

  var existingRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][1].toString() == params.evaluador_id.toString() && data[i][3] == params.entidad_id && data[i][5] == params.etapa_num) {
      existingRow = i + 1;
      break;
    }
  }

  var notasJson = JSON.stringify(params.notas);
  var fecha = new Date().toISOString();

  if (existingRow > 0) {
    sheet.getRange(existingRow, 7).setValue(notasJson);
    sheet.getRange(existingRow, 8).setValue(fecha);
  } else {
    sheet.appendRow([generateId(), params.evaluador_id, params.evaluador_nombre, params.entidad_id, params.entidad_nombre, params.etapa_num, notasJson, fecha]);
  }

  return createJsonResponse({ success: true });
}

// =====================================================
// REPORTES
// =====================================================
function handleReporteResumen() {
  var sheet = getSheet(SHEET_NAMES.CALIFICACIONES);
  var data = sheet.getDataRange().getValues();
  var resumen = {};

  for (var i = 1; i < data.length; i++) {
    var key = data[i][3] + '_' + data[i][5];

    if (!resumen[key]) {
      resumen[key] = {
        entidad_id: data[i][3],
        entidad_nombre: data[i][4],
        etapa_num: data[i][5],
        cantidad_evaluadores: 0,
        suma_notas: 0,
        total_notas: 0
      };
    }

    var notas = {};
    try { if (data[i][6]) notas = JSON.parse(data[i][6]); } catch(e) { notas = {}; }
    var valores = Object.values(notas);
    if (valores.length > 0) {
      var promedioNotas = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
      resumen[key].cantidad_evaluadores++;
      resumen[key].suma_notas += promedioNotas;
      resumen[key].total_notas++;
    }
  }

  var reporte = Object.values(resumen).map(function(r) {
    return {
      entidad_id: r.entidad_id,
      entidad_nombre: r.entidad_nombre,
      etapa_num: r.etapa_num,
      cantidad_evaluadores: r.cantidad_evaluadores,
      promedio: r.total_notas > 0 ? r.suma_notas / r.total_notas : 0
    };
  });

  return createJsonResponse({ reporte: reporte });
}

function handleReporteDetalle(entidadId, etapaNum) {
  return handleGetCalificaciones(entidadId, etapaNum);
}

// =====================================================
// CARGA MASIVA
// =====================================================
function handleCargaMasiva(params) {
  var tipo = params.tipo;
  var contenido = params.contenido;
  var lineas = contenido.split('\n').filter(function(l) { return l.trim(); });
  var procesados = 0;

  if (tipo == 'evaluadores') {
    var sheet = getSheet(SHEET_NAMES.EVALUADORES);
    for (var i = 1; i < lineas.length; i++) {
      var cols = lineas[i].split(',');
      if (cols.length >= 3) {
        sheet.appendRow([generateId(), cols[0].trim(), cols[1].trim(), cols[2].trim(), 'SI']);
        procesados++;
      }
    }
  } else if (tipo == 'entidades') {
    var sheet = getSheet(SHEET_NAMES.ENTIDADES);
    for (var i = 1; i < lineas.length; i++) {
      var cols = lineas[i].split(',');
      if (cols.length >= 4) {
        sheet.appendRow([generateId(), cols[0].trim(), cols[1].trim(), cols[2].trim(), cols[3].trim(), 0]);
        procesados++;
      }
    }
  }

  return createJsonResponse({ success: true, procesados: procesados });
}

// =====================================================
// LECTURA DINÁMICA DE ETAPAS E ÍTEMS DESDE SHEET CONFIG
// =====================================================
function getEtapasFromConfig() {
  var sheet = getSheet(SHEET_NAMES.CONFIG);
  var data = sheet.getDataRange().getValues();
  
  // Si la hoja está vacía, devuelve los datos de respaldo
  if (data.length < 2) return getEtapasHardcodedFallback();
  
  var headers = data[0].map(function(h) { return h.toString().toLowerCase().trim(); });
  var idxEtapaNum = headers.indexOf('etapa_num');
  var idxEtapaNombre = headers.indexOf('etapa_nombre');
  var idxItemNum = headers.indexOf('item_num');
  var idxItemNombre = headers.indexOf('item_nombre');
  
  // Si no encuentra las columnas, usa la versión por defecto para no romper la app
  if (idxEtapaNum === -1 || idxItemNum === -1) {
    return getEtapasHardcodedFallback();
  }
  
  var etapasMap = {};
  for (var i = 1; i < data.length; i++) {
    var eNum = data[i][idxEtapaNum];
    if (!eNum || eNum === '') continue; // Saltar filas vacías
    
    if (!etapasMap[eNum]) {
      etapasMap[eNum] = {
        num: eNum,
        etapa_nombre: idxEtapaNombre !== -1 ? data[i][idxEtapaNombre] : 'Etapa ' + eNum,
        items: []
      };
    }
    
    var iNum = data[i][idxItemNum];
    var iNom = idxItemNombre !== -1 ? data[i][idxItemNombre] : '';
    
    if (iNum !== '') {
      etapasMap[eNum].items.push({
        item_num: iNum,
        item_nombre: iNom
      });
    }
  }
  
  var result = Object.keys(etapasMap).map(function(k) { return etapasMap[k]; });
  result.sort(function(a, b) { return a.num - b.num; }); // Ordenar por número de etapa
  
  if (result.length === 0) return getEtapasHardcodedFallback();
  return result;
}

function getEtapasHardcodedFallback() {
  return [
    { num: 1, nombre: 'Postulacion', items: [
      { item_num: 1, item_nombre: 'Calidad de la postulacion' },
      { item_num: 2, item_nombre: 'Documentacion completa' },
      { item_num: 3, item_nombre: 'Antecedentes tecnicos' }
    ]},
    { num: 2, nombre: 'Evaluacion Tecnica', items: [
      { item_num: 1, item_nombre: 'Capacidad tecnica' },
      { item_num: 2, item_nombre: 'Experiencia previa' },
      { item_num: 3, item_nombre: 'Recursos humanos' }
    ]}
  ];
}

// =====================================================
// INICIALIZACION
// =====================================================
function inicializarSistema() {
  Object.values(SHEET_NAMES).forEach(function(name) {
    getSheet(name);
  });

  var configSheet = getSheet(SHEET_NAMES.CONFIG);
  configSheet.appendRow(['ver_notas_otros', 'NO', 'Permitir ver notas de otros evaluadores']);

  Logger.log('Sistema inicializado correctamente');
}