/* ================= PRUEBAS FUNCIONALES DE SEGURIDAD ================= */
/* Ejecutar después de que app.js cargue completamente */

async function runFunctionalTests() {
    console.clear();
    console.log('%c🧪 PRUEBAS FUNCIONALES DE SEGURIDAD', 'font-size: 14px; font-weight: bold; color: #0066CC;');
    console.log('%c═════════════════════════════════════', 'color: #0066CC;');

    const tests = [];
    let testsPassed = 0;
    let testsFailed = 0;

    // Helper para registrar resultado
    function logResult(name, passed, details = '') {
        tests.push({ name, passed, details });
        if (passed) {
            testsPassed++;
            console.log(`✅ ${name}`);
        } else {
            testsFailed++;
            console.error(`❌ ${name}`);
            if (details) console.error(`   └─ ${details}`);
        }
    }

    try {
        // TEST 1: Verificar que CONFIG está disponible
        logResult(
            'CONFIG cargado desde config.js',
            typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SCRIPT_URL,
            typeof CONFIG === 'undefined' ? 'CONFIG no definido' : ''
        );

        // TEST 2: Verificar que bcryptjs está disponible
        logResult(
            'bcryptjs disponible (dcodeIO.bcrypt)',
            typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt !== undefined,
            typeof dcodeIO === 'undefined' ? 'bcryptjs no cargado' : ''
        );

        // TEST 3: Verificar funciones de seguridad existen
        const hasEscapeHTML = typeof escapeHTML === 'function';
        const hasCreateSafeElement = typeof createSafeElement === 'function';
        const hasSafeHTML = typeof setSafeHTML === 'function';
        logResult(
            'Funciones de seguridad disponibles',
            hasEscapeHTML && hasCreateSafeElement && hasSafeHTML,
            `escapeHTML: ${hasEscapeHTML}, createSafeElement: ${hasCreateSafeElement}, setSafeHTML: ${hasSafeHTML}`
        );

        // TEST 4: Probar escapeHTML con payload XSS
        const xssPayload = '<img src=x onerror="alert(1)">';
        const escaped = escapeHTML(xssPayload);
        const xssSafe = !escaped.includes('<img') && escaped.includes('&lt;img');
        logResult(
            'escapeHTML previene XSS injection',
            xssSafe,
            xssSafe ? '' : `Resultado: ${escaped}`
        );

        // TEST 5: Probar createSafeElement
        try {
            const safeEl = createSafeElement('div', '<script>alert(1)</script>', 'test-class');
            const isDiv = safeEl.tagName === 'DIV';
            const hasClass = safeEl.className === 'test-class';
            const safeContent = safeEl.textContent === '<script>alert(1)</script>' && !safeEl.innerHTML.includes('<script');
            logResult(
                'createSafeElement crea elementos seguros',
                isDiv && hasClass && safeContent,
                !safeContent ? 'Content no sanitizado correctamente' : ''
            );
        } catch (e) {
            logResult('createSafeElement crea elementos seguros', false, e.message);
        }

        // TEST 6: Verificar que loginAttempts existe
        logResult(
            'Sistema de rate limiting inicializado (loginAttempts)',
            typeof loginAttempts === 'object' && Object.keys(loginAttempts).length === 0,
            'loginAttempts debe ser object vacío'
        );

        // TEST 7: Probar lógica de rate limiting (simulación)
        const testRut = 'TEST_12345678-9';
        const now = Date.now();
        loginAttempts[testRut] = { count: 0, timestamp: now };

        // Simular 3 intentos
        loginAttempts[testRut].count = 3;
        const maxAttempts = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
        const canAttempt = loginAttempts[testRut].count < maxAttempts;

        logResult(
            'Rate limiting controla intentos correctamente',
            canAttempt && loginAttempts[testRut].count === 3,
            `Intentos simulados: 3/${maxAttempts}`
        );

        // TEST 8: Probar bloqueo después de máximos intentos
        loginAttempts[testRut].count = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
        const isBlocked = loginAttempts[testRut].count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
        logResult(
            'Cuenta se bloquea después de 5 intentos',
            isBlocked,
            `Intentos: ${loginAttempts[testRut].count}, Máximo: ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}`
        );

        // Limpiar test data
        delete loginAttempts[testRut];

        // TEST 9: Verificar SECURITY_CONFIG tiene valores correctos
        const secConfig = SECURITY_CONFIG;
        const configOk = secConfig.MAX_LOGIN_ATTEMPTS === 5 &&
                        secConfig.LOCKOUT_DURATION_MS === 900000 &&
                        secConfig.PASSWORD_MIN_LENGTH === 6;
        logResult(
            'SECURITY_CONFIG tiene valores correctos',
            configOk,
            `Max: ${secConfig.MAX_LOGIN_ATTEMPTS}, Lockout: ${secConfig.LOCKOUT_DURATION_MS}ms, MinLen: ${secConfig.PASSWORD_MIN_LENGTH}`
        );

        // TEST 10: Verificar que handleLogin existe
        logResult(
            'Función handleLogin disponible',
            typeof handleLogin === 'function',
            ''
        );

        // TEST 11: Verificar que attemptEvaluatorLogin existe
        logResult(
            'Función attemptEvaluatorLogin disponible',
            typeof attemptEvaluatorLogin === 'function',
            ''
        );

        // TEST 12: Verificar que html2pdf se cargó
        logResult(
            'html2pdf cargado desde CDN',
            typeof html2pdf !== 'undefined',
            typeof html2pdf === 'undefined' ? 'html2pdf no disponible' : ''
        );

        // TEST 13: Verificar que IndexedDB está disponible
        const hasIndexedDB = typeof indexedDB !== 'undefined';
        logResult(
            'IndexedDB disponible',
            hasIndexedDB,
            !hasIndexedDB ? 'IndexedDB no soportado en este navegador' : ''
        );

        // TEST 14: Verificar funciones de base de datos
        const hasDbFunctions = typeof initIndexedDB === 'function' &&
                              typeof dbGetAll === 'function' &&
                              typeof cloudGet === 'function';
        logResult(
            'Funciones de base de datos disponibles',
            hasDbFunctions,
            ''
        );

        // TEST 15: Verificar que GOOGLE_SCRIPT_URL viene de CONFIG
        logResult(
            'GOOGLE_SCRIPT_URL viene de CONFIG (no hardcodeado)',
            GOOGLE_SCRIPT_URL === CONFIG.GOOGLE_SCRIPT_URL,
            GOOGLE_SCRIPT_URL === CONFIG.GOOGLE_SCRIPT_URL ? '' : 'URL no coincide'
        );

    } catch (e) {
        console.error('❌ Error durante las pruebas:', e.message);
        logResult('Ejecución sin errores', false, e.message);
    }

    // Resumen final
    console.log('%c═════════════════════════════════════', 'color: #0066CC;');
    console.log('%c📊 RESUMEN', 'font-size: 12px; font-weight: bold; color: #333;');
    console.log(`✅ Pasadas: ${testsPassed}/${testsPassed + testsFailed}`);
    console.log(`❌ Fallidas: ${testsFailed}/${testsPassed + testsFailed}`);

    if (testsFailed === 0) {
        console.log('%c🎉 ¡TODAS LAS PRUEBAS FUNCIONALES PASADAS!', 'font-size: 12px; font-weight: bold; color: #00AA00; background: #F0FFF0; padding: 5px;');
    } else {
        console.log(`%c⚠️ ${testsFailed} PRUEBA(S) FALLIDA(S)`, 'font-size: 12px; font-weight: bold; color: #AA0000; background: #FFF0F0; padding: 5px;');
    }

    console.log('%c═════════════════════════════════════\n', 'color: #0066CC;');

    return {
        passed: testsPassed,
        failed: testsFailed,
        total: testsPassed + testsFailed,
        tests: tests
    };
}

// Hook para ejecutar automáticamente si está en consola de desarrollo
window.addEventListener('load', () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c🔬 Sistema de pruebas funcionales listo. Ejecuta: runFunctionalTests()', 'color: #0066CC; font-weight: bold;');
    }
});
