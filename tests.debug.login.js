/**
 * TEST DE DEBUG - Verificar exactamente qué responde Google Apps Script
 */

async function testDebugLogin() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           DEBUG: ¿Qué responde Google Apps Script?         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const payload = {
        action: 'login',
        userRut: 'TEST-RUT-001'
    };

    console.log('📤 Payload a enviar:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\n⏳ Enviando...\n');

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Headers:', {
            'content-type': response.headers.get('content-type')
        });

        const text = await response.text();
        console.log('\n📥 Response Text (raw):');
        console.log(text);

        console.log('\n');

        try {
            const result = JSON.parse(text);
            console.log('📥 Response Parsed (JSON):');
            console.log(JSON.stringify(result, null, 2));

            if (result.success) {
                console.log('\n✅ LOGIN EXITOSO');
                console.log('   Mensaje:', result.message);
            } else {
                console.log('\n❌ LOGIN FALLIDO');
                console.log('   Error:', result.error);
                console.log('   versionConflict:', result.versionConflict);
                console.log('   serverVersion:', result.serverVersion);
                console.log('   clientVersion:', result.clientVersion);
            }
        } catch (parseError) {
            console.log('❌ No se pudo parsear la respuesta como JSON');
            console.log('   Error:', parseError.message);
        }

    } catch (error) {
        console.log('❌ ERROR DE CONEXIÓN');
        console.log('   Error:', error.message);
    }
}

console.log('💡 Para ejecutar debug: testDebugLogin()');
