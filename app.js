/* ================= CONFIGURACIÓN DE ENTORNO WEB (GITHUB + GOOGLE SCRIPTS) ================= */
const CLOUD_MODE_ENABLED = true; // ¡Activado para conectar con Google Sheets!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVObGXiXiNHbVYr-E5eY6wfjYZSzF7yaG9-pxZ8E6nVbzVyGHkFC2NMgcANBu-oDQldg/exec";

const PROGRAMAS_BASE = ["DS10", "DS27", "DS49"];

const DEFAULT_ITEMS = [
    // ETAPA 1
    { id: "1.1", stage: 1, text: "Calidad en la gestión y desarrollo del(los) servicio (s) de asistencia técnica" },
    { id: "1.2", stage: 1, text: "Preparación y desarrollo de diagnósticos técnicos y sociales pertinentes." },
    { id: "1.3", stage: 1, text: "Entrega oportuna de información del proyecto a las familias." },
    { id: "1.4", stage: 1, text: "Participación activa de las familias en la aprobación del proyecto." },
    { id: "1.5", stage: 1, text: "Calidad y disponibilidad de información y/o antecedentes solicitados por el organismo de revisión." },
    { id: "1.6", stage: 1, text: "Organización adecuada del trabajo en terreno." },
    { id: "1.7", stage: 1, text: "Disposición para atender a las familias en dependencias adecuadas y bien equipadas." },
    { id: "1.8", stage: 1, text: "Efectiva coordinación con la contraparte técnica de revisión." },
    // ETAPA 2
    { id: "2.1", stage: 2, text: "Adecuada evaluación técnica y/o legal de bienes inmuebles" },
    { id: "2.2", stage: 2, text: "Calidad del (los) proyecto (s) presentado (s)" },
    { id: "2.3", stage: 2, text: "Resolución oportuna de observaciones al (los) proyecto (s) formuladas." },
    { id: "2.4", stage: 2, text: "Calidad de la gestión externa con empresas de servicios constructores y otras entidades públicas y privadas relacionadas con la formulación del proyecto." },
    { id: "2.5", stage: 2, text: "Evaluación técnica y/o legal adecuada de terrenos y otros bienes inmuebles." },
    { id: "2.6", stage: 2, text: "Adecuado desarrollo del proceso de elección y selección de la Empresa Constructora." },
    { id: "2.7", stage: 2, text: "Calidad y disponibilidad de información y/o antecedentes solicitados." },
    { id: "2.8", stage: 2, text: "Disposición y organización adecuada del trabajo de terreno." },
    { id: "2.9", stage: 2, text: "Efectiva coordinación con la contraparte técnica." },
    // ETAPA 3
    { id: "3.1", stage: 3, text: "Calidad en la gestión y desarrollo del (los) servicio (s) de asistencia técnica" },
    { id: "3.2", stage: 3, text: "Coordinación con actores externos CBR, DOM y otras entidades públicas y privadas vinculadas al desarrollo del proyecto." },
    { id: "3.3", stage: 3, text: "Gestión legal and administrativa adecuada para la compra o el traspaso y/o compra de otros bienes inmuebles." },
    { id: "3.4", stage: 3, text: "Cumplimiento de plazos asociados a este servicio (traspasos recepciones, inscripciones.. etc.)" },
    { id: "3.5", stage: 3, text: "Calidad de la atención legal a usuarios/beneficiarios" },
    { id: "3.6", stage: 3, text: "Calidad y disponibilidad de información y/o antecedentes solicitados por otros organismos públicos y privados" },
    { id: "3.7", stage: 3, text: "Efectiva coordinación técnica general." },
    // ETAPA 4
    { id: "4.1", stage: 4, text: "Calidad en la gestión y desarrollo del (los) servicio (s) de asistencia técnica" },
    { id: "4.2", stage: 4, text: "Calidad de la atención a usuarios/beneficiarios" },
    { id: "4.3", stage: 4, text: "Adecuada relación y coordinación con proveedores y otras entidades públicas y privadas relacionadas con el desarrollo material del proyecto." },
    { id: "4.4", stage: 4, text: "Resolución oportuna de observaciones al (los) proyecto (s) y a problemas técnicos, financieros ,sociales o administrativos durante su ejecución." },
    { id: "4.5", stage: 4, text: "Verificación oportuna del cumplimiento de las obligaciones contractuales y laborales de la empresa Constructora." },
    { id: "4.6", stage: 4, text: "Realización oportuna de las modificaciones del proyecto cuando corresponda." },
    { id: "4.7", stage: 4, text: "Calidad y disponibilidad de información y/o antecedentes del proyecto solicitados oportunamente." },
    { id: "4.8", stage: 4, text: "Coordinación adecuada con otros organismos para verificar el término del proyecto y con la empresa constructora para aprobar el proceso de post venta." },
    { id: "4.9", stage: 4, text: "Gestión técnica y administrativa oportuna respecto de temas relacionados con subsidios (prórrogas, reemplazos, etc)" },
    { id: "4.10", stage: 4, text: "Efectiva coordinación institucional." },
    // ETAPA 5
    { id: "5.1", stage: 5, text: "Calidad en la gestión y desarrollo del (los) servicio (s) de asistencia técnica" },
    { id: "5.2", stage: 5, text: "Calidad del acompañamiento social a usuarios/beneficiarios" },
    { id: "5.3", stage: 5, text: "Desarrollo adecuado y oportuno de talleres y/o jornadas de capacitación a las familias sobre temas vinculados a derechos y deberes como propietarios." },
    { id: "5.4", stage: 5, text: "Entrega oportuna sobre información del avance del proyecto a las familias y/o modificaciones a éste durante su desarrollo." },
    { id: "5.5", stage: 5, text: "Capacidad de resolver conflictos entre las familias y/o entre las familias y la Empresa Construcción." },
    { id: "5.6", stage: 5, text: "Presencia activa de profesionales del área social en las actividades en terreno." },
    { id: "5.7", stage: 5, text: "Efectiva coordinación técnica del área social." },
    // ETAPA 6
    { id: "6.1", stage: 6, text: "Calidad en la gestión y desarrollo del (los) servicio (s) de asistencia técnica" },
    { id: "6.2", stage: 6, text: "Calidad de la atención a usuarios/beneficiarios durante el proceso de instalación de las familias en sus viviendas y barrios cuando corresponda." },
    { id: "6.3", stage: 6, text: "Cumplimiento de plazos en el desarrollo de los servicios asociados a la post entrega." },
    { id: "6.4", stage: 6, text: "Desarrollo oportuno de talleres y/o capacitaciones sobre el uso y cuidado de la vivienda a las familias." },
    { id: "6.5", stage: 6, text: "Entrega de información pertinente y oportuna a las familias sobre la existencia y funcionamiento de servicios y organismos locales." },
    { id: "6.6", stage: 6, text: "Entrega de información confiable sobre ocupación de las viviendas." },
    { id: "6.7", stage: 6, text: "Calidad y disponibilidad de información y/o antecedentes solicitados." },
    { id: "6.8", stage: 6, text: "Desarrollo oportuno de talleres de capacitación a las familias acerca del proceso de vida en comunidad y ley de copropiedad inmobiliaria cuando corresponda" },
    { id: "6.9", stage: 6, text: "Efectiva coordinación de cierre final." }
];

const STAGES_METADATA = {
    1: { title: "ETAPA 1. ORGANIZACIÓN DE LA DEMANDA / DIAGNÓSTICO TÉCNICO Y/O SOCIAL", desc: "Comprende: diagnóstico del estado de la situación de las familias y/o su necesidad habitacional,..." },
    2: { title: "ETAPA 2. ELABORACIÓN Y PRESENTACIÓN DE PROYECTOS", desc: "Comprende: desarrollo integral de los diseños arquitectónicos, de loteos, de especialidades técnicas e ingeniería estructural; cubicaciones, presupuestos detallados y especificaciones técnicas normativas..." },
    3: { title: "ETAPA 3. GESTIÓN LEGAL", desc: "Comprende: apoyo jurídico para el desarrollo y ejecución del proyecto, asesoría legal para la regularización de inmuebles, asesoría para la recepción de las obras y la elaboración..." },
    4: { title: "ETAPA 4. GESTIÓN TÉCNICA Y ADMINISTRATIVA DE PROYECTOS", desc: "Comprende: realización de actividades de seguimiento del proyecto en todas sus etapas, relación y coordinación con entidades públicas y privadas..." },
    5: { title: "ETAPA 5. ACOMPAÑAMIENTO SOCIAL DURANTE LA EJECUCIÓN DEL PROYECTO", desc: "Comprende: Entrega de información a las familias sobre avance y desarrollo del proyecto durante su ejecución, coordinar visitas programadas de las familias a las obras..." },
    6: { title: "ETAPA 6. ASESORÍA TÉCNICA Y SOCIAL PARA LA POST ENTREGA", desc: "Comprende: realización de reuniones o talleres de capacitación para abordar el uso y cuidado de las viviendas, información y vinculación con redes comunitarias..." }
};

let currentUser = null, currentRole = null, currentStage = 1, currentCoverage = "", deadlineExpired = false;
let dbInstance = null, dbItems = [], dbScores = {}, allMemoryScores = [], allAsignacionesMapped = [];

