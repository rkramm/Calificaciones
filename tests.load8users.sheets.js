/**
 * PRUEBA DE CARGA - 8 Usuarios Guardando en Google Sheets
 * Simula 8 usuarios intentando guardar calificaciones DIRECTAMENTE en Sheets
 * - Intenta cloudSave() real para cada usuario
 * - Registra cuántos logran guardar
 * - Registra cuántos fallan por conflicto de versión
 */

const LOAD_SHEETS_CONFIG = {
    numUsuarios: 8,
    scoresPerUser: 3, // Calificaciones por usuario para no sobrecargar
    programas: ['DS10', 'DS27', 'DS49']
};

/**
 * Genera una calificación para Google Sheets
 */
function generarCalificacionSheets(usuarioIndex, scoreIndex) {
    return {
        idTx: `SHEETS8-${usuarioIndex}-${scoreIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        rutEvaluador: `SHEETS-USER-${usuarioIndex}`,
        nombreEvaluador: `Usuario Sheets ${usuarioIndex}`,
        entityRut: `78879980-${usuarioIndex}`,
        entityNombre: `ENTIDAD SHEETS ${usuarioIndex}`,
        programa: LOAD_SHEETS_CONFIG.programas[scoreIndex % 3],
        stage: ((scoreIndex % 6) + 1).toString(),
        itemId: `${(scoreIndex % 6) + 1}.${scoreIndex + 1}`,
        score: (Math.floor(Math.random() * 5) + 1).toString(),
        comentario: `Score directo a Sheets usuario ${usuarioIndex}`,
        hora: new Date().toISOString(),
        modificado: true
    };
}

/**
 * Simula un usuario guardando directamente en Sheets
 * Con retraso escalonado para evitar que todos choquen
 */
async function usuarioGuardaEnSheets(usuarioIndex) {
    const userRut = `SHEETS-USER-${usuarioIndex}`;
    const resultado = {
        usuario: usuarioIndex,
        rut: userRut,
        scoresIntentados: 0,
        scoresExitosos: 0,
        scoresFallidos: 0,
        tiempoMs: 0,
        errores: [],
        retrasoBefore: 0
    };

    // Retraso escalonado: Usuario 1 empieza ya, Usuario 2 espera 500ms, Usuario 3 espera 1000ms, etc.
    const retrasoMs = (usuarioIndex - 1) * 500;
    resultado.retrasoBefore = retrasoMs;

    if (retrasoMs > 0) {
        console.log(`\n⏳ [Usuario ${usuarioIndex}] Esperando ${retrasoMs}ms antes de guardar (desfase escalonado)...`);
        await new Promise(resolve => setTimeout(resolve, retrasoMs));
    }

    console.log(`\n📤 [Usuario ${usuarioIndex}] Intentando guardar ${LOAD_SHEETS_CONFIG.scoresPerUser} scores en Sheets...`);

    const tiempoInicio = Date.now();

    // Generar y guardar calificaciones
    for (let s = 0; s < LOAD_SHEETS_CONFIG.scoresPerUser; s++) {
        const score = generarCalificacionSheets(usuarioIndex, s);
        resultado.scoresIntentados++;

        try {
            // Guardar DIRECTAMENTE en Google Sheets (cloudSave real)
            const response = await cloudSave('scores', [score], 'incremental');

            if (response?.success) {
                resultado.scoresExitosos++;
                console.log(`   ✅ Score ${s + 1}: Guardado en Sheets`);
            } else {
                resultado.scoresFallidos++;
                const error = response?.error || 'Error desconocido';
                resultado.errores.push(`Score ${s + 1}: ${error}`);
                console.log(`   ❌ Score ${s + 1}: ${error}`);
            }
        } catch (error) {
            resultado.scoresFallidos++;
            resultado.errores.push(`Score ${s + 1}: ${error.message}`);
            console.log(`   ❌ Score ${s + 1}: Error de conexión - ${error.message}`);
        }

        // Pequeña pausa entre scores
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    resultado.tiempoMs = Date.now() - tiempoInicio;

    console.log(`   📊 Resultado: ${resultado.scoresExitosos}/${resultado.scoresIntentados} guardados (${Math.round((resultado.scoresExitosos / resultado.scoresIntentados) * 100)}%)`);
    console.log(`   ⏱️  Tiempo: ${resultado.tiempoMs}ms`);

    return resultado;
}

/**
 * Test de carga con 8 usuarios guardando en Google Sheets
 */
async function runLoad8UsersSheetsTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   PRUEBA DE CARGA - 8 USUARIOS GUARDANDO EN SHEETS         ║');
    console.log('║   Intenta cloudSave() real para cada usuario               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Configuración:`);
    console.log(`   • Usuarios: ${LOAD_SHEETS_CONFIG.numUsuarios}`);
    console.log(`   • Scores por usuario: ${LOAD_SHEETS_CONFIG.scoresPerUser}`);
    console.log(`   • Total de scores: ${LOAD_SHEETS_CONFIG.numUsuarios * LOAD_SHEETS_CONFIG.scoresPerUser}`);
    console.log(`   • Tabla destino: "scores" en Google Sheets\n`);

    // PASO 1: Sincronizar versión del cliente con el servidor
    console.log(`⏳ Sincronizando versión del cliente con el servidor...`);
    try {
        await cloudGet('scores');
        console.log(`✅ Versión sincronizada\n`);
    } catch (error) {
        console.log(`⚠️  Error sincronizando versión: ${error.message}\n`);
    }

    console.log(`⏳ Iniciando guardado simultáneo de scores en Sheets...\n`);

    const resultados = {
        usuariosIntentados: LOAD_SHEETS_CONFIG.numUsuarios,
        totalScoresIntentados: 0,
        totalScoresExitosos: 0,
        totalScoresFallidos: 0,
        tiempoTotal: 0,
        detallesUsuarios: []
    };

    const tiempoInicio = Date.now();

    // Guardar para 8 usuarios (en paralelo para simular carga real)
    const promesas = [];
    for (let u = 1; u <= LOAD_SHEETS_CONFIG.numUsuarios; u++) {
        promesas.push(usuarioGuardaEnSheets(u));
    }

    const resultadosUsuarios = await Promise.all(promesas);

    resultados.tiempoTotal = Date.now() - tiempoInicio;

    // Compilar resultados
    resultadosUsuarios.forEach(r => {
        resultados.totalScoresIntentados += r.scoresIntentados;
        resultados.totalScoresExitosos += r.scoresExitosos;
        resultados.totalScoresFallidos += r.scoresFallidos;
        resultados.detallesUsuarios.push(r);
    });

    // Resumen
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN DE RESULTADOS                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Estadísticas Globales:`);
    console.log(`   • Usuarios: ${resultados.usuariosIntentados}`);
    console.log(`   • Total de scores intentados: ${resultados.totalScoresIntentados}`);
    console.log(`   • Total de scores guardados: ${resultados.totalScoresExitosos}`);
    console.log(`   • Total de scores fallidos: ${resultados.totalScoresFallidos}`);
    console.log(`   • Tasa de éxito: ${Math.round((resultados.totalScoresExitosos / resultados.totalScoresIntentados) * 100)}%`);
    console.log(`   • Tiempo total: ${resultados.tiempoTotal}ms\n`);

    console.log(`⚠️  Notas importantes:`);
    console.log(`   • Si muchos fallan: Google Sheets tiene límites de concurrencia`);
    console.log(`   • Conflictos de versión son normales con múltiples usuarios`);
    console.log(`   • Ver resultados por usuario abajo para más detalles\n`);

    // Tabla de detalles
    console.log('📝 TABLA DE USUARIOS:\n');
    console.log('Usuario │ Desfase │ Guardados │ Fallidos │ Tasa Éxito │ Tiempo');
    console.log('────────┼─────────┼───────────┼──────────┼────────────┼────────');

    resultados.detallesUsuarios.forEach(d => {
        const usuario = `${d.usuario}`.padEnd(6, ' ');
        const desfase = `${d.retrasoBefore}ms`.padEnd(7, ' ');
        const guardados = `${d.scoresExitosos}/${d.scoresIntentados}`.padEnd(9, ' ');
        const fallidos = d.scoresFallidos.toString().padEnd(8, ' ');
        const tasa = `${Math.round((d.scoresExitosos / d.scoresIntentados) * 100)}%`.padEnd(10, ' ');
        const tiempo = `${d.tiempoMs}ms`;
        console.log(`${usuario} │ ${desfase} │ ${guardados} │ ${fallidos} │ ${tasa} │ ${tiempo}`);

        if (d.errores.length > 0) {
            console.log(`         │ Errores: ${d.errores.join(', ')}`);
        }
    });

    console.log('\n✨ Prueba de carga en Sheets completada\n');

    return resultados;
}

console.log('💡 Para ejecutar test de 8 usuarios guardando en Sheets: runLoad8UsersSheetsTest()');
