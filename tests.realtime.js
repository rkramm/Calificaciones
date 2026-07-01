/**
 * PRUEBA REALTIME - 5 Usuarios escribiendo en Google Sheets
 * Con desfases aleatorios de 1-3 segundos
 * Monitorea escrituras reales en el sheet
 */

const REALTIME_TEST_CONFIG = {
    numUsuarios: 5,
    calificacionesPorUsuario: 5,
    desfaseMin: 1000,    // 1 segundo
    desfaseMax: 3000,    // 3 segundos
};

/**
 * Genera una calificación realista
 */
function generarCalificacionRealista(usuarioIndex, calificacionIndex) {
    return {
        idTx: `TX-REALTIME-${usuarioIndex}-${calificacionIndex}-${Date.now()}`,
        rutEvaluador: `1234567${usuarioIndex}-${usuarioIndex}`,
        nombreEvaluador: `Usuario Real ${usuarioIndex + 1}`,
        entityRut: `78879980-${usuarioIndex}`,
        entityNombre: `ENTIDAD TEST ${usuarioIndex + 1}`,
        programa: ['DS10', 'DS27', 'DS49'][calificacionIndex % 3],
        stage: ((calificacionIndex % 6) + 1).toString(),
        itemId: `${(calificacionIndex % 6) + 1}.${calificacionIndex + 1}`,
        score: (Math.floor(Math.random() * 5) + 1).toString(),
        comentario: `Score realtime test usuario ${usuarioIndex + 1}`,
        hora: new Date().toISOString(),
        modificado: true
    };
}

/**
 * Simular usuario escribiendo con desfase
 */