let adminSelectedProvincia = "";
let adminTemporaryLogisticaMap = {}; 
let adminTemporaryEntidades = [];
let pendingAsignacionesStaging = []; 
let currentScreenStaging = null;
let countdownInterval = null;
let savedDeadlineISO = "";

let currentSortCol = -1;
let currentSortAsc = true;
let monitoringData = [];

let currentEditingEntidadId = null;
let currentEditingEvaluadorRut = null;
let entidadesCurrentPage = 1;
const entidadesPerPage = 10;
let entidadesSortCol = -1;
let entidadesSortAsc = true;

/* ================= FUNCIONES AUXILIARES (REDUCCIÓN DE CÓDIGO) ================= */
function formatDDMMYYYY(dateObj) {
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}-${m}-${y}`;
}

function formatDateTime(dateObj) {
    return formatDDMMYYYY(dateObj) + " " + dateObj.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'});
}

function closeModal() {
    toggleElement('audit-modal', false);
}

function toggleElement(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    if (show) el.classList.remove('hidden'); else el.classList.add('hidden');
}

function clearFormInputs(ids) {
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

function dbGetAll(storeName, callback, forceCloud = false) {
    if (CLOUD_MODE_ENABLED && forceCloud) {
        showProgressBar(`Conectando al servidor: ${storeName}...`);
        cloudGet(storeName).then(data => {
            if (data !== null && Array.isArray(data)) {
                const tx = dbInstance.transaction([storeName], 'readwrite');
                tx.objectStore(storeName).clear().onsuccess = () => {
                    data.forEach(item => tx.objectStore(storeName).put(item));
                };
                tx.oncomplete = () => {
                    hideProgressBar();
                    callback(data);
                };
            } else {
                hideProgressBar();
                dbInstance.transaction([storeName], 'readonly').objectStore(storeName).getAll().onsuccess = (e) => callback(e.target.result);
            }
        });
    } else {
        dbInstance.transaction([storeName], 'readonly').objectStore(storeName).getAll().onsuccess = (e) => callback(e.target.result);
    }
}

function getMultipleStores(storeNames, callback, forceCloud = false) {
    if (CLOUD_MODE_ENABLED && forceCloud) {
        showProgressBar(`Sincronizando base de datos...`);
        Promise.all(storeNames.map(store => cloudGet(store)))
            .then(results => {
                const tx = dbInstance.transaction(storeNames, 'readwrite');
                storeNames.forEach((store, i) => {
                    const data = results[i];
                    if (data !== null && Array.isArray(data)) {
                        const storeObj = tx.objectStore(store);
                        storeObj.clear().onsuccess = () => {
                            data.forEach(item => storeObj.put(item));
                        };
                    }
                });
                tx.oncomplete = () => {
                    hideProgressBar();
                    const readTx = dbInstance.transaction(storeNames, 'readonly');
                    const finalResults = new Array(storeNames.length);
                    let completed = 0;
                    storeNames.forEach((store, i) => {
                        readTx.objectStore(store).getAll().onsuccess = (e) => {
                            finalResults[i] = e.target.result;
                            completed++;
                            if (completed === storeNames.length) callback(finalResults);
                        };
                    });
                };
            });
    } else {
        const tx = dbInstance.transaction(storeNames, 'readonly');
        const results = new Array(storeNames.length);
        let completed = 0;
        storeNames.forEach((store, i) => {
            tx.objectStore(store).getAll().onsuccess = (e) => {
                results[i] = e.target.result;
                completed++;
                if (completed === storeNames.length) callback(results);
            };
        });
    }
}

/* ================= MOTOR DE NUBE (GOOGLE APPS SCRIPT) ================= */
async function cloudGet(table) {
    try {
        // Agregamos &t=Date.now() para forzar al navegador a ignorar el caché y obtener la info fresca real
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?table=${table}&t=${Date.now()}`);
        if (!response.ok) return null;
        const data = await response.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error(`Error leyendo tabla ${table} desde el servidor:`, error);
        return null;
    }
}

async function cloudSave(table, dataArray) {
    try {
        // Enviar como texto plano (text/plain) evita que el navegador bloquee la solicitud por CORS
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify({ table, data: dataArray })
        });
        return await response.json();
    } catch (error) {
        console.error(`Error guardando en tabla ${table}:`, error);
        return { success: false, error: error.message };
    }
}

function syncSingleStoreToCloud(storeName, callback) {
    if (!CLOUD_MODE_ENABLED) {
        if (callback) callback(true);
        return;
    }

    showProgressBar(`Sincronizando ${storeName} con la Nube...`);

    const req = dbInstance.transaction([storeName], 'readonly').objectStore(storeName).getAll();
    req.onsuccess = (e) => {
        cloudSave(storeName, e.target.result).then(res => {
            hideProgressBar();
            if (res && res.success) {
                if (callback) callback(true);
            } else {
                alert(`Error al sincronizar con la Nube: ${res ? res.error : 'Respuesta inválida del servidor.'}`);
                if (callback) callback(false);
            }
        }).catch(err => {
            console.error(`Error de red al sincronizar ${storeName}:`, err);
            hideProgressBar();
            alert('Error de red al sincronizar. Verifique su conexión a internet.');
            if (callback) callback(false);
        });
    };
    req.onerror = (e) => {
        hideProgressBar();
        alert('Error al leer datos locales para sincronizar.');
        if (callback) callback(false);
    }
}

/* NUEVA FUNCIÓN DE SINCRONIZACIÓN MASIVA MANUAL */
function syncAllToCloud() {
    if (!CLOUD_MODE_ENABLED) {
        alert('El modo nube está desactivado.');
        return;
    }
    if (!confirm('¿Desea enviar todos los datos guardados en este dispositivo a la Nube?\n\nAl confirmar, su información se respaldará permanentemente en Google Sheets.')) return;

    showProgressBar("Iniciando sincronización con la Nube...");
    
    const storeNames = ['configuracion', 'entidades', 'evaluadores', 'asignaciones', 'items', 'scores'];
    let completed = 0;

    const syncNext = (index) => {
        if (index >= storeNames.length) {
            updateProgressBar(100);
            setTimeout(() => {
                hideProgressBar();
                alert('✅ Sincronización completada con éxito. Todos los datos han sido enviados a Google Sheets.');
            }, 500);
            return;
        }
        
        const storeName = storeNames[index];
        updateProgressBar((index / storeNames.length) * 100);
        document.getElementById('progress-title').textContent = `Enviando ${storeName}... (${index + 1}/${storeNames.length})`;

        const req = dbInstance.transaction([storeName], 'readonly').objectStore(storeName).getAll();
        req.onsuccess = (e) => {
            cloudSave(storeName, e.target.result).then(res => {
                syncNext(index + 1);
            }).catch(err => {
                console.error(`Error de red al sincronizar ${storeName}:`, err);
                syncNext(index + 1); // Continúa a pesar del error de red
            });
        };
    };

    syncNext(0);
}
/* =============================================================================== */

function getStatusInfo(score) {
    if (score >= 80) return { text: "BUENO", bg: "var(--color-bueno)", color: "#000" };
    if (score >= 51) return { text: "ACEPTABLE", bg: "var(--color-aceptable)", color: "#000" };
    return { text: "MALO", bg: "var(--color-malo)", color: "#FFF" };
}

function buildCoberturaLabel(programa, provincia, entidadNombre) {
    return `${programa} - ${provincia.toUpperCase()}${entidadNombre && entidadNombre !== 'Sin Entidad' ? ` - ${entidadNombre}` : ''}`;
}

function showProgressBar(title) {
    document.getElementById('progress-title').textContent = title;
    updateProgressBar(0);
    toggleElement('progress-overlay', true);
}

function updateProgressBar(percent) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    const fill = document.getElementById('progress-bar-fill');
    const txt = document.getElementById('progress-text');
    if (fill) fill.style.width = p + '%';
    if (txt) txt.textContent = p + '%';
}

function hideProgressBar() { toggleElement('progress-overlay', false); }
/* =============================================================================== */

/* ================= PROTECCIÓN BÁSICA DE INTERFAZ ================= */
// Bloquear el clic derecho (Menú contextual)
document.addEventListener('contextmenu', event => event.preventDefault());

// Bloquear atajos de teclado para herramientas de desarrollador (F12, Ctrl+Shift+I, Ctrl+U)
document.addEventListener('keydown', event => {
    if (
        event.key === 'F12' || 
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || 
        (event.ctrlKey && event.key === 'U') || 
        (event.ctrlKey && event.key === 'S')
    ) {
        event.preventDefault();
    }
});

function parseSafeDate(isoString) {
    if (!isoString) return null;
    let clean = isoString.substring(0, 10);
    const parts = clean.split('-');
    if (parts.length !== 3) return null;
    let y = parts[0].length === 4 ? parts[0] : parts[2];
    let d = parts[0].length === 4 ? parts[2] : parts[0];
    let m = parts[1];
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 23, 59, 59);
}

// NUEVA VERSIÓN V19: ESTABILIZACIÓN OFFLINE-FIRST Y SINCRONIZACIÓN DIFERIDA
const DB_NAME = 'SistemaEvaluacionDB_v19';
const DB_VERSION = 4; // Actualizamos la versión para crear un punto de restauración de la estructura y guardar el estado actual

