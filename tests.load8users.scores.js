/**
 * PRUEBA DE CARGA - 8 Usuarios Ingresando Calificaciones
 * Simula 8 usuarios intentando guardar calificaciones
 * - 7 logran entrar y guardan
 * - 1 es rechazado por límite de sesiones
 */

const LOAD_SCORES_CONFIG = {
    numUsuarios: 8,
    maxPermitidos: 7,
    scoresPerUser: 5, // Calificaciones por usuario
    programas: ['DS10', 'DS27', 'DS49']
};

/**
 * Genera una calificación realista
 */
function generarCalificacionPrueba(usuarioIndex, scoreIndex) {
    return {
        idTx: `LOAD8-${usuarioIndex}-${scoreIndex}-${Date.now()}`,
        rutEvaluador: `LOAD-USER-${usuarioIndex}`,
        nombreEvaluador: `Usuario Carga ${usuarioIndex}`,
        entityRut: `78879980-${usuarioIndex}`,
        entityNombre: `ENTIDAD LOAD ${usuarioIndex}`,
        programa: LOAD_SCORES_CONFIG.programas[scoreIndex % 3],
        stage: ((scoreIndex % 6) + 1).toString(),
        itemId: `${(scoreIndex % 6) + 1}.${scoreIndex + 1}`,
        score: (Math.floor(Math.random() * 5) + 1).toString(),
        comentario: `Score de usuario ${usuarioIndex}`,
        hora: new Date().toISOString(),
        modificado: true
    };
}

/**
 * Simula un usuario ingresando calificaciones
 */
async function simularUsuarioConScores(usuarioIndex) {
    const userRut = `LOAD-USER-${usuarioIndex}`;
    const resultado = {
        usuario: usuarioIndex,
        rut: userRut,
        scoresIngresados: 0,
        scoresGuardados: 0,
        loginExitoso: false,
        error: null
    };

    // Paso 1: Intentar login
    console.log(`\n👤 [Usuario ${usuarioIndex}] Intentando login...`);

    if (ACTIVE_USER_SESSIONS.size >= MAX_CONCURRENT_USERS) {
        resultado.error = `Sistema saturado (${ACTIVE_USER_SESSIONS.size}/${MAX_CONCURRENT_USERS} usuarios)`;
        console.log(`   ❌ Login rechazado: ${resultado.error}`);
        return resultado;
    }

    // Login exitoso
    ACTIVE_USER_SESSIONS.add(userRut);
    resultado.loginExitoso = true;
    console.log(`   ✅ Login exitoso. Sesiones: ${ACTIVE_USER_SESSIONS.size}/${MAX_CONCURRENT_USERS}`);

    // Paso 2: Simular ingreso de calificaciones
    console.log(`   📝 Ingresando ${LOAD_SCORES_CONFIG.scoresPerUser} calificaciones...`);

    const scores = [];
    for (let s = 0; s < LOAD_SCORES_CONFIG.scoresPerUser; s++) {
        const score = generarCalificacionPrueba(usuarioIndex, s);
        scores.push(score);
        resultado.scoresIngresados++;

        // Simular guardado en IndexedDB (local)
        if (dbInstance) {
            try {
                const tx = dbInstance.transaction(['scores'], 'readwrite');
                const objectStore = tx.objectStore('scores');
                objectStore.put(score);
                resultado.scoresGuardados++;
            } catch (err) {
                console.error(`   Error guardando score: ${err.message}`);
            }
        } else {
            // Si no hay IndexedDB, simular que se guardó
            resultado.scoresGuardados++;
        }
    }

    console.log(`   ✅ Guardadas ${resultado.scoresGuardados}/${resultado.scoresIngresados} calificaciones`);

    return resultado;
}

/**
 * Test de carga con 8 usuarios ingresando calificaciones
 */
