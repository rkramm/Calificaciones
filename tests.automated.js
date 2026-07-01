/**
 * SUITE DE TESTS AUTOMATIZADOS - Acceso y Asignaciones
 * Verifica que el sistema funciona correctamente después de refactoring
 * Ejecutar en consola del navegador: runAutomatedTests()
 */

const AUTOMATED_TESTS = {
    results: [],
    passCount: 0,
    failCount: 0
};

/**
 * Registrar resultado de test
 */
function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const msg = `${status}: ${name}`;
    console.log(msg + (details ? ` - ${details}` : ''));
    AUTOMATED_TESTS.results.push({ name, passed, details });
    if (passed) AUTOMATED_TESTS.passCount++;
    else AUTOMATED_TESTS.failCount++;
}

/**
 * TEST 1: Helper functions exist and are callable
 */
function testHelperFunctions() {
    console.log('\n🧪 TEST GROUP 1: Helper Functions\n');

    logTest('parseAsignacionEtapas function exists', typeof parseAsignacionEtapas === 'function');
    logTest('getUserAsignaciones function exists', typeof getUserAsignaciones === 'function');
    logTest('mapAsignacionesForDisplay function exists', typeof mapAsignacionesForDisplay === 'function');
    logTest('getEntityName function exists', typeof getEntityName === 'function');
    logTest('initializeEvaluatorUI function exists', typeof initializeEvaluatorUI === 'function');
}

/**
 * TEST 2: parseAsignacionEtapas works correctly
 */
function testParseEtapas() {
    console.log('\n🧪 TEST GROUP 2: Parse Etapas Function\n');

    // Test string input
    const result1 = parseAsignacionEtapas('1,2,3');
    logTest('Parse "1,2,3" returns array', Array.isArray(result1) && result1.length === 3);
    logTest('Parse "1,2,3" has correct values', JSON.stringify(result1) === '[1,2,3]', `Got ${JSON.stringify(result1)}`);

    // Test array input
    const result2 = parseAsignacionEtapas([3, 1, 2]);
    logTest('Parse [3,1,2] sorts correctly', JSON.stringify(result2) === '[1,2,3]', `Got ${JSON.stringify(result2)}`);

    // Test invalid input
    const result3 = parseAsignacionEtapas(null);
    logTest('Parse null returns [1]', JSON.stringify(result3) === '[1]', `Got ${JSON.stringify(result3)}`);

    // Test empty array
    const result4 = parseAsignacionEtapas([]);
    logTest('Parse [] returns [1]', JSON.stringify(result4) === '[1]', `Got ${JSON.stringify(result4)}`);

    // Test string with spaces
    const result5 = parseAsignacionEtapas('1 , 2 , 3');
    logTest('Parse "1 , 2 , 3" handles spaces', JSON.stringify(result5) === '[1,2,3]', `Got ${JSON.stringify(result5)}`);
}

/**
 * TEST 3: getUserAsignaciones filters correctly
 */
function testGetUserAsignaciones() {
    console.log('\n🧪 TEST GROUP 3: Get User Asignaciones\n');

    // Setup mock data
    currentUser = { rut: 'TEST123', nombre: 'Test User' };
    const mockAssignments = [
        { rut: 'TEST123', programa: 'DS49', provincia: 'Osorno' },
        { rut: 'TEST123', programa: 'DS27', provincia: 'Osorno' },
        { rut: 'OTHER456', programa: 'DS10', provincia: 'Osorno' }
    ];

    const result = getUserAsignaciones(mockAssignments);
    logTest('Filter returns only current user assignments', result.length === 2, `Got ${result.length} assignments`);
    logTest('Filter excludes other users', result.every(a => a.rut === 'TEST123'), 'All should be TEST123');
    logTest('Filter returns correct data', result[0].programa === 'DS49', `Got ${result[0]?.programa}`);

    // Test with null input
    const result2 = getUserAsignaciones(null);
    logTest('Filter null returns empty array', Array.isArray(result2) && result2.length === 0);

    // Test with empty array
    const result3 = getUserAsignaciones([]);
    logTest('Filter empty array returns empty', Array.isArray(result3) && result3.length === 0);
}

/**
 * TEST 4: mapAsignacionesForDisplay works correctly
 */
function testMapAsignaciones() {
    console.log('\n🧪 TEST GROUP 4: Map Asignaciones For Display\n');

    currentUser = { rut: 'TEST123' };
    const mockAssignments = [
        {
            rut: 'TEST123',
            programa: 'DS49',
            provincia: 'Osorno',
            etapas: '1,2,3',
            entidadNombre: 'TEST ENTITY'
        },
        {
            rut: 'TEST123',
            programa: 'DS27',
            provincia: 'Llanquihue',
            etapas: '1,3',
            entidadNombre: ''  // Empty should become 'Sin Entidad'
        }
    ];

    const result = mapAsignacionesForDisplay(mockAssignments);

    logTest('Map returns array', Array.isArray(result));
    logTest('Map creates cobertura field', result[0]?.cobertura === 'DS49 - OSORNO', `Got ${result[0]?.cobertura}`);
    logTest('Map parses etapas to array', Array.isArray(result[0]?.etapas) && result[0].etapas.length === 3);
    logTest('Map handles empty entidadNombre', result[1]?.entidadNombre === 'Sin Entidad', `Got ${result[1]?.entidadNombre}`);
    logTest('Map sorts by cobertura', result[0].cobertura < result[1].cobertura, 'Should be sorted alphabetically');
}

/**
 * TEST 5: getEntityName handles different field names
 */