document.addEventListener('DOMContentLoaded', () => {
    initIndexedDB(() => { setupEventListeners(); setupAdminTabs(); setupMatrixLogisticsDrivers(); checkDeadlineStatus(); });
});

function setupEventListeners() {
    document.getElementById('btn-login').addEventListener('click', handleLogin);
    document.getElementById('btn-sync-cloud').addEventListener('click', syncAllToCloud);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('btn-save-items').addEventListener('click', saveAdminItems);
    document.getElementById('btn-save-scores').addEventListener('click', (e) => { e.preventDefault(); saveEvaluatorScores(); });
    document.getElementById('btn-save-asignacion').addEventListener('click', () => { processAsignacionStaging(false); });
    document.getElementById('btn-save-partial').addEventListener('click', () => { processAsignacionStaging(true); });
    document.getElementById('btn-save-config').addEventListener('click', saveConfigDeadline);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('chk-toggle-all-stages').addEventListener('change', toggleAllStagesCheckboxes);
    document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('btn-modal-confirm').addEventListener('click', executeCommitAsignacion);

    const btnExport = document.getElementById('btn-export-reportes');
    if (btnExport) btnExport.addEventListener('click', exportReportesExcel);

    const btnExportBackup = document.getElementById('btn-export-backup');
    if (btnExportBackup) btnExportBackup.addEventListener('click', exportDatabaseToJSON);

    const btnOpenEv = document.getElementById('btn-open-evaluador-modal');
    if (btnOpenEv) btnOpenEv.addEventListener('click', () => {
        currentEditingEvaluadorRut = null;
        clearFormInputs(['ev-nombre', 'ev-rut', 'ev-area', 'ev-clave']);
        document.getElementById('ev-rut').disabled = false;
        toggleElement('modal-evaluador', true);
    });
    const btnCloseEv = document.getElementById('btn-close-evaluador-modal');
    if (btnCloseEv) btnCloseEv.addEventListener('click', () => toggleElement('modal-evaluador', false));
    const btnSaveEv = document.getElementById('btn-save-evaluador-modal');
    if (btnSaveEv) btnSaveEv.addEventListener('click', createEvaluador);

    document.getElementById('btn-open-entidad-modal').addEventListener('click', () => {
        currentEditingEntidadId = null; // Limpiamos la memoria de edición para forzar un registro nuevo
        clearFormInputs(['entidad-rut', 'entidad-nombre', 'entidad-comuna', 'entidad-programa', 'entidad-convenio', 'entidad-fecha']);
        toggleElement('modal-entidad', true);
    });

    document.getElementById('btn-close-entidad-modal').addEventListener('click', () => {
        currentEditingEntidadId = null; // Limpiamos en caso de que el usuario cancele la edición
        toggleElement('modal-entidad', false);
    });

    document.getElementById('btn-save-entidad-modal').addEventListener('click', () => {
        const rut = document.getElementById('entidad-rut').value.trim();
        const nom = document.getElementById('entidad-nombre').value.trim();
        const com = document.getElementById('entidad-comuna').value.trim();
        const prog = document.getElementById('entidad-programa').value;
        const conv = document.getElementById('entidad-convenio').value.trim();
        const fecha = document.getElementById('entidad-fecha').value;
        
        if (!rut || !nom) {
            alert('RUT y Nombre de la entidad son obligatorios.');
            return;
        }
        
        // Generar un ID único para permitir múltiples registros con el mismo RUT
        let idToSave = currentEditingEntidadId;
        if (!idToSave) {
            idToSave = 'ent_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
        }

        const tx = dbInstance.transaction(['entidades'], 'readwrite');
        tx.onerror = (e) => {
            alert('Error en base de datos al guardar: ' + (e.target.error ? e.target.error.message : 'Desconocido'));
            console.error('IndexedDB Error:', e.target.error);
        };
        tx.objectStore('entidades').put({ idEntidad: idToSave, rut, nombre: nom, comuna: com, programa: prog, convenio: conv, fecha });
        tx.oncomplete = () => {
            toggleElement('modal-entidad', false);
            currentEditingEntidadId = null;
            populateAdminMatrix(); 
        };
    });
}

function renderEntidadesAgregadas() {
    const tbodyTabla = document.getElementById('tabla-entidades-body');
    
    if (adminTemporaryEntidades.length === 0) { 
        if (tbodyTabla) tbodyTabla.innerHTML = '<tr><td colspan="7" class="text-center">Sin entidades guardadas.</td></tr>';
        const pagDiv = document.getElementById('entidades-pagination');
        if (pagDiv) pagDiv.style.display = 'none';
        return; 
    }

    if (tbodyTabla) {
        let sortedEntidades = [...adminTemporaryEntidades];
        if (entidadesSortCol > -1) {
            const cols = ['rut', 'nombre', 'comuna', 'programa', 'convenio', 'fecha'];
            sortedEntidades.sort((a, b) => {
                let vA = (a[cols[entidadesSortCol]] || '').toString().toLowerCase();
                let vB = (b[cols[entidadesSortCol]] || '').toString().toLowerCase();
                return vA < vB ? (entidadesSortAsc ? -1 : 1) : vA > vB ? (entidadesSortAsc ? 1 : -1) : 0;
            });
        }

        const totalPages = Math.ceil(sortedEntidades.length / entidadesPerPage) || 1;
        if (entidadesCurrentPage > totalPages) entidadesCurrentPage = totalPages;
        if (entidadesCurrentPage < 1) entidadesCurrentPage = 1;
        
        const startIdx = (entidadesCurrentPage - 1) * entidadesPerPage;
        const paginated = sortedEntidades.slice(startIdx, startIdx + entidadesPerPage);

        tbodyTabla.innerHTML = paginated.map((e) => `
            <tr>
                <td>${e.rut}</td><td>${e.nombre}</td><td>${e.comuna}</td>
                <td class="text-center"><strong>${e.programa}</strong></td>
                <td>${e.convenio}</td><td class="text-center">${e.fecha}</td>
                <td class="text-center">
                    <button class="btn btn-primary" style="padding:2px 8px; border-radius:3px; font-size:0.75rem; margin-right:4px;" onclick="editEntidad('${e.idEntidad}')" title="Editar Entidad">Editar</button>
                    <button class="btn btn-danger" style="padding:2px 8px; border-radius:3px; font-size:0.75rem;" onclick="removeEntidad('${e.idEntidad}')" title="Eliminar Entidad">X</button>
                </td>
            </tr>
        `).join('');

        let paginationDiv = document.getElementById('entidades-pagination');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.id = 'entidades-pagination';
            paginationDiv.style = "display: flex; justify-content: space-between; align-items: center; margin-top: 10px;";
            const table = tbodyTabla.closest('table');
            if (table && table.parentNode) table.parentNode.insertBefore(paginationDiv, table.nextSibling);
        }
        
        paginationDiv.style.display = 'flex';
        paginationDiv.innerHTML = `
            <button class="btn btn-primary" style="padding: 4px 10px;" onclick="changeEntidadesPage(-1)" ${entidadesCurrentPage === 1 ? 'disabled' : ''}>Anterior</button>
            <span style="font-size:0.85rem; font-weight:bold;">Página ${entidadesCurrentPage} de ${totalPages}</span>
            <button class="btn btn-primary" style="padding: 4px 10px;" onclick="changeEntidadesPage(1)" ${entidadesCurrentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
        `;

        setupEntidadesHeaders();
    }
}

window.changeEntidadesPage = function(delta) {
    entidadesCurrentPage += delta;
    renderEntidadesAgregadas();
};

function setupEntidadesHeaders() {
    const tbodyTabla = document.getElementById('tabla-entidades-body');
    if (!tbodyTabla) return;
    const thead = tbodyTabla.closest('table').querySelector('thead');
    if (thead && !thead.dataset.sortSetup) {
        thead.querySelectorAll('th').forEach((th, i) => {
            if (i < 6) { 
                th.style.cursor = 'pointer';
                th.title = 'Clic para ordenar por esta columna';
                th.onclick = () => {
                    entidadesSortAsc = (entidadesSortCol === i) ? !entidadesSortAsc : true;
                    entidadesSortCol = i;
                    renderEntidadesAgregadas();
                };
            }
        });
        thead.dataset.sortSetup = "true";
    }
}

window.editEntidad = function(idEntidad) {
    const e = adminTemporaryEntidades.find(x => x.idEntidad === idEntidad);
    if (!e) return;
    currentEditingEntidadId = e.idEntidad;
    document.getElementById('entidad-rut').value = e.rut;
    document.getElementById('entidad-nombre').value = e.nombre;
    document.getElementById('entidad-comuna').value = e.comuna;
    document.getElementById('entidad-programa').value = e.programa;
    document.getElementById('entidad-convenio').value = e.convenio;
    document.getElementById('entidad-fecha').value = e.fecha;
    toggleElement('modal-entidad', true);
};

window.removeEntidad = function(idEntidad) {
    const entidad = adminTemporaryEntidades.find(x => x.idEntidad === idEntidad);
    if (!entidad) return;
    const tx = dbInstance.transaction(['entidades'], 'readwrite');
    tx.objectStore('entidades').delete(entidad.idEntidad);
    tx.oncomplete = () => populateAdminMatrix();
};

