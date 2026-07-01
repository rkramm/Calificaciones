/**
 * PRUEBAS DE CARGA - 5 Usuarios Simultáneos
 * Simula 5 evaluadores ingresando calificaciones simultáneamente y guardando en Google Sheets
 * Detecta problemas de conexión, conflictos de versión, tiempos de respuesta
 */

// Configuración de prueba
const LOAD_TEST_CONFIG = {
    numUsuarios: 5,
    calificacionesPorUsuario: 10,
    tiempoEsperaEntreLotes: 500, // ms
    timeoutPorPeticion: 15000, // 15 segundos
};

// Usuarios simulados
const USUARIOS_PRUEBA = [
    { rut: '12345678-0', nombre: 'Usuario Test 1', email: 'test1@test.com' },
    { rut: '12345679-1', nombre: 'Usuario Test 2', email: 'test2@test.com' },
    { rut: '12345680-2', nombre: 'Usuario Test 3', email: 'test3@test.com' },
    { rut: '12345681-3', nombre: 'Usuario Test 4', email: 'test4@test.com' },
    { rut: '12345682-4', nombre: 'Usuario Test 5', email: 'test5@test.com' },
];

// Programa y entidades para pruebas
const PROGRAMAS_PRUEBA = ['DS10', 'DS27', 'DS49'];
const ENTIDADES_PRUEBA = [
    { rut: '78879980-2', nombre: 'MUNICIPALIDAD DE PALENA' },
    { rut: '78879981-3', nombre: 'AGENCIA DE SERVICIOS' },
];

/**
 * Genera una calificación simulada
 */
function generarCalificacionPrueba(usuarioIndex, calificacionIndex, entityIndex) {
    const programa = PROGRAMAS_PRUEBA[calificacionIndex % PROGRAMAS_PRUEBA.length];
    const entidad = ENTIDADES_PRUEBA[entityIndex % ENTIDADES_PRUEBA.length];
    const stage = (calificacionIndex % 6) + 1;
    const score = Math.floor(Math.random() * 5) + 1; // 1-5

    return {
        idTx: `TX-${usuarioIndex}-${calificacionIndex}-${Date.now()}`,
        rutEvaluador: USUARIOS_PRUEBA[usuarioIndex].rut,
        nombreEvaluador: USUARIOS_PRUEBA[usuarioIndex].nombre,
        entityRut: entidad.rut,
        entityNombre: entidad.nombre,
        programa: programa,
        stage: stage.toString(),
        itemId: `${stage}.${(calificacionIndex % 9) + 1}`,
        score: score.toString(),
        comentario: `Test score ${score} para ${entidad.nombre}`,
        hora: new Date().toISOString(),
        modificado: true
    };
}

/**
 * Simula un usuario guardando datos
 */
async function simularUsuario(usuarioIndex, callback) {
    const usuario = USUARIOS_PRUEBA[usuarioIndex];
    const resultados = {
        usuario: usuario.nombre,
        rutEvaluador: usuario.rut,
        calificacionesIntentadas: 0,
        calificacionesExitosas: 0,
        calificacionesFallidas: 0,
        conflictosDeVersion: 0,
        tiemposRespuesta: [],
        errores: [],
        inicioTiempo: Date.now()
    };

    console.log(`🚀 [Usuario ${usuarioIndex + 1}] Iniciando prueba para ${usuario.nombre}`);

    // Generar y enviar calificaciones
    for (let i = 0; i < LOAD_TEST_CONFIG.calificacionesPorUsuario; i++) {
        const calificacion = generarCalificacionPrueba(usuarioIndex, i, usuarioIndex % ENTIDADES_PRUEBA.length);
        resultados.calificacionesIntentadas++;

        const tiempoInicio = Date.now();

        try {
            // Intentar guardar usando cloudSave (similar a lo que hace la app)
            const respuesta = await Promise.race([
                cloudSave('scores', [calificacion]),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('TIMEOUT')), LOAD_TEST_CONFIG.timeoutPorPeticion)
                )
            ]);

            const tiempoRespuesta = Date.now() - tiempoInicio;
            resultados.tiemposRespuesta.push(tiempoRespuesta);

            if (respuesta?.success) {
                resultados.calificacionesExitosas++;
                console.log(`✅ [Usuario ${usuarioIndex + 1}] Calificación ${i + 1}/${LOAD_TEST_CONFIG.calificacionesPorUsuario} guardada (${tiempoRespuesta}ms)`);
            } else if (respuesta?.versionConflict) {
                resultados.conflictosDeVersion++;
                console.warn(`⚠️  [Usuario ${usuarioIndex + 1}] Conflicto de versión en calificación ${i + 1}`);
                resultados.errores.push(`Conflicto versión en score ${i + 1}`);
            } else {
                resultados.calificacionesFallidas++;
                console.error(`❌ [Usuario ${usuarioIndex + 1}] Error guardando calificación ${i + 1}: ${respuesta?.error}`);
                resultados.errores.push(`${respuesta?.error || 'Error desconocido'}`);
            }
        } catch (error) {
            resultados.calificacionesFallidas++;
            console.error(`❌ [Usuario ${usuarioIndex + 1}] Excepción en calificación ${i + 1}:`, error.message);
            resultados.errores.push(error.message);
        }

        // Pequeña pausa entre peticiones del mismo usuario
        await new Promise(resolve => setTimeout(resolve, LOAD_TEST_CONFIG.tiempoEsperaEntreLotes));
    }

    resultados.tiempoTotal = Date.now() - resultados.inicioTiempo;
    resultados.tiempoPromedio = resultados.tiemposRespuesta.length > 0
        ? Math.round(resultados.tiemposRespuesta.reduce((a, b) => a + b) / resultados.tiemposRespuesta.length)
        : 0;

    callback(resultados);
    return resultados;
}

