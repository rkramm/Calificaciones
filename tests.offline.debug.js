/**
 * DEBUG DETALLADO - Por qué Background Sync se queda atrás
 */

async function debugBackgroundSync() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          DEBUG: ANÁLISIS DE BACKGROUND SYNC                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const syncQueue = [];
    let syncInProgress = false;
    let syncCount = 0;
    let totalSyncTime = 0;
    const timeline = [];

    // Configuración
    const SYNC_INTERVAL = 30000; // 30 segundos
    const SYNC_DURATION = 2500; // 2.5 segundos por sync
    const TEST_DURATION = 15000; // 15 segundos de prueba

    // Crear 50 items iniciales
    for (let i = 0; i < 50; i++) {
        syncQueue.push(i);
    }

    const testStart = Date.now();

    // Función de logging detallado
    function log(mensaje) {
        const elapsed = Date.now() - testStart;
        const msg = `[${elapsed}ms] ${mensaje}`;
        timeline.push(msg);
        console.log(msg);
    }

    log('🚀 INICIO DE PRUEBA');
    log(`📦 Cola inicial: ${syncQueue.length} items`);
    log(`⏱️  Intervalo de sync: ${SYNC_INTERVAL}ms`);
    log(`⏱️  Duración de sync: ${SYNC_DURATION}ms`);
    log(`⏱️  Duración total de prueba: ${TEST_DURATION}ms\n`);

    // Función de sync
    const performSync = async () => {
        if (syncInProgress) {
            log('⚠️  Sync ya en progreso, ignorando...');
            return;
        }

        if (syncQueue.length === 0) {
            log('✅ Cola vacía, no hay nada que sincronizar');
            return;
        }

        syncInProgress = true;
        syncCount++;
        const itemsToSync = Math.min(10, syncQueue.length);

        log(`⏳ SYNC #${syncCount} INICIADO: Sincronizando ${itemsToSync}/${syncQueue.length} items`);
        const syncStartTime = Date.now();

        // Simular tiempo de sincronización con Google Sheets
        await new Promise(resolve => setTimeout(resolve, SYNC_DURATION));

        const syncTime = Date.now() - syncStartTime;
        totalSyncTime += syncTime;
        syncQueue.splice(0, itemsToSync);
        syncInProgress = false;

        log(`✅ SYNC #${syncCount} COMPLETADO en ${syncTime}ms. Pendientes: ${syncQueue.length}`);

        // Programar siguiente sync
        if (syncQueue.length > 0) {
            const nextSyncDelay = SYNC_INTERVAL;
            log(`📅 Próximo sync programado en ${nextSyncDelay}ms`);

            // PROBLEMA AQUÍ: ¿Se ejecuta el timeout antes de que termine la prueba?
            setTimeout(performSync, nextSyncDelay);
        }
    };

    // Iniciar primer sync después de 100ms
    log('📅 Primer sync programado en 100ms\n');
    setTimeout(performSync, 100);

    // Simulación: Usuario agrega más datos a los 2500ms
    setTimeout(() => {
        log(`👤 USUARIO AGREGA 20 SCORES MÁS`);
        for (let i = 50; i < 70; i++) {
            syncQueue.push(i);
        }
        log(`📦 Cola ahora tiene: ${syncQueue.length} items\n`);
    }, 2500);

    // Esperar a que termine la prueba
    return new Promise(resolve => {
        setTimeout(() => {
            const elapsed = Date.now() - testStart;

            log('\n🛑 FIN DE PRUEBA');
            log(`⏱️  Tiempo total: ${elapsed}ms`);
            log(`💾 Syncs completados: ${syncCount}`);
            log(`📦 Items pendientes: ${syncQueue.length}`);
            log(`⏱️  Tiempo total de sync: ${totalSyncTime}ms`);
            log(`📊 Items sincronizados: ${50 + 20 - syncQueue.length}`);

            // Análisis
            console.log('\n╔════════════════════════════════════════════════════════════╗');
            console.log('║                      ANÁLISIS DEL PROBLEMA                 ║');
            console.log('╚════════════════════════════════════════════════════════════╝\n');

            console.log('📋 TIMELINE ESPERADA vs REAL:\n');

            console.log('⏱️  EVENTOS ESPERADOS en 15 segundos:');
            console.log('   • 0ms:    Inicio');
            console.log('   • 100ms:  Sync #1 inicia');
            console.log('   • 2600ms: Sync #1 termina → Siguiente sync en +30s = 32600ms ❌ (fuera de prueba)');
            console.log('   • 2500ms: Usuario agrega 20 items más');
            console.log('   • 15000ms: FIN DE PRUEBA\n');

            console.log('🔴 PROBLEMA ENCONTRADO:');
            console.log('   El intervalo de 30 segundos es MUCHO MÁS LARGO que la duración de la prueba');
            console.log('   • Sync #1 termina a ~2600ms');
            console.log('   • Sync #2 se programa para 2600ms + 30000ms = 32600ms');
            console.log('   • La prueba termina a 15000ms');
            console.log('   • Resultado: Solo 1 sync completado en 15 segundos ❌\n');

            console.log('💡 EN PRODUCCIÓN (prueba larga):');
            console.log('   • Con intervalo de 30s: 1 sync cada 30 segundos (OK)');
            console.log('   • Si hay 100 items: Tardará 30s × 10 syncs = 5 minutos en drenar ❌ TOO SLOW');
            console.log('   • Mejor: Reducir intervalo cuando hay muchos items pendientes\n');

            console.log('✅ SOLUCIÓN RECOMENDADA:');
            console.log('   Sync adaptativo:');
            console.log('   • Si pendientes < 10:  sync cada 30s  (ahorro batería)');
            console.log('   • Si pendientes 10-50: sync cada 5s   (normal)');
            console.log('   • Si pendientes > 50:  sync cada 1s   (urgente)\n');

            // Mostrar timeline completa
            console.log('╔════════════════════════════════════════════════════════════╗');
            console.log('║                    TIMELINE COMPLETA                       ║');
            console.log('╚════════════════════════════════════════════════════════════╝\n');
            timeline.forEach(t => console.log(t));

            resolve({
                problema: 'Intervalo de 30s es demasiado largo',
                syncsCompletados: syncCount,
                pendientes: syncQueue.length,
                solucion: 'Implementar sync adaptativo por cantidad de items',
                timelineCompleta: timeline
            });
        }, TEST_DURATION);
    });
}

console.log('💡 Para ejecutar debug detallado: debugBackgroundSync()');