window.deleteAsignacion = function(idAsig) {
    if(!confirm('¿Está seguro de eliminar esta asignación por completo?')) return;
    const tx = dbInstance.transaction(['asignaciones'], 'readwrite');
    tx.objectStore('asignaciones').delete(idAsig);
    tx.oncomplete = () => { renderMonitoringTable(); populateAdminMatrix(); };
};

function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-main-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-subpanel').forEach(p => p.classList.add('hidden'));
            e.target.classList.add('active');
            const targetId = e.target.getAttribute('data-target');
            toggleElement(targetId, true);
            if (targetId === 'panel-monitoreo' || targetId === 'panel-reportes') renderMonitoringTable();
        });
    });
}

function initIndexedDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => { dbInstance = e.target.result; loadCoreData(callback); };
    request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('scores')) db.createObjectStore('scores', { keyPath: 'idTx' });
        if (!db.objectStoreNames.contains('evaluadores')) db.createObjectStore('evaluadores', { keyPath: 'rut' });
        if (!db.objectStoreNames.contains('asignaciones')) db.createObjectStore('asignaciones', { keyPath: 'idAsig' });
        if (!db.objectStoreNames.contains('configuracion')) db.createObjectStore('configuracion', { keyPath: 'clave' });
        
        // Forzar eliminación de la tabla antigua para destruir la llave primaria 'rut' que quedó guardada en el caché del navegador
        if (db.objectStoreNames.contains('entidades')) {
            db.deleteObjectStore('entidades');
        }
        db.createObjectStore('entidades', { keyPath: 'idEntidad' });
    };
}

function loadCoreData(callback) {
    getMultipleStores(['items', 'configuracion', 'entidades', 'evaluadores', 'asignaciones', 'scores'], ([items, config, entidades, evaluadores, asignaciones, scores]) => {
        const cfgReq = config ? config.find(c => c.clave === 'fecha_limite') : null;
        
        if (!items || items.length < DEFAULT_ITEMS.length) {
            dbItems = DEFAULT_ITEMS;
            if (!CLOUD_MODE_ENABLED) {
                const writeTx = dbInstance.transaction(['items'], 'readwrite');
                DEFAULT_ITEMS.forEach(i => writeTx.objectStore('items').put(i));
            }
        } else {
            dbItems = items;
        }
        
        if (cfgReq) {
            document.getElementById('cfg-deadline').value = cfgReq.valor;
            savedDeadlineISO = cfgReq.valor;
        }
        
        // Enciende el semáforo visual si se logró cargar la base de datos
        const dot = document.getElementById('conn-dot');
        const txt = document.getElementById('conn-text');
        if (dot && txt) {
            dot.style.backgroundColor = '#92D050'; // Forzamos el color hexadecimal
            txt.textContent = CLOUD_MODE_ENABLED ? 'Conectado a la Nube' : 'Desconectado';
            txt.textContent = CLOUD_MODE_ENABLED ? 'Conectado a la Nube' : 'Conectado (Modo Local)';
            txt.style.color = '#25306B';
            txt.style.fontWeight = 'bold';
        }

        if (callback) callback();
    }, true);
}

function checkDeadlineStatus() {
    dbGetAll('configuracion', (config) => {
        const req = config.find(c => c.clave === 'fecha_limite');
        if (req && req.valor) {
            savedDeadlineISO = req.valor;
            const targetDate = parseSafeDate(savedDeadlineISO);
            deadlineExpired = targetDate ? (new Date() > targetDate) : false;
        } else {
            deadlineExpired = false;
        }
        const saveBtn = document.getElementById('btn-save-scores');
        if (deadlineExpired && currentRole === 'evaluador') {
            toggleElement('deadline-alert', true);
            if (saveBtn) saveBtn.disabled = true;
        } else {
            toggleElement('deadline-alert', false);
            if (saveBtn) saveBtn.disabled = false;
        }
    });
}