async function usuarioRealtimeConDesfase(usuarioIndex, callback) {
    const usuario = `Usuario Real ${usuarioIndex + 1}`;
    const desfaseAleatorio = Math.random() * (REALTIME_TEST_CONFIG.desfaseMax - REALTIME_TEST_CONFIG.desfaseMin) + REALTIME_TEST_CONFIG.desfaseMin;

    const resultados = {
        usuario,
        rutEvaluador: `1234567${usuarioIndex}-${usuarioIndex}`,
        calificacionesGuardadas: 0,
        calificacionesFallidas: 0,
        tiempos: [],
        desfaseAleatorio: Math.round(desfaseAleatorio),
        inicioTiempo: null,
        registros: []
    };

    // Esperar desfase aleatorio
    console.log(`⏳ [${usuario}] Esperando ${Math.round(desfaseAleatorio)}ms antes de empezar...`);
    await new Promise(resolve => setTimeout(resolve, desfaseAleatorio));

    resultados.inicioTiempo = Date.now();

    for (let i = 0; i < REALTIME_TEST_CONFIG.calificacionesPorUsuario; i++) {
        const calificacion = generarCalificacionRealista(usuarioIndex, i);
        const tiempoInicio = Date.now();

        // Llamar a cloudSave REAL
        const response = await cloudSave('scores', [calificacion]);

        const tiempoRespuesta = Date.now() - tiempoInicio;
        resultados.tiempos.push(tiempoRespuesta);

        const registro = {
            timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
            idTx: calificacion.idTx,
            programa: calificacion.programa,
            stage: calificacion.stage,
            score: calificacion.score,
            tiempoMs: tiempoRespuesta,
            exitoso: response?.success ? '✅' : '❌',
            error: response?.error || response?.versionConflict ? 'Conflicto de versión' : 'OK'
        };

        resultados.registros.push(registro);

        if (response?.success) {
            resultados.calificacionesGuardadas++;
            console.log(`✅ [${usuario}] Score ${i + 1}/${REALTIME_TEST_CONFIG.calificacionesPorUsuario}: ${calificacion.programa} Etapa ${calificacion.stage} = ${calificacion.score} (${tiempoRespuesta}ms)`);
        } else {
            resultados.calificacionesFallidas++;
            console.log(`❌ [${usuario}] Score ${i + 1}/${REALTIME_TEST_CONFIG.calificacionesPorUsuario}: ERROR - ${response?.error || 'Conflicto de versión'} (${tiempoRespuesta}ms)`);
        }

        // Pequeña pausa entre calificaciones del mismo usuario
        if (i < REALTIME_TEST_CONFIG.calificacionesPorUsuario - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    resultados.tiempoTotal = Date.now() - resultados.inicioTiempo;
    resultados.tiempoPromedio = Math.round(
        resultados.tiempos.reduce((a, b) => a + b) / resultados.tiempos.length
    );

    callback(resultados);
    return resultados;
}

/**
 * Ejecutar prueba realtime
 */
async function runRealtimeTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     PRUEBA REALTIME - ESCRITURA EN GOOGLE SHEETS           ║');
    console.log('║     5 Usuarios con desfases aleatorios 1-3 segundos        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`⚠️  IMPORTANTE: Abre el Google Sheet en otra ventana ahora`);
    console.log(`    para monitorear las escrituras en tiempo real.\n`);

    console.log(`📊 Configuración:`);
    console.log(`   • Usuarios: ${REALTIME_TEST_CONFIG.numUsuarios}`);
    console.log(`   • Calificaciones por usuario: ${REALTIME_TEST_CONFIG.calificacionesPorUsuario}`);
    console.log(`   • Desfase aleatorio: ${REALTIME_TEST_CONFIG.desfaseMin}-${REALTIME_TEST_CONFIG.desfaseMax}ms`);
    console.log(`   • Total de peticiones: ${REALTIME_TEST_CONFIG.numUsuarios * REALTIME_TEST_CONFIG.calificacionesPorUsuario}\n`);

    // PASO 1: Descargar versión actual de la tabla scores
    console.log('⏳ Descargando versión actual de la tabla scores...');
    await cloudGet('scores');
    console.log('✅ Versión de scores sincronizada\n');

    const inicioTotal = Date.now();
    const promesasUsuarios = [];

    // Lanzar 5 usuarios simultáneamente (pero con desfase interno)
    for (let u = 0; u < REALTIME_TEST_CONFIG.numUsuarios; u++) {
        const promesa = usuarioRealtimeConDesfase(u, (resultado) => {
            // Callback para cada usuario
        });
        promesasUsuarios.push(promesa);
    }

    const resultados = await Promise.all(promesasUsuarios);
    const tiempoTotalPrueba = Date.now() - inicioTotal;

    // Resumen
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN DE RESULTADOS                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const totalGuardadas = resultados.reduce((sum, r) => sum + r.calificacionesGuardadas, 0);
    const totalFallidas = resultados.reduce((sum, r) => sum + r.calificacionesFallidas, 0);
    const totalIntentadas = totalGuardadas + totalFallidas;
    const tasaExito = Math.round((totalGuardadas / totalIntentadas) * 100);

    console.log(`✅ Calificaciones guardadas: ${totalGuardadas}/${totalIntentadas} (${tasaExito}%)`);
    console.log(`❌ Calificaciones fallidas: ${totalFallidas}`);
    console.log(`⏱️  Tiempo total de prueba: ${tiempoTotalPrueba}ms\n`);

    // Detalles por usuario
    console.log('📋 Resultados por Usuario:\n');
    resultados.forEach((r, idx) => {
        console.log(`[${idx + 1}] ${r.usuario}`);
        console.log(`    • RUT Evaluador: ${r.rutEvaluador}`);
        console.log(`    • Desfase inicial: ${r.desfaseAleatorio}ms`);
        console.log(`    • Guardadas: ${r.calificacionesGuardadas}/${REALTIME_TEST_CONFIG.calificacionesPorUsuario}`);
        console.log(`    • Tiempo promedio: ${r.tiempoPromedio}ms`);
        console.log(`    • Rango: ${Math.min(...r.tiempos)}ms - ${Math.max(...r.tiempos)}ms`);
        console.log('');
    });

    // Tabla de escrituras
    console.log('📝 TABLA DE ESCRITURAS EN TIEMPO REAL:\n');
    console.log('(Copia/compara con los datos en Google Sheets)\n');

    // Recolectar todos los registros en orden de timestamp
    const todosRegistros = [];
    resultados.forEach((usuario, idx) => {
        usuario.registros.forEach(reg => {
            todosRegistros.push({
                ...reg,
                usuario: `Usuario ${idx + 1}`
            });
        });
    });

    console.log('Usuario      │ Timestamp       │ Programa │ Etapa │ Score │ Tiempo │ Estado');
    console.log('─────────────┼─────────────────┼──────────┼───────┼───────┼────────┼─────────');

    todosRegistros.forEach(reg => {
        const usuario = reg.usuario.padEnd(11, ' ');
        const timestamp = reg.timestamp.padEnd(15, ' ');
        const programa = reg.programa.padEnd(8, ' ');
        const etapa = reg.stage.padEnd(5, ' ');
        const score = reg.score.padEnd(5, ' ');
        const tiempo = `${reg.tiempoMs}ms`.padEnd(6, ' ');
        const status = reg.exitoso;
        console.log(`${usuario} │ ${timestamp} │ ${programa} │ ${etapa} │ ${score} │ ${tiempo} │ ${status}`);
    });

    console.log('\n💡 INSTRUCCIONES PARA VERIFICAR:');
    console.log('1. Abre tu Google Sheet');
    console.log('2. Ve a la pestaña "scores"');
    console.log('3. Busca los registros con idTx que comienzan con "TX-REALTIME-"');
    console.log('4. Verifica que todos los campos coincidan (programa, stage, score, etc.)');
    console.log('5. Cuenta cuántos registros hay (debe haber ' + totalGuardadas + ')');
    console.log('6. Anota cualquier discrepancia\n');

    console.log('✨ Prueba realtime completada\n');

    return {
        totalGuardadas,
        totalFallidas,
        tasaExito,
        tiempoTotal: tiempoTotalPrueba,
        resultadosPorUsuario: resultados,
        registros: todosRegistros
    };
}

console.log('💡 Para ejecutar prueba realtime: runRealtimeTest()');
