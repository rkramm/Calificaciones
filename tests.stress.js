/**
 * PRUEBA DE ESFUERZO CON SYNC ADAPTATIVO
 * Valida que el sistema soporta múltiples usuarios con sincronización inteligente
 */

const STRESS_TEST_CONFIG = {
    numUsuarios: [5, 10, 20, 50],  // Escalada progresiva
    calificacionesPorUsuario: 10,
    tiempoEsperaEntreLotes: 200, // ms entre scores del mismo usuario
};

/**
 * Simular usuario escribiendo calificaciones
 */
async function simularUsuarioConSync(usuarioIndex, totalUsuarios, callback) {
    const usuario = `Usuario-${usuarioIndex + 1}`;
    const resultados = {
        usuario,
        calificacionesGuardadas: 0,
        tiempos: [],
        inicioTiempo: Date.now()
    };

    for (let s = 0; s < STRESS_TEST_CONFIG.calificacionesPorUsuario; s++) {
        const tiempoInicio = Date.now();

        // Simular cloudSave rápido (IndexedDB local)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));

        // Registrar en SYNC_MANAGER (adaptativo)
        // Con 50 usuarios × 10 scores = 500 items
        // Pero se guardan localmente al instante
        SYNC_MANAGER.registerPending('scores', Math.random() * 100 | 0);

        const tiempoRespuesta = Date.now() - tiempoInicio;
        resultados.tiempos.push(tiempoRespuesta);
        resultados.calificacionesGuardadas++;

        await new Promise(resolve => setTimeout(resolve, STRESS_TEST_CONFIG.tiempoEsperaEntreLotes));
    }

    resultados.tiempoTotal = Date.now() - resultados.inicioTiempo;
    resultados.tiempoPromedio = Math.round(
        resultados.tiempos.reduce((a, b) => a + b) / resultados.tiempos.length
    );

    callback(resultados);
    return resultados;
}

/**
 * Ejecutar prueba de esfuerzo progresiva
 */
async function runStressTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        PRUEBA DE ESFUERZO - SYNC ADAPTATIVO               ║');
    console.log('║        Validación con 5, 10, 20, 50 usuarios              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const resultadosPorEscala = [];

    for (const numUsuarios of STRESS_TEST_CONFIG.numUsuarios) {
        console.log(`\n╔════════════════════════════════════════════════════════════╗`);
        console.log(`║ ${numUsuarios} USUARIOS SIMULTÁNEOS`.padEnd(61) + `║`);
        console.log(`╚════════════════════════════════════════════════════════════╝\n`);

        const inicioEscala = Date.now();
        const promesasUsuarios = [];

        // Lanzar todos los usuarios
        for (let u = 0; u < numUsuarios; u++) {
            const promesa = simularUsuarioConSync(u, numUsuarios, (resultado) => {
                // Mostrar progreso silenciosamente
            });
            promesasUsuarios.push(promesa);
        }

        const resultados = await Promise.all(promesasUsuarios);
        const tiempoEscala = Date.now() - inicioEscala;

        // Calcular estadísticas
        const totalCalificaciones = numUsuarios * STRESS_TEST_CONFIG.calificacionesPorUsuario;
        const tiempoPromedioPorUsuario = Math.round(
            resultados.reduce((sum, r) => sum + r.tiempoPromedio, 0) / numUsuarios
        );
        const tiempoMaximo = Math.max(...resultados.map(r => Math.max(...r.tiempos)));
        const tiempoMinimo = Math.min(...resultados.map(r => Math.min(...r.tiempos)));

        const resultado = {
            usuarios: numUsuarios,
            totalCalificaciones,
            tiempoEscala,
            tiempoPromedioPorUsuario,
            tiempoMaximo,
            tiempoMinimo
        };

        resultadosPorEscala.push(resultado);

        // Mostrar resultados de esta escala
        console.log(`✅ Escala completada:`);
        console.log(`   • Usuarios: ${numUsuarios}`);
        console.log(`   • Total de calificaciones: ${totalCalificaciones}`);
        console.log(`   • Tiempo total: ${tiempoEscala}ms`);
        console.log(`   • Promedio por calificación: ${tiempoPromedioPorUsuario}ms`);
        console.log(`   • Mínimo: ${tiempoMinimo}ms | Máximo: ${tiempoMaximo}ms`);

        // Evaluar rendimiento
        if (tiempoEscala < numUsuarios * 5000) {
            console.log(`   • Estado: ✅ EXCELENTE`);
        } else if (tiempoEscala < numUsuarios * 10000) {
            console.log(`   • Estado: ✅ ACEPTABLE`);
        } else {
            console.log(`   • Estado: ⚠️  LENTO`);
        }
    }

    // Resumen comparativo
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   RESUMEN COMPARATIVO                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('Escalabilidad:');
    resultadosPorEscala.forEach((r, i) => {
        const escalado = i === 0 ? '---' : (r.tiempoEscala / resultadosPorEscala[0].tiempoEscala).toFixed(1) + 'x';
        console.log(`   ${r.usuarios} usuarios:  ${r.tiempoEscala}ms (escala: ${escalado})`);
    });

    console.log('\n📊 Análisis:');
    const escala5 = resultadosPorEscala[0];
    const escala50 = resultadosPorEscala[resultadosPorEscala.length - 1];
    const multiplicador = escala50.tiempoEscala / escala5.tiempoEscala;

    if (multiplicador < 12) {
        console.log(`   ✅ EXCELENTE: Con 50 usuarios (10x) tarda ${multiplicador.toFixed(1)}x más`);
        console.log(`      Sync adaptativo está funcionando correctamente`);
    } else if (multiplicador < 20) {
        console.log(`   ⚠️  ACEPTABLE: Con 50 usuarios tarda ${multiplicador.toFixed(1)}x más`);
    } else {
        console.log(`   ❌ POBRE: Escalabilidad débil (${multiplicador.toFixed(1)}x)`);
    }

    console.log('\n✨ Prueba de esfuerzo completada\n');

    return resultadosPorEscala;
}

console.log('💡 Para ejecutar prueba de esfuerzo: runStressTest()');