/**
 * Ejecutar prueba de carga completa
 */
async function runLoadTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        PRUEBA DE CARGA - 5 USUARIOS SIMULTÁNEOS            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Configuración:`);
    console.log(`   • Usuarios simultáneos: ${LOAD_TEST_CONFIG.numUsuarios}`);
    console.log(`   • Calificaciones por usuario: ${LOAD_TEST_CONFIG.calificacionesPorUsuario}`);
    console.log(`   • Total de peticiones: ${LOAD_TEST_CONFIG.numUsuarios * LOAD_TEST_CONFIG.calificacionesPorUsuario}`);
    console.log(`   • Timeout por petición: ${LOAD_TEST_CONFIG.timeoutPorPeticion}ms\n`);

    const inicioTotal = Date.now();
    const promesasUsuarios = [];

    // Iniciar todos los usuarios simultáneamente
    for (let i = 0; i < LOAD_TEST_CONFIG.numUsuarios; i++) {
        const promesa = simularUsuario(i, (resultado) => {
            console.log(`\n📋 Resultado Usuario ${i + 1}:`);
            console.log(`   Exitosas: ${resultado.calificacionesExitosas}/${resultado.calificacionesIntentadas}`);
            console.log(`   Fallidas: ${resultado.calificacionesFallidas}`);
            console.log(`   Conflictos versión: ${resultado.conflictosDeVersion}`);
            console.log(`   Tiempo promedio: ${resultado.tiempoPromedio}ms`);
            console.log(`   Tiempo total: ${resultado.tiempoTotal}ms`);
            if (resultado.errores.length > 0) {
                console.log(`   Errores: ${resultado.errores.join(', ')}`);
            }
        });
        promesasUsuarios.push(promesa);
    }

    // Esperar a que todos los usuarios terminen
    const resultados = await Promise.all(promesasUsuarios);
    const tiempoTotalPrueba = Date.now() - inicioTotal;

    // Generar reporte consolidado
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    REPORTE CONSOLIDADO                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const totalIntentadas = resultados.reduce((a, b) => a + b.calificacionesIntentadas, 0);
    const totalExitosas = resultados.reduce((a, b) => a + b.calificacionesExitosas, 0);
    const totalFallidas = resultados.reduce((a, b) => a + b.calificacionesFallidas, 0);
    const totalConflictos = resultados.reduce((a, b) => a + b.conflictosDeVersion, 0);
    const tasaExito = Math.round((totalExitosas / totalIntentadas) * 100);

    console.log(`✅ Calificaciones exitosas: ${totalExitosas}/${totalIntentadas} (${tasaExito}%)`);
    console.log(`❌ Calificaciones fallidas: ${totalFallidas}`);
    console.log(`⚠️  Conflictos de versión: ${totalConflictos}`);
    console.log(`⏱️  Tiempo total de prueba: ${tiempoTotalPrueba}ms (${(tiempoTotalPrueba / 1000).toFixed(2)}s)`);

    // Análisis de tiempos
    const todosTiempos = resultados.flatMap(r => r.tiemposRespuesta);
    if (todosTiempos.length > 0) {
        const tiempoMin = Math.min(...todosTiempos);
        const tiempoMax = Math.max(...todosTiempos);
        const tiempoPromedio = Math.round(todosTiempos.reduce((a, b) => a + b) / todosTiempos.length);
        console.log(`\n⏰ Análisis de tiempos de respuesta:`);
        console.log(`   • Mínimo: ${tiempoMin}ms`);
        console.log(`   • Máximo: ${tiempoMax}ms`);
        console.log(`   • Promedio: ${tiempoPromedio}ms`);
    }

    // Detectar problemas
    console.log(`\n🔍 Análisis de problemas:`);
    if (tasaExito < 80) {
        console.error(`   ⚠️  PROBLEMA DE CONEXIÓN: ${100 - tasaExito}% de fallos. Revisar Google Sheets.`);
    } else if (tasaExito < 100) {
        console.warn(`   ⚠️  FALLOS PARCIALES: ${100 - tasaExito}% de peticiones fallidas.`);
    } else {
        console.log(`   ✅ Conexión ESTABLE: 100% de éxito`);
    }

    if (totalConflictos > 0) {
        console.warn(`   ⚠️  CONFLICTOS DE VERSIÓN: ${totalConflictos} detecciones. Los datos están siendo actualizados concurrentemente.`);
    }

    // Errores únicos
    const erroresUnicos = [...new Set(resultados.flatMap(r => r.errores))];
    if (erroresUnicos.length > 0) {
        console.log(`   \n   Errores encontrados:`);
        erroresUnicos.forEach(error => console.log(`      • ${error}`));
    }

    console.log('\n✨ Prueba completada\n');

    return {
        config: LOAD_TEST_CONFIG,
        resumenPorUsuario: resultados,
        consolidado: {
            totalIntentadas,
            totalExitosas,
            totalFallidas,
            totalConflictos,
            tasaExito,
            tiempoTotalPrueba
        }
    };
}

// Ejecutar desde consola: runLoadTest()
console.log('💡 Para ejecutar la prueba, escribe en consola: runLoadTest()');