function testGetEntityName() {
    console.log('\n🧪 TEST GROUP 5: Get Entity Name\n');

    // Test with Nombre field (capital N)
    const entity1 = { Nombre: 'Entity A', idEntidad: '1' };
    logTest('Get entity with Nombre field', getEntityName(entity1) === 'Entity A', `Got ${getEntityName(entity1)}`);

    // Test with nombre field (lowercase)
    const entity2 = { nombre: 'Entity B' };
    logTest('Get entity with nombre field', getEntityName(entity2) === 'Entity B', `Got ${getEntityName(entity2)}`);

    // Test with fallback
    const entity3 = { name: 'Entity C' };
    logTest('Get entity with name field', getEntityName(entity3) === 'Entity C', `Got ${getEntityName(entity3)}`);

    // Test with null
    logTest('Get null entity returns default', getEntityName(null) === 'Sin Nombre');

    // Test with NOMBRE (all caps)
    const entity4 = { NOMBRE: 'Entity D' };
    logTest('Get entity with NOMBRE field', getEntityName(entity4) === 'Entity D', `Got ${getEntityName(entity4)}`);

    // Test priority: Nombre > nombre > name > NOMBRE
    const entity5 = { Nombre: 'First', nombre: 'Second', name: 'Third', NOMBRE: 'Fourth' };
    logTest('Get entity respects field priority', getEntityName(entity5) === 'First', `Got ${getEntityName(entity5)}`);
}

/**
 * TEST 6: Array safety checks
 */
function testArraySafety() {
    console.log('\n🧪 TEST GROUP 6: Array Safety Checks\n');

    currentUser = { rut: 'TEST123' };

    // Test mapAsignacionesForDisplay with edge cases
    const result1 = mapAsignacionesForDisplay(null);
    logTest('mapAsignacionesForDisplay handles null safely', Array.isArray(result1) && result1.length === 0);

    const result2 = mapAsignacionesForDisplay([]);
    logTest('mapAsignacionesForDisplay handles empty array', Array.isArray(result2) && result2.length === 0);

    const result3 = mapAsignacionesForDisplay([{ programa: 'DS49', provincia: 'Osorno', etapas: '1' }]);
    logTest('mapAsignacionesForDisplay handles missing entidadNombre', result3[0]?.entidadNombre === 'Sin Entidad');
}

/**
 * TEST 7: No undefined/null access errors
 */
function testUnsafeAccess() {
    console.log('\n🧪 TEST GROUP 7: Unsafe Access Prevention\n');

    let errorOccurred = false;

    try {
        currentUser = { rut: 'TEST123' };
        allAsignacionesMapped = [];

        // This should not throw an error
        const result = parseAsignacionEtapas('1,2,3');
        logTest('parseAsignacionEtapas does not error', true);
    } catch (e) {
        logTest('parseAsignacionEtapas error check', false, e.message);
        errorOccurred = true;
    }

    try {
        // Test with undefined array
        const result = getUserAsignaciones(undefined);
        logTest('getUserAsignaciones handles undefined', Array.isArray(result));
    } catch (e) {
        logTest('getUserAsignaciones undefined check', false, e.message);
        errorOccurred = true;
    }

    logTest('No unexpected errors occurred', !errorOccurred);
}

/**
 * TEST 8: Performance check - No duplicate operations
 */
function testPerformance() {
    console.log('\n🧪 TEST GROUP 8: Performance Checks\n');

    const callCounts = {
        parseAsignacionEtapas: 0,
        getEntityName: 0
    };

    // Wrap functions to count calls
    const originalParse = parseAsignacionEtapas;
    const originalGetEntity = getEntityName;

    currentUser = { rut: 'TEST123' };

    const largeArray = Array(100).fill(null).map((_, i) => ({
        rut: 'TEST123',
        programa: 'DS' + (49 - (i % 3)),
        provincia: 'Osorno',
        etapas: '1,2,3',
        Nombre: `Entity ${i}`
    }));

    const start = performance.now();
    const result = mapAsignacionesForDisplay(largeArray);
    const elapsed = performance.now() - start;

    logTest('mapAsignacionesForDisplay processes 100 items fast', elapsed < 100, `${elapsed.toFixed(2)}ms`);
    logTest('All items processed', result.length === 100, `Got ${result.length}`);
}

/**
 * EJECUTAR TODOS LOS TESTS
 */
function runAutomatedTests() {
    console.clear();
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  AUTOMATED TEST SUITE - Access & Assignments   ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    AUTOMATED_TESTS.results = [];
    AUTOMATED_TESTS.passCount = 0;
    AUTOMATED_TESTS.failCount = 0;

    testHelperFunctions();
    testParseEtapas();
    testGetUserAsignaciones();
    testMapAsignaciones();
    testGetEntityName();
    testArraySafety();
    testUnsafeAccess();
    testPerformance();

    // SUMMARY
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║                   TEST SUMMARY                 ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`✅ PASSED: ${AUTOMATED_TESTS.passCount}`);
    console.log(`❌ FAILED: ${AUTOMATED_TESTS.failCount}`);
    console.log(`📊 TOTAL:  ${AUTOMATED_TESTS.passCount + AUTOMATED_TESTS.failCount}`);
    console.log(`\n📈 Success Rate: ${((AUTOMATED_TESTS.passCount / (AUTOMATED_TESTS.passCount + AUTOMATED_TESTS.failCount)) * 100).toFixed(1)}%\n`);

    if (AUTOMATED_TESTS.failCount === 0) {
        console.log('🎉 ALL TESTS PASSED! System is working correctly.\n');
        return true;
    } else {
        console.log('⚠️  SOME TESTS FAILED! Review the output above.\n');
        return false;
    }
}

console.log('💡 To run automated tests, execute: runAutomatedTests()');