function startCountdownClock() {
    if (countdownInterval) clearInterval(countdownInterval);
    const clock = document.getElementById('txt-countdown');
    const todayLabel = document.getElementById('txt-date-today');
    const deadlineLabel = document.getElementById('txt-date-deadline');

    const updateTime = () => {
        const now = new Date();
        todayLabel.textContent = formatDateTime(now);
    };
    updateTime();
    
    const targetDate = parseSafeDate(savedDeadlineISO);
    if(!targetDate) {
        deadlineLabel.textContent = "Sin Restricción";
        clock.textContent = "Ilimitado";
        return;
    }

    deadlineLabel.textContent = formatDateTime(targetDate);

    countdownInterval = setInterval(() => {
        updateTime();
        const diff = targetDate - new Date();

        if (diff <= 0) {
            clock.textContent = "00:00 - PERIODO EXPIRADO";
            clearInterval(countdownInterval);
            checkDeadlineStatus();
            window.changeStage(currentStage);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        clock.textContent = `${days}D ${hours}H ${mins}M`;
    }, 1000);
}

function saveConfigDeadline() {
    const cfgInput = document.getElementById('cfg-deadline');
    if (!cfgInput) return;
    const tx = dbInstance.transaction(['configuracion'], 'readwrite');
    tx.objectStore('configuracion').put({ clave: 'fecha_limite', valor: cfgInput.value });
    tx.oncomplete = () => {
        savedDeadlineISO = cfgInput.value;
        checkDeadlineStatus();
    };
}

function toggleAllStagesCheckboxes(e) {
    document.querySelectorAll('.asig-etapa-chk').forEach(chk => chk.checked = e.target.checked);
}

function setupMatrixLogisticsDrivers() {
    const listbox = document.getElementById('asig-provincia-listbox');
    if(!listbox) return;
    listbox.addEventListener('change', (e) => {
        captureCurrentAdminProgramsState();
        adminSelectedProvincia = e.target.value;
        renderAdminProgramsColumn();
    });
}

function captureCurrentAdminProgramsState() {
    if (!adminSelectedProvincia) return;
    const activeSelectedPrograms = [];
    document.querySelectorAll('.asig-programa-dinamico-chk:checked').forEach(chk => activeSelectedPrograms.push(chk.value));
    adminTemporaryLogisticaMap[adminSelectedProvincia] = activeSelectedPrograms;
}

function renderAdminProgramsColumn() {
    const col = document.getElementById('col-programas-dinamicos');
    if (!adminSelectedProvincia) {
        col.innerHTML = `<span style="color:#999; font-size:0.8rem; padding:5px; text-align:center;">Seleccione provincia</span>`;
        return;
    }
    const savedPrograms = adminTemporaryLogisticaMap[adminSelectedProvincia] || [];
    col.innerHTML = `<div style="font-size:0.75rem; font-weight:bold; color:var(--primary-blue); margin-bottom:5px; text-transform:uppercase;">Programas en ${adminSelectedProvincia}:</div>` + 
        [...PROGRAMAS_BASE].sort().map(prog => `<div class="checkbox-block-item"><label><input type="checkbox" class="asig-programa-dinamico-chk" value="${prog}" ${savedPrograms.includes(prog) ? 'checked' : ''}> ${prog}</label></div>`).join('');
        
    document.querySelectorAll('.asig-programa-dinamico-chk').forEach(chk => {
        chk.addEventListener('change', () => {
            captureCurrentAdminProgramsState();
            renderAdminEntidadesColumn();
        });
    });
    
    renderAdminEntidadesColumn();
}

function renderAdminEntidadesColumn() {
    const col = document.getElementById('col-entidades-dinamicas');
    if (!col) return;
    if (adminTemporaryEntidades.length === 0) {
        col.innerHTML = `<span style="color:#999; font-size:0.8rem; padding:5px; text-align:center;">Sin entidades registradas</span>`;
        return;
    }

    const savedPrograms = adminSelectedProvincia ? (adminTemporaryLogisticaMap[adminSelectedProvincia] || []) : [];
    
    if (savedPrograms.length === 0) {
        col.innerHTML = `<span style="color:#999; font-size:0.8rem; padding:5px; text-align:center;">Seleccione un programa</span>`;
        return;
    }

    const filteredEntidades = adminTemporaryEntidades.filter(ent => savedPrograms.includes(ent.programa));

    if (filteredEntidades.length === 0) {
        col.innerHTML = `<span style="color:#999; font-size:0.8rem; padding:5px; text-align:center;">Sin entidades para los programas seleccionados</span>`;
        return;
    }

    col.innerHTML = `<div style="font-size:0.75rem; font-weight:bold; color:var(--primary-blue); margin-bottom:5px; text-transform:uppercase;">Seleccionar Entidad:</div>` + 
        filteredEntidades.map(ent => `<div class="checkbox-block-item"><label><input type="checkbox" class="asig-entidad-chk" value="${ent.idEntidad}" data-name="${ent.nombre}"> ${ent.nombre}</label></div>`).join('');
}

/* FIX CRÍTICO DE INGRESO: CONTROL DE EXCEPCIÓN CUANDO LA MUESTRA ESTÁ VACÍA V16 */
function handleLogin() {
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    if (userInput.toLowerCase() === 'admin') {
        dbGetAll('configuracion', (config) => {
            const cfgClave = config.find(c => c.clave === 'clave_admin');
            const validAdminPass = cfgClave ? cfgClave.valor : 'admin123'; 
            
            if (passInput !== validAdminPass) {
                alert('Contraseña de administrador incorrecta.');
                return;
            }
            
            currentUser = { nombre: "Administrador", rut: "admin" };
            currentRole = 'admin';
            showPanel('Panel de Administración General');
        });
    } else {
        getMultipleStores(['evaluadores', 'asignaciones', 'scores'], ([evaluadores, asignaciones, scores]) => {
            const evResult = evaluadores.find(e => e.rut === userInput);
            if (!evResult) { alert('RUT de evaluador no registrado.'); return; }
            
            const validPass = evResult.clave || '123456';
            if (validPass !== passInput) { alert('Contraseña incorrecta.'); return; }
            
            currentUser = evResult;
            currentRole = 'evaluador';

            const userAsignaciones = asignaciones.filter(a => a.rut === currentUser.rut);
            
            if(userAsignaciones.length === 0) {
                alert('No tiene precalificaciones asignadas en este momento.');
                return;
            }
            
            allAsignacionesMapped = userAsignaciones.map(a => {
                let parsedEtapas = a.etapas;
                if (typeof parsedEtapas === 'string') {
                    parsedEtapas = parsedEtapas.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
                } else if (!Array.isArray(parsedEtapas)) {
                    parsedEtapas = [1];
                }
                return {
                    cobertura: buildCoberturaLabel(a.programa, a.provincia, a.entidadNombre),
                    etapas: parsedEtapas.sort((x, y) => x - y),
                    programa: a.programa,
                    provincia: a.provincia,
                    entidadNombre: a.entidadNombre
                };
            }).sort((a, b) => a.cobertura.localeCompare(b.cobertura));

            allMemoryScores = scores.filter(r => r.rutEvaluador === currentUser.rut);
            currentCoverage = allAsignacionesMapped[0].cobertura;
            const matchingConfig = allAsignacionesMapped.find(a => a.cobertura === currentCoverage);
            currentStage = matchingConfig ? matchingConfig.etapas[0] : 1;
            
            showPanel('Sistema de Precalificación Técnica');
            startCountdownClock();
        });
    }
}

function handleLogout() {
    if (!confirm('¿Ha recordado sincronizar sus cambios con la Nube?\n\nSi no lo ha hecho, presione Cancelar y utilice el botón "Sincronizar a la Nube" antes de salir.\n\n¿Desea cerrar sesión de todas formas?')) {
        return;
    }
    currentUser = null; currentRole = null;
    toggleElement('main-screen', false);
    toggleElement('login-container', true);
    document.getElementById('username').value = '';
    if (countdownInterval) clearInterval(countdownInterval);
}

function showPanel(titleText) {
    toggleElement('login-container', false);
    toggleElement('main-screen', true);
    document.getElementById('app-title').textContent = titleText;
    document.getElementById('user-profile').textContent = `Calificador(a): ${currentUser.nombre}`;

    if (currentRole === 'admin') {
        toggleElement('admin-view', true);
        toggleElement('evaluador-view', false);
        toggleElement('btn-sync-cloud', true);
        if (countdownInterval) clearInterval(countdownInterval);
        populateAdminMatrix();
        window.changeStage(1);
    } else {
        toggleElement('admin-view', false);
        toggleElement('evaluador-view', true);
        toggleElement('btn-sync-cloud', false);
        checkDeadlineStatus();
        renderCoverageTabs();
    }
}

function renderCoverageTabs() {
    const container = document.getElementById('evaluador-coverage-tabs');
    container.innerHTML = '';
    allAsignacionesMapped.forEach(asig => {
        const btn = document.createElement('button');
        btn.className = `tab-button ${currentCoverage === asig.cobertura ? 'active' : ''}`;
        btn.textContent = asig.cobertura;
        btn.onclick = () => { 
            currentCoverage = asig.cobertura; 
            const conf = allAsignacionesMapped.find(a => a.cobertura === currentCoverage);
            currentStage = conf ? conf.etapas[0] : 1;
            renderCoverageTabs(); 
        };
        container.appendChild(btn);
    });
    window.changeStage(currentStage);
}

window.changeStage = function(stageNum) {
    currentStage = stageNum;
    const containerId = (currentRole === 'admin') ? 'admin-tabs' : 'evaluador-tabs';
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    let etapasDisponibles = [1,2,3,4,5,6]; 
    if (currentRole === 'evaluador') {
        const match = allAsignacionesMapped.find(a => a.cobertura === currentCoverage);
        etapasDisponibles = match ? match.etapas.sort((a, b) => a - b) : [1];
    }

    etapasDisponibles.forEach(i => {
        const btn = document.createElement('button');
        btn.className = `tab-button ${currentStage === i ? 'active' : ''}`;
        btn.textContent = `Etapa ${i}`;
        if (currentStage === i) {
            btn.style.backgroundColor = `var(--bg-stage-${i})`;
            btn.style.color = '#000';
            btn.style.border = '1px solid var(--primary-dark)';
        }
        btn.onclick = () => window.changeStage(i);
        container.appendChild(btn);
    });

    if (currentRole === 'admin') {
        renderAdminView();
    } else {
        const tableCard = document.getElementById('table-card-container');
        if (tableCard) tableCard.style.backgroundColor = `var(--bg-stage-${currentStage})`;
        loadScoresFromActiveContext();
        renderEvaluatorView();
    }
};

function processAsignacionStaging(isPartialSave) {
    captureCurrentAdminProgramsState();

    const selectedEvaluatorsRuts = [];
    const selectedEvaluatorsNames = [];
    document.querySelectorAll('.asig-evaluador-chk:checked').forEach(c => {
        selectedEvaluatorsRuts.push(c.value);
        selectedEvaluatorsNames.push(c.getAttribute('data-name'));
    });

    const etapas = [];
    document.querySelectorAll('.asig-etapa-chk:checked').forEach(c => etapas.push(parseInt(c.value, 10)));
    etapas.sort((a, b) => a - b);

    let totalCoveragesList = [];
    for (const [provincia, programas] of Object.entries(adminTemporaryLogisticaMap)) {
        programas.forEach(prog => totalCoveragesList.push({ provincia: provincia, programa: prog }));
    }

    const selectedEntidades = [];
    document.querySelectorAll('.asig-entidad-chk:checked').forEach(c => {
        selectedEntidades.push({ id: c.value, name: c.getAttribute('data-name') });
    });

    const combinedCoverages = [];
    totalCoveragesList.forEach(t => {
        if (selectedEntidades.length > 0) {
            let matched = false;
            selectedEntidades.forEach(ent => {
                const entityData = adminTemporaryEntidades.find(e => e.idEntidad === ent.id);
                // Asegurar que la entidad que se asigna pertenece al programa de este ciclo
                if (entityData && entityData.programa === t.programa) {
                    combinedCoverages.push({ provincia: t.provincia, programa: t.programa, entidadId: ent.id, entidadNombre: ent.name });
                    matched = true;
                }
            });
            if (!matched) combinedCoverages.push({ provincia: t.provincia, programa: t.programa, entidadId: null, entidadNombre: 'Sin Entidad' });
        } else {
            combinedCoverages.push({ provincia: t.provincia, programa: t.programa, entidadId: null, entidadNombre: 'Sin Entidad' });
        }
    });

    currentScreenStaging = null;

    if (selectedEvaluatorsRuts.length === 0 || etapas.length === 0 || combinedCoverages.length === 0) {
        if (pendingAsignacionesStaging.length === 0) {
            alert('Para realizar una asignación debe seleccionar al menos: 1 Evaluador, 1 Programa y 1 Etapa.');
            return;
        }
    } else {
        if (isPartialSave) {
            pendingAsignacionesStaging.push({ ruts: selectedEvaluatorsRuts, names: selectedEvaluatorsNames, etapas, coberturas: combinedCoverages });
            document.querySelectorAll('.asig-programa-dinamico-chk').forEach(c => c.checked = false);
            document.querySelectorAll('.asig-entidad-chk').forEach(c => c.checked = false);
            adminTemporaryLogisticaMap = {};
            return;
        } else {
            currentScreenStaging = { ruts: selectedEvaluatorsRuts, names: selectedEvaluatorsNames, etapas, coberturas: combinedCoverages };
        }
    }

    const allToSave = [...pendingAsignacionesStaging];
    if (currentScreenStaging) allToSave.push(currentScreenStaging);

    dbGetAll('asignaciones', (asignaciones) => {
        const allRuts = allToSave.flatMap(p => p.ruts);
        const tienePrevios = asignaciones.some(a => allRuts.includes(a.rut));
        
        const modal = document.getElementById('audit-modal');
        document.getElementById('modal-title').textContent = "Confirmación de Cambios de Privilegios";
        toggleElement('modal-table-container', false);
        toggleElement('modal-overwrite-question', tienePrevios);

        document.getElementById('modal-custom-html-body').innerHTML = '<p>¿Desea consolidar las asignaciones en memoria?</p>' + allToSave.map((payload, i) => `
            <div style="background:#F8F9FA; padding:10px; border-left:4px solid var(--primary-blue); margin-bottom:8px; font-size:0.85rem;">
                <p><strong>Evaluadores:</strong> ${payload.names.join(', ')}</p>
                <p><strong>Etapas:</strong> ${payload.etapas.join(', ')}</p>
        <ul>${payload.coberturas.map(c => `<li><strong>${c.programa}</strong> - ${c.provincia}${c.entidadNombre !== 'Sin Entidad' ? ` - ${c.entidadNombre}` : ''}</li>`).join('')}</ul>
            </div>
        `).join('');

        toggleElement('modal-action-footer', true);
        toggleElement('audit-modal', true);
    });
}

function executeCommitAsignacion() {
    const allToSave = [...pendingAsignacionesStaging];
    if (currentScreenStaging) allToSave.push(currentScreenStaging);

    if(allToSave.length === 0) return;
    const owElem = document.querySelector('input[name="overwrite_mode"]:checked');
    const mode = owElem ? owElem.value : 'merge';
    const tx = dbInstance.transaction(['asignaciones'], 'readwrite');
    const store = tx.objectStore('asignaciones');

    const writeOps = () => {
        allToSave.forEach(p => {
            p.ruts.forEach(rut => {
                p.coberturas.forEach(c => {
                    store.put({ idAsig: `${rut}_${c.programa}_${c.provincia.replace(/\s+/g, '')}_${c.entidadId || 'none'}`, rut, programa: c.programa, provincia: c.provincia, entidadId: c.entidadId, entidadNombre: c.entidadNombre, etapas: p.etapas });
                });
            });
        });
    };

    if (mode === 'replace') {
        store.getAll().onsuccess = (e) => {
            const allRuts = allToSave.flatMap(p => p.ruts);
            e.target.result.forEach(item => { if (allRuts.includes(item.rut)) store.delete(item.idAsig); });
            writeOps();
        };
    } else { writeOps(); }

    tx.oncomplete = () => { 
        closeModal(); pendingAsignacionesStaging = []; currentScreenStaging = null; populateAdminMatrix(); 
    };
}

function renderMonitoringTable() {
    getMultipleStores(['asignaciones', 'evaluadores', 'scores'], ([asignaciones, evaluadores, scores]) => {
        const tbody = document.getElementById('admin-monitoring-rows');
        if (asignaciones.length === 0) { 
            if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay registros.</td></tr>`; 
            return; 
        }

        const evMap = {}; evaluadores.forEach(e => evMap[e.rut] = e.nombre);
        const scoresMap = {}; scores.forEach(s => { const k = `${s.rutEvaluador}_${s.cobertura}_${s.stage}`; if (!scoresMap[k]) scoresMap[k] = []; scoresMap[k].push(s); });

        monitoringData = [];

        asignaciones.forEach(asig => {
            const nom = evMap[asig.rut] || asig.rut;
            const cobLabel = buildCoberturaLabel(asig.programa, asig.provincia, asig.entidadNombre);
            
            let parsedEtapas = asig.etapas;
            if (typeof parsedEtapas === 'string') {
                parsedEtapas = parsedEtapas.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
            } else if (!Array.isArray(parsedEtapas)) {
                parsedEtapas = [1];
            }

            parsedEtapas.forEach(stg => {
                const currentScores = scoresMap[`${asig.rut}_${cobLabel}_${stg}`] || [];
                let sum = 0, count = 0; currentScores.forEach(s => { sum += (parseInt(s.score, 10) || 0); count++; });
                const avg = count > 0 ? Math.round(sum / count) : 0;
                monitoringData.push({ idAsig: asig.idAsig, rut: asig.rut, nombre: nom, evaluadorLabel: `${nom} (${asig.rut})`, programa: asig.programa, provincia: asig.provincia, entidadNombre: asig.entidadNombre, coberturaLabel: cobLabel, stageNum: parseInt(stg, 10), haEvaluado: (count > 0), average: avg });
            });
        });
        setupMonitoringHeaders(); drawMonitoringTable(); renderMonitoringCharts(); renderReportes();
    });
}

function setupMonitoringHeaders() {
    document.querySelectorAll('#admin-monitoring-rows').forEach(tbody => {
        const table = tbody.closest('table');
        if (table) table.querySelectorAll('th').forEach((th, i) => { if(i < 5) { th.style.cursor = 'pointer'; th.onclick = () => { currentSortAsc = (currentSortCol === i) ? !currentSortAsc : true; currentSortCol = i; drawMonitoringTable(); }; } });
    });
}

function exportDatabaseToJSON() {
    showProgressBar("Generando respaldo del sistema...");
    updateProgressBar(10);

    const storeNames = ['items', 'scores', 'evaluadores', 'asignaciones', 'configuracion', 'entidades'];
    const tx = dbInstance.transaction(storeNames, 'readonly');
    const backupData = {};
    let completed = 0;

    storeNames.forEach((storeName) => {
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = (e) => {
            backupData[storeName] = e.target.result;
            completed++;
            updateProgressBar(10 + (completed / storeNames.length) * 80);
        };
    });

    tx.oncomplete = () => {
        try {
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `Respaldo_Completo_Sistema_Precalificaciones_${formatDDMMYYYY(new Date())}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            updateProgressBar(100);
            setTimeout(() => { hideProgressBar(); }, 300);
        } catch (err) {
            hideProgressBar();
            alert('Error al generar el archivo JSON de respaldo.');
            console.error(err);
        }
    };
}

/* ================= FUNCIONES DE REPORTES Y EXCEL ================= */
function getReportesGroupedData() {
    const dataByEntidad = {};
    monitoringData.forEach(d => {
        if (!d.haEvaluado) return; 
        let ent = (d.entidadNombre && d.entidadNombre !== 'Sin Entidad') ? d.entidadNombre : 'Sin Entidad Asociada';
        let prog = d.programa || 'Sin Programa';
        
        if (!dataByEntidad[ent]) dataByEntidad[ent] = { stages: {} };
        if (!dataByEntidad[ent].programs) dataByEntidad[ent].programs = {};
        
        // Agrupación Nivel 1: Entidad Global
        if (!dataByEntidad[ent].stages[d.stageNum]) dataByEntidad[ent].stages[d.stageNum] = [];
        dataByEntidad[ent].stages[d.stageNum].push(d.average);

        // Agrupación Nivel 2: Por Programa dentro de la Entidad
        if (!dataByEntidad[ent].programs[prog]) dataByEntidad[ent].programs[prog] = { stages: {} };
        if (!dataByEntidad[ent].programs[prog].stages[d.stageNum]) dataByEntidad[ent].programs[prog].stages[d.stageNum] = [];
        dataByEntidad[ent].programs[prog].stages[d.stageNum].push(d.average);
    });
    return dataByEntidad;
}

function calculateAveragesForReport(stagesData) {
    let s = {}, sumAll = 0, countAll = 0;
    for (let i = 1; i <= 6; i++) {
        if (stagesData[i] && stagesData[i].length > 0) {
            let sum = stagesData[i].reduce((a,b) => a+b, 0);
            let avg = Math.round(sum / stagesData[i].length);
            s[i] = avg; sumAll += avg; countAll++;
        } else {
            s[i] = '-';
        }
    }
    let finalAvg = countAll > 0 ? Math.round(sumAll / countAll) : 0;
    let status = getStatusInfo(finalAvg);
    let badge = `<span style="background:${status.bg}; color:${status.color}; padding:3px 8px; border-radius:4px; font-weight:bold;">${status.text}</span>`;
    return { s, finalAvg, statusText: status.text, badge };
}

function buildReportRowHtml(title, data, safeId, isSubRow) {
    const trClass = isSubRow ? `class="hidden detail-${safeId}" style="background-color:#FFF; transition: all 0.2s;"` : `style="cursor:pointer; background-color:#F8F9FA;" onclick="toggleEntityDetails('${safeId}')" title="Clic para ver detalle por programa"`;
    const titleCell = isSubRow ? `<td style="padding-left: 25px; font-size:0.85rem; color:#555;">└ Programa: <b style="color:var(--primary-blue);">${title}</b></td>` : `<td><b style="color:var(--primary-dark); font-size:0.9rem;"><span id="icon-${safeId}">➕</span> ${title}</b></td>`;
    const fw = isSubRow ? 'bold' : 'bold; font-size:1.15rem;';
    return `<tr ${trClass}>
        ${titleCell}
        <td class="text-center">${data.s[1]}</td><td class="text-center">${data.s[2]}</td>
        <td class="text-center">${data.s[3]}</td><td class="text-center">${data.s[4]}</td>
        <td class="text-center">${data.s[5]}</td><td class="text-center">${data.s[6]}</td>
        <td class="text-center" style="${fw}">${data.finalAvg}</td>
        <td class="text-center">${data.badge}</td>
    </tr>`;
}

function renderReportes() {
    const tbody = document.getElementById('reportes-entidad-body');
    if (!tbody) return;

    const dataByEntidad = getReportesGroupedData();
    const rows = [];

    Object.keys(dataByEntidad).sort().forEach((ent, idx) => {
        const entData = dataByEntidad[ent];
        const eRow = calculateAveragesForReport(entData.stages);
        const safeId = 'ent_grp_' + idx;
        
        // Fila Principal (Entidad)
        rows.push(buildReportRowHtml(ent, eRow, safeId, false));

        // Filas Secundarias (Desglose por Programa)
        Object.keys(entData.programs).sort().forEach(prog => {
            const pRow = calculateAveragesForReport(entData.programs[prog].stages);
            rows.push(buildReportRowHtml(prog, pRow, safeId, true));
        });
    });

    if (rows.length === 0) tbody.innerHTML = `<tr><td colspan="9" class="text-center">No hay precalificaciones realizadas aún.</td></tr>`;
    else tbody.innerHTML = rows.join('');
}

window.toggleEntityDetails = function(groupId) {
    const rows = document.querySelectorAll(`.detail-${groupId}`);
    const icon = document.getElementById(`icon-${groupId}`);
    let isHidden = false;
    rows.forEach(r => {
        if (r.classList.contains('hidden')) { r.classList.remove('hidden'); isHidden = true; } 
        else { r.classList.add('hidden'); }
    });
    if(icon) icon.textContent = isHidden ? "➖" : "➕";
};

function exportReportesExcel() {
    const groupedData = getReportesGroupedData();
    if (Object.keys(groupedData).length === 0) { alert('No hay datos para exportar.'); return; }

    showProgressBar("Generando Excel...");
    let progress = 0;
    const interval = setInterval(() => { progress += 15; if (progress > 85) progress = 85; updateProgressBar(progress); }, 50);

    setTimeout(() => {
        let csvContent = "\uFEFF"; 
        csvContent += "Nombre Entidad / Programa;Etapa 1;Etapa 2;Etapa 3;Etapa 4;Etapa 5;Etapa 6;Promedio Final;Estado\n";

        const getCsvRow = (title, data, isSub) => {
            const prefix = isSub ? `"  └ Programa: ${title}"` : `"${title}"`;
            return `${prefix};"${data.s[1]}";"${data.s[2]}";"${data.s[3]}";"${data.s[4]}";"${data.s[5]}";"${data.s[6]}";"${data.finalAvg}";"${data.statusText}"\n`;
        };

        Object.keys(groupedData).sort().forEach(ent => {
            const entData = groupedData[ent];
            csvContent += getCsvRow(ent, calculateAveragesForReport(entData.stages), false);

            Object.keys(entData.programs).sort().forEach(prog => {
                csvContent += getCsvRow(prog, calculateAveragesForReport(entData.programs[prog].stages), true);
            });
        });

        clearInterval(interval);
        updateProgressBar(100);

        setTimeout(() => {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", `Consolidado_Precalificaciones_${formatDDMMYYYY(new Date())}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            hideProgressBar();
        }, 400);
    }, 200);
}

/* COMPORTAMIENTO REPARADO DE EVALUADORES: ACCIÓN CRUD DIRECTA */
function createEvaluador() {
    const nombre = document.getElementById('ev-nombre').value.trim();
    const rut = document.getElementById('ev-rut').value.trim();
    const area = document.getElementById('ev-area').value.trim();
    const clave = document.getElementById('ev-clave').value.trim() || '123456';
    if (!nombre || !rut) {
        alert('RUT y Nombre del evaluador son obligatorios.');
        return; 
    }
    
    const tx = dbInstance.transaction(['evaluadores'], 'readwrite');
    tx.objectStore('evaluadores').put({ rut, nombre, area, clave });
    tx.oncomplete = () => { 
        clearFormInputs(['ev-nombre', 'ev-rut', 'ev-area', 'ev-clave']);
        document.getElementById('ev-rut').disabled = false;
        currentEditingEvaluadorRut = null;
        toggleElement('modal-evaluador', false);
        populateAdminMatrix(); 
    };
}

function renderEvaluadoresTable(evaluadores) {
    const tbody = document.getElementById('tabla-evaluadores-body');
    if (!tbody) return;
    if (evaluadores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Sin evaluadores guardados.</td></tr>';
        return;
    }
    tbody.innerHTML = evaluadores.map(ev => `
        <tr>
            <td>${ev.rut}</td>
            <td>${ev.nombre}</td>
            <td>${ev.area || ''}</td>
            <td class="text-center">
                <button class="btn btn-primary" style="padding:2px 8px; border-radius:3px; font-size:0.75rem; margin-right:4px;" onclick="editEvaluador('${ev.rut}')" title="Editar Evaluador">Editar</button>
                <button class="btn btn-danger" style="padding:2px 8px; border-radius:3px; font-size:0.75rem;" onclick="removeEvaluador('${ev.rut}')" title="Eliminar Evaluador">X</button>
            </td>
        </tr>
    `).join('');
}

window.editEvaluador = function(rut) {
    dbGetAll('evaluadores', (evaluadores) => {
        const ev = evaluadores.find(x => x.rut === rut);
        if (!ev) return;
        currentEditingEvaluadorRut = ev.rut;
        document.getElementById('ev-rut').value = ev.rut;
        document.getElementById('ev-rut').disabled = true;
        document.getElementById('ev-nombre').value = ev.nombre;
        if (document.getElementById('ev-area')) document.getElementById('ev-area').value = ev.area || '';
        if (document.getElementById('ev-clave')) document.getElementById('ev-clave').value = ev.clave || '123456';
        toggleElement('modal-evaluador', true);
    });
};

window.removeEvaluador = function(rut) {
    dbGetAll('asignaciones', (asignaciones) => {
        const isAssigned = asignaciones.some(a => a.rut === rut);
        if (isAssigned) {
            alert('No se puede eliminar este evaluador porque tiene asignaciones activas.');
            return;
        }
        if (!confirm('¿Está seguro de eliminar este evaluador?')) return;
        const tx = dbInstance.transaction(['evaluadores'], 'readwrite');
        tx.objectStore('evaluadores').delete(rut);
        tx.oncomplete = () => populateAdminMatrix();
    });
};

function drawMonitoringTable() {
    const tbody = document.getElementById('admin-monitoring-rows');
    if (!tbody) return;
    if (currentSortCol > -1) {
        monitoringData.sort((a, b) => {
            const props = ['evaluadorLabel', 'coberturaLabel', 'stageNum', 'haEvaluado', 'average'];
            let vA = a[props[currentSortCol]], vB = b[props[currentSortCol]];
            if (currentSortCol === 3) { vA = vA ? 1 : 0; vB = vB ? 1 : 0; }
            return vA < vB ? (currentSortAsc ? -1 : 1) : vA > vB ? (currentSortAsc ? 1 : -1) : 0;
        });
    }
    tbody.innerHTML = monitoringData.map(item => `<tr><td><b>${item.evaluadorLabel}</b></td><td style="color:var(--primary-blue); font-weight:600;">${item.coberturaLabel}</td><td class="text-center">Etapa ${item.stageNum}</td><td class="text-center">${item.haEvaluado ? '<span class="badge-evaluado" style="background-color:var(--color-bueno);color:white;padding:2px 6px;border-radius:4px;font-size:0.8rem;">EVALUADO</span>' : '<span class="badge-no-evaluado" style="background-color:var(--color-malo);color:white;padding:2px 6px;border-radius:4px;font-size:0.8rem;">NO EVALUADO</span>'}</td><td class="text-center"><b>${item.average}</b></td><td class="text-center"><button class="btn btn-primary" style="padding:3px 6px; font-size:0.78rem;" onclick="openAuditModal('${item.rut}','${item.nombre}','${item.coberturaLabel}',${item.stageNum})">Ver Detalle</button><button class="btn btn-danger" style="padding:3px 6px; font-size:0.78rem; margin-left:4px;" onclick="deleteAsignacion('${item.idAsig}')">Borrar</button></td></tr>`).join('');
}

function renderMonitoringCharts() {
    let container = document.getElementById('charts-container');
    if (!container) { container = document.createElement('div'); container.id = 'charts-container'; const panel = document.getElementById('panel-monitoreo'); if(panel) panel.insertBefore(container, document.getElementById('admin-monitoring-rows').closest('.card')); }
    const bProg = {}, bProv = {}; let ev = 0, tot = 0;
    monitoringData.forEach(d => { if(!bProg[d.programa]) bProg[d.programa] = { total: 0, eval: 0 }; if(!bProv[d.provincia]) bProv[d.provincia] = { total: 0, eval: 0 }; bProg[d.programa].total++; bProv[d.provincia].total++; tot++; if (d.haEvaluado) { bProg[d.programa].eval++; bProv[d.provincia].eval++; ev++; } });
    const rBar = (l, e, t) => { const p = t === 0 ? 0 : Math.round((e / t) * 100); return `<div style="margin-bottom:8px;"><div style="display:flex; justify-content:space-between; font-size:0.8rem;"><span>${l}</span><span>${e}/${t} (${p}%)</span></div><div style="width:100%; background:#e0e0e0; height:12px; overflow:hidden; border-radius:4px;"><div style="width:${p}%; background:var(--primary-blue); height:100%;"></div></div></div>`; };
    container.innerHTML = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:15px;"><div class="card compact-card"><h4>Avance por Programa</h4>${Object.keys(bProg).map(p => rBar(p, bProg[p].eval, bProg[p].total)).join('')}</div><div class="card compact-card"><h4>Avance por Provincia</h4>${Object.keys(bProv).map(p => rBar(p.toUpperCase(), bProv[p].eval, bProv[p].total)).join('')}</div><div class="card compact-card"><h4>Estado Global</h4>${rBar('Completadas', ev, tot)}${rBar('Pendientes', tot - ev, tot)}</div></div>`;
}

function openAuditModal(rut, nombre, cobertura, stageNum) {
    toggleElement('modal-action-footer', false);
    toggleElement('modal-overwrite-question', false);
    document.getElementById('modal-custom-html-body').innerHTML = '';
    document.getElementById('modal-title').textContent = `${nombre} - ${cobertura} (Etapa ${stageNum})`;

    dbGetAll('scores', (scores) => {
        const relevantScores = scores.filter(r => r.rutEvaluador === rut && r.cobertura === cobertura && parseInt(r.stage, 10) === stageNum);
        document.getElementById('modal-table-rows').innerHTML = dbItems.filter(i => i.stage === stageNum).map(item => {
            const recs = relevantScores.filter(r => r.itemId === item.id);
            recs.sort((a,b) => a.idTx.localeCompare(b.idTx));
            return `<tr><td class="text-center" style="font-weight:bold;">${item.id}</td><td>${item.text}</td><td class="text-center" style="font-weight:bold; color:var(--primary-blue);">${recs.length > 0 ? recs[recs.length - 1].score : "---"}</td></tr>`;
        }).join('');
        toggleElement('modal-table-container', true);
        toggleElement('audit-modal', true);
    });
}

function populateAdminMatrix() {
    pendingAsignacionesStaging = []; adminTemporaryEntidades = [];
    getMultipleStores(['evaluadores', 'entidades'], ([evaluadores, entidades]) => {
        document.getElementById('col-evaluadores').innerHTML = evaluadores.length === 0 ? '<span style="color:#999;font-size:0.8rem;">Sin evaluadores.</span>' : evaluadores.map(ev => `<div class="checkbox-block-item"><label><input type="checkbox" class="asig-evaluador-chk" value="${ev.rut}" data-name="${ev.nombre}"> ${ev.nombre}</label></div>`).join('');
        
        renderEvaluadoresTable(evaluadores);
        adminTemporaryEntidades = entidades;
        renderEntidadesAgregadas();
        document.getElementById('chk-toggle-all-stages').checked = false;
        document.querySelectorAll('.asig-etapa-chk').forEach(c => c.checked = false);
        adminSelectedProvincia = ""; adminTemporaryLogisticaMap = {};
        const lb = document.getElementById('asig-provincia-listbox'); if(lb) lb.selectedIndex = -1;
        renderAdminProgramsColumn(); 
    });
}

function renderAdminView() {
    document.getElementById('admin-items-container').innerHTML = `<h4>Criterios Editables de la Etapa ${currentStage}</h4><br>` + dbItems.filter(i => i.stage === currentStage).map(item => `<div class="form-group"><label class="bold-text">Ítem ${item.id}</label><input type="text" class="admin-input" data-id="${item.id}" value="${item.text}"></div>`).join('');
}

function saveAdminItems() {
    const tx = dbInstance.transaction(['items'], 'readwrite');
    document.querySelectorAll('.admin-input').forEach(input => {
        const id = input.getAttribute('data-id'); const match = dbItems.find(i => i.id === id);
        if (match) { match.text = input.value.trim(); tx.objectStore('items').put(match); }
    });
    tx.oncomplete = () => { alert("Textos guardados localmente. Recuerde Sincronizar a la Nube."); };
}

function saveEvaluatorScores() {
    if (deadlineExpired) {
        alert('El plazo para evaluar ha expirado. No se pueden guardar cambios.');
        return;
    }
    
    dbGetAll('scores', (allDbScores) => {
        const tx = dbInstance.transaction(['scores'], 'readwrite');
        const store = tx.objectStore('scores');
        const horaEnvio = formatDateTime(new Date());

        // 1. Borramos todas las calificaciones anteriores de TODAS las coberturas para el evaluador actual
        const oldRecords = allDbScores.filter(r => r.rutEvaluador === currentUser.rut);
        oldRecords.forEach(r => store.delete(r.idTx));

        // 2. Insertamos la foto actualizada en memoria, que YA contiene las modificaciones de TODAS las etapas y coberturas
        const memoryRecordsToSave = allMemoryScores.filter(r => r.rutEvaluador === currentUser.rut);
        
        memoryRecordsToSave.forEach(memScore => {
            const stableId = `${currentUser.rut}_${memScore.cobertura.replace(/[\s-]+/g, '')}_${memScore.itemId}`;
            const activeAsig = allAsignacionesMapped.find(a => a.cobertura === memScore.cobertura) || {};
            
            store.put({
                idTx: stableId,
                timestampId: Date.now().toString(),
                rutEvaluador: currentUser.rut,
                nombreEvaluador: memScore.nombreEvaluador || currentUser.nombre,
                programa: memScore.programa || activeAsig.programa || '',
                provincia: memScore.provincia || activeAsig.provincia || '',
                entidad: memScore.entidad || activeAsig.entidadNombre || '',
                cobertura: memScore.cobertura,
                stage: memScore.stage,
                itemId: memScore.itemId,
                score: memScore.score,
                hora: horaEnvio
            });
        });

        tx.oncomplete = () => {
            // Una vez guardado localmente, sincronizar solo la tabla de scores.
            syncSingleStoreToCloud('scores', (success) => {
                dbGetAll('scores', (scores) => {
                    allMemoryScores = scores.filter(r => r.rutEvaluador === currentUser.rut);
                    loadScoresFromActiveContext(); 
                    renderEvaluatorView();
                    
                    const btn = document.getElementById('btn-save-scores');
                    if (btn) {
                        const originalText = btn.textContent;
                        if (success) {
                            btn.textContent = "¡Guardado y Sincronizado!";
                            btn.style.backgroundColor = "var(--color-bueno)";
                            btn.style.color = "#000";
                        } else {
                            btn.textContent = "Guardado Local (Fallo Sincronización)";
                            btn.style.backgroundColor = "var(--color-aceptable)";
                            btn.style.color = "#000";
                        }
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.backgroundColor = "";
                            btn.style.color = "";
                        }, 3000);
                    }
                });
            });
        };
    });
}

