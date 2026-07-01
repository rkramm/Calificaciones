/**
 * PRUEBA DE LÍMITE DE SESIONES
 * Verifica que máximo 6 usuarios pueden estar conectados simultáneamente
 */

const SESSION_LIMIT_TEST_CONFIG = {
    maxUsuarios: 6,
    intentoLoginExtra: 7 // Intento de 7mo usuario debe fallar
};

/**
 * Test de límite de sesiones
 * Simula múltiples usuarios intentando conectarse
 */
async function runSessionLimitTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        PRUEBA DE LÍMITE DE SESIONES SIMULTÁNEAS             ║');
    console.log('║        Verificar máximo ' + SESSION_LIMIT_TEST_CONFIG.maxUsuarios + ' usuarios conectados        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const resultados = {
        loginsExitosos: 0,
        loginsRechazados: 0,
        loginsIntentados: 0,
        tiempos: [],
        detalles: []
    };

    // Intentar conectar 7 usuarios (6 deberían pasar, 1 debe ser rechazado)
    for (let u = 1; u <= SESSION_LIMIT_TEST_CONFIG.intentoLoginExtra; u++) {
        const userRut = `1234567${u}-${u}`;
        const tiempoInicio = Date.now();

        console.log(`\n🔑 [Usuario ${u}] Intentando login con RUT: ${userRut}`);

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'login',
                    userRut: userRut
                })
            });

            const result = await response.json();
            const tiempoRespuesta = Date.now() - tiempoInicio;
            resultados.tiempos.push(tiempoRespuesta);
            resultados.loginsIntentados++;

            const detalle = {
                usuario: u,
                rut: userRut,
                exitoso: result.success,
                tiempoMs: tiempoRespuesta,
                mensaje: result.message || result.error
            };

            if (result.success) {
                resultados.loginsExitosos++;
                console.log(`✅ [Usuario ${u}] LOGIN EXITOSO`);
                console.log(`   • ${result.message}`);
                console.log(`   • Tiempo: ${tiempoRespuesta}ms`);
            } else {
                resultados.loginsRechazados++;
                console.log(`❌ [Usuario ${u}] LOGIN RECHAZADO`);
                console.log(`   • Razón: ${result.error}`);
                console.log(`   • Tiempo: ${tiempoRespuesta}ms`);
            }

            resultados.detalles.push(detalle);

        } catch (error) {
            const tiempoRespuesta = Date.now() - tiempoInicio;
            resultados.tiempos.push(tiempoRespuesta);
            resultados.loginsIntentados++;
            resultados.loginsRechazados++;

            console.log(`❌ [Usuario ${u}] ERROR DE CONEXIÓN`);
            console.log(`   • Error: ${error.message}`);
            console.log(`   • Tiempo: ${tiempoRespuesta}ms`);

            resultados.detalles.push({
                usuario: u,
                rut: userRut,
                exitoso: false,
                tiempoMs: tiempoRespuesta,
                mensaje: `Error: ${error.message}`
            });
        }

        // Pequeña pausa entre intentos
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Resumen
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN DE RESULTADOS                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Estadísticas:`);
    console.log(`   • Intentos de login: ${resultados.loginsIntentados}`);
    console.log(`   • Logins exitosos: ${resultados.loginsExitosos}/${SESSION_LIMIT_TEST_CONFIG.maxUsuarios}`);
    console.log(`   • Logins rechazados: ${resultados.loginsRechazados}`);
    console.log(`   • Tiempo promedio: ${Math.round(resultados.tiempos.reduce((a, b) => a + b) / resultados.tiempos.length)}ms`);

    console.log(`\n📋 Validación de Límite:`);
    const limitOk = resultados.loginsExitosos === SESSION_LIMIT_TEST_CONFIG.maxUsuarios && resultados.loginsRechazados === 1;

    if (limitOk) {
        console.log(`   ✅ CORRECTO: ${SESSION_LIMIT_TEST_CONFIG.maxUsuarios} usuarios conectados, 7mo rechazado`);
    } else {
        console.log(`   ❌ ERROR: Límite no funcionó correctamente`);
        console.log(`      - Esperado: ${SESSION_LIMIT_TEST_CONFIG.maxUsuarios} exitosos, 1 rechazado`);
        console.log(`      - Obtenido: ${resultados.loginsExitosos} exitosos, ${resultados.loginsRechazados} rechazados`);
    }

    // Tabla de detalles
    console.log('\n📝 TABLA DE INTENTOS:\n');
    console.log('Usuario │ RUT          │ Estado   │ Tiempo │ Mensaje');
    console.log('────────┼──────────────┼──────────┼────────┼──────────────────────────────');

    resultados.detalles.forEach(d => {
        const usuario = `${d.usuario}`.padEnd(6, ' ');
        const rut = d.rut.padEnd(12, ' ');
        const estado = d.exitoso ? '✅ Exitoso' : '❌ Rechazado';
        const tiempo = `${d.tiempoMs}ms`.padEnd(6, ' ');
        const mensaje = d.mensaje.substring(0, 30);
        console.log(`${usuario} │ ${rut} │ ${estado} │ ${tiempo} │ ${mensaje}`);
    });

    console.log('\n✨ Prueba de límite completada\n');

    return resultados;
}

console.log('💡 Para ejecutar prueba de límite: runSessionLimitTest()');