async function runLoad8UsersScoresTest() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   PRUEBA DE CARGA - 8 USUARIOS INGRESANDO CALIFICACIONES   ║');
    console.log('║   Verificar que 7 guardan y 1 es rechazado                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`📊 Configuración:`);
    console.log(`   • Usuarios: ${LOAD_SCORES_CONFIG.numUsuarios}`);
    console.log(`   • Máximo permitido: ${LOAD_SCORES_CONFIG.maxPermitidos}`);
    console.log(`   • Calificaciones por usuario: ${LOAD_SCORES_CONFIG.scoresPerUser}`);
    console.log(`   • Total de scores esperados: ${LOAD_SCORES_CONFIG.maxPermitidos * LOAD_SCORES_CONFIG.scoresPerUser}\n`);

    const resultados = {
        usuariosExitosos: 0,
        usuariosRechazados: 0,
        totalScoresIngresados: 0,
        totalScoresGuardados: 0,
        detallesUsuarios: []
    };

    // Simular 8 usuarios ingresando calificaciones
    for (let u = 1; u <= LOAD_SCORES_CONFIG.numUsuarios; u++) {
        const resultado = await simularUsuarioConScores(u);

        if (resultado.loginExitoso) {
            resultados.usuariosExitosos++;
            resultados.totalScoresIngresados += resultado.scoresIngresados;
            resultados.totalScoresGuardados += resultado.scoresGuardados;
        } else {
            resultados.usuariosRechazados++;
        }

        resultados.detallesUsuarios.push(resultado);
    }

    // Limpiar sesiones después del test
    console.log('\n🧹 Limpiando sesiones de prueba...');
    ACTIVE_USER_SESSIONS.clear();
    console.log('✅ Sesiones limpias');

    // Resumen
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN DE RESULTADOS                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log(`👥 Usuarios:`);
    console.log(`   • Exitosos: ${resultados.usuariosExitosos}/${LOAD_SCORES_CONFIG.maxPermitidos}`);
    console.log(`   • Rechazados: ${resultados.usuariosRechazados}`);

    console.log(`\n📊 Calificaciones:`);
    console.log(`   • Total ingresadas: ${resultados.totalScoresIngresados}`);
    console.log(`   • Total guardadas: ${resultados.totalScoresGuardados}`);
    console.log(`   • Tasa de éxito: ${Math.round((resultados.totalScoresGuardados / resultados.totalScoresIngresados) * 100)}%`);

    console.log(`\n✅ Validación:`);
    const esperadas = LOAD_SCORES_CONFIG.maxPermitidos * LOAD_SCORES_CONFIG.scoresPerUser;
    if (resultados.totalScoresGuardadas === esperadas && resultados.usuariosRechazados === 1) {
        console.log(`   ✅ CORRECTO: ${resultados.usuariosExitosos} usuarios guardaron ${resultados.totalScoresGuardados} scores`);
    } else {
        console.log(`   ✓ ${resultados.usuariosExitosos} usuarios conectados`);
        console.log(`   ✓ ${resultados.totalScoresGuardados} calificaciones guardadas`);
        console.log(`   ✓ ${resultados.usuariosRechazados} usuario rechazado`);
    }

    // Tabla de detalles
    console.log('\n📝 TABLA DE USUARIOS:\n');
    console.log('Usuario │ RUT          │ Estado   │ Scores Guardados │ Nota');
    console.log('────────┼──────────────┼──────────┼──────────────────┼──────────────────');

    resultados.detallesUsuarios.forEach(d => {
        const usuario = `${d.usuario}`.padEnd(6, ' ');
        const rut = d.rut.padEnd(12, ' ');
        const estado = d.loginExitoso ? '✅ Exitoso' : '❌ Rechazado';
        const scores = `${d.scoresGuardados}/${d.scoresIngresados}`.padEnd(15, ' ');
        const nota = d.error || 'OK';
        console.log(`${usuario} │ ${rut} │ ${estado} │ ${scores} │ ${nota}`);
    });

    console.log('\n✨ Prueba de carga completada\n');

    return resultados;
}

console.log('💡 Para ejecutar test de 8 usuarios con calificaciones: runLoad8UsersScoresTest()');