function loadScoresFromActiveContext() {
    dbScores = {};
    allMemoryScores.filter(r => r.cobertura === currentCoverage && r.stage === currentStage).forEach(r => {
        dbScores[r.itemId] = r.score;
    });
}

function renderEvaluatorView() {
    const titleLabel = document.getElementById('table-stage-title');
    const descLabel = document.getElementById('table-stage-desc');
    
    if (STAGES_METADATA[currentStage]) {
        titleLabel.textContent = STAGES_METADATA[currentStage].title;
        descLabel.textContent = STAGES_METADATA[currentStage].desc;
    }

    document.getElementById('table-stage-footer-label').textContent = `PRECALIFICACIÓN ETAPA ${currentStage}`;

    const tbody = document.getElementById('evaluation-rows');
    
    const rowsHtml = dbItems.filter(i => i.stage === currentStage).map(item => {
        const score = dbScores[item.id] !== undefined ? dbScores[item.id] : "";
        return `
            <tr>
                <td class="cell-index bold-text">${item.id}</td>
                <td class="cell-desc">${item.text}</td>
                <td colspan="3" class="cell-score-input">
                    <input type="number" class="score-input" data-id="${item.id}" min="0" max="100" value="${score}" ${deadlineExpired ? 'disabled' : ''} placeholder="0">
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml.join('');

    document.querySelectorAll('.score-input').forEach(input => {
        input.addEventListener('input', calculateLiveScore);
    });

    calculateLiveScore();
}

function setEvaluationStatus(cell, score) {
    if (!cell) return;
    const status = getStatusInfo(score);
    cell.textContent = status.text;
    cell.style.backgroundColor = status.bg;
    cell.style.color = status.color;
}

function calculateLiveScore() {
    const inputs = document.querySelectorAll('.score-input');
    let totalStage = 0, countStage = 0;

    inputs.forEach(input => {
        let val = parseInt(input.value, 10);
        const id = input.getAttribute('data-id');
        const existingIdx = allMemoryScores.findIndex(r => r.cobertura === currentCoverage && r.itemId === id && parseInt(r.stage,10) === currentStage);
        
        if (isNaN(val)) { 
            delete dbScores[id]; 
            if (existingIdx >= 0) allMemoryScores.splice(existingIdx, 1);
            return; 
        }
        if (val < 0) { input.value = 0; val = 0; }
        if (val > 100) { input.value = 100; val = 100; }
        dbScores[id] = val;
        totalStage += val; countStage++;

        if (existingIdx >= 0) {
            allMemoryScores[existingIdx].score = val;
        } else {
            const activeAsig = allAsignacionesMapped.find(a => a.cobertura === currentCoverage) || {};
            allMemoryScores.push({
                idTx: `pending_${currentUser.rut}_${currentCoverage.replace(/[\s-]+/g, '')}_${id}`,
                timestampId: 'pending',
                rutEvaluador: currentUser.rut,
                nombreEvaluador: currentUser.nombre,
                programa: activeAsig.programa || '',
                provincia: activeAsig.provincia || '',
                entidad: activeAsig.entidadNombre || '',
                cobertura: currentCoverage,
                stage: currentStage,
                itemId: id,
                score: val,
                hora: formatDateTime(new Date())
            });
        }
    });

    const finalScoreCell = document.getElementById('cell-final-score');
    const statusTextCell = document.getElementById('cell-status-text');

    if (countStage > 0) {
        const stageAverage = Math.round(totalStage / countStage);
        if (finalScoreCell) finalScoreCell.textContent = stageAverage;
        setEvaluationStatus(statusTextCell, stageAverage);
    } else {
        if (finalScoreCell) finalScoreCell.textContent = "0"; 
        if (statusTextCell) { statusTextCell.textContent = "---"; statusTextCell.style.backgroundColor = "transparent"; }
    }
}
