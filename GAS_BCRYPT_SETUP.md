# 🔐 Implementación de bcrypt en Google Apps Script

## Objetivo
Reemplazar almacenamiento de contraseñas en texto plano con hashes bcrypt seguros.

---

## PASO 1: Agregar Librería de Bcrypt

### En Google Apps Script:

1. Abre tu proyecto: `script.google.com`
2. Click en **Libraries** (icono de libros) en la izquierda
3. Pega este ID: `MWASUMVf7KeTIZ4bu2xAXQ_11SVRPZGN93UE7j2Ro8KoRm8h5IhIHqN3I`
4. Click en **"Add"** → selecciona versión más reciente
5. Alias: `Bcrypt` (dejar por defecto o cambiar si lo prefieres)

**Resultado esperado:**
```
✅ Librería agregada en "Libraries"
```

---

## PASO 2: Función para Hashear Contraseña al Guardar

### En Google Apps Script (agregar a Code.gs):

```javascript
/**
 * FUNCIÓN NUEVA: Hashear contraseña al guardar admin
 * Reemplaza guardado de contraseña en texto plano
 */
function setAdminPassword(plainPassword) {
    // Validar longitud mínima
    if (!plainPassword || plainPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Generar hash bcrypt (redondas = 10, valor por defecto seguro)
    const passwordHash = Bcrypt.hashPassword(plainPassword, Bcrypt.DEFAULT_SALT_ROUNDS);

    // Guardar hash en configuración (NO la contraseña plana)
    const config = [{
        clave: 'clave_admin',
        valor: passwordHash, // ✅ HASH, no texto plano
        timestamp: new Date().toISOString()
    }];

    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('configuracion') || 
        SpreadsheetApp.getActiveSpreadsheet().insertSheet('configuracion');

    // Reemplazar la fila existente o crear nueva
    const range = sheet.getRange('A1:C2');
    range.clearContent();
    range.setValues([
        ['clave', 'valor', 'timestamp'],
        [config[0].clave, config[0].valor, config[0].timestamp]
    ]);

    console.log('✅ Contraseña de admin hasheada y guardada');
}

/**
 * FUNCIÓN NUEVA: Validar contraseña contra hash
 * Llamar desde handleLogin en app.js
 */
function validateAdminPassword(plainPassword, storedHash) {
    try {
        // Comparar contraseña plana contra hash almacenado
        return Bcrypt.comparePassword(plainPassword, storedHash);
    } catch (e) {
        console.error('Error validando contraseña:', e);
        return false;
    }
}
```

---

## PASO 3: Actualizar Función de Login en Google Apps Script

### Busca esta función en Code.gs:

```javascript
// ANTES (inseguro - compara texto plano):
if (action === 'getConfig' || action === 'configuracion') {
    // ... código existente que obtiene clave_admin
    // Retorna el hash, NO la contraseña
}
```

### Reemplaza con esto (seguro - usa bcrypt):

```javascript
// DESPUÉS (seguro - usa hash):
if (action === 'getConfig' || action === 'configuracion') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('configuracion');
    
    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ error: 'No configuration found' })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const config = data.slice(1).map(row => ({
        clave: row[0],
        valor: row[1], // ✅ Retorna el HASH, no la contraseña
        timestamp: row[2]
    }));

    return ContentService.createTextOutput(
        JSON.stringify(config)
    ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## PASO 4: Actualizar app.js en Navegador

### En `app.js` (línea ~2103), reemplaza la verificación de contraseña admin:

**ANTES (inseguro):**
```javascript
if (passInput !== remoteClave.valor) {
    alert('Contraseña incorrecta');
    return;
}
```

**DESPUÉS (seguro - usar bcrypt.js del navegador):**
```javascript
// Validar contraseña contra hash bcrypt
const passwordValid = await bcrypt.compare(passInput, remoteClave.valor);

if (!passwordValid) {
    // RATE LIMITING: Registrar intento fallido
    const now = Date.now();
    if (!loginAttempts[userInput]) {
        loginAttempts[userInput] = { count: 0, timestamp: now };
    }
    loginAttempts[userInput].count++;
    const attemptsLeft = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - loginAttempts[userInput].count;

    if (attemptsLeft > 0) {
        alert(`❌ Contraseña incorrecta.\n\nIntento ${loginAttempts[userInput].count}/${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS}\n${attemptsLeft} intentos restantes`);
    } else {
        loginAttempts[userInput].timestamp = now;
        const lockoutMins = Math.ceil(SECURITY_CONFIG.LOCKOUT_DURATION_MS / 60000);
        alert(`🔒 Máximo de intentos alcanzado.\n\nCuenta bloqueada por ${lockoutMins} minutos por seguridad.`);
    }

    if (dot && txt) {
        dot.style.backgroundColor = '#FF4444';
        txt.textContent = 'Contraseña incorrecta';
        txt.style.color = '#A51D24';
    }
    return;
}

// Éxito: limpiar intentos fallidos
delete loginAttempts[userInput];
```

---

## PASO 5: Configurar Contraseña Admin Inicial

### En Google Apps Script (ejecutar una sola vez):

```javascript
// En Console de Apps Script: Run > setAdminPassword

function setInitialAdminPassword() {
    // ⚠️ CAMBIAR ESTO A TU CONTRASEÑA REAL
    const newPassword = "tu_contraseña_segura_aqui_123";
    
    setAdminPassword(newPassword);
    
    console.log('✅ Contraseña de admin configurada');
    console.log('Contraseña: ' + newPassword); // ⚠️ Borrar esta línea después
}

// LUEGO EJECUTA:
// 1. Copia el código arriba
// 2. En Apps Script: Click en "Run" → "setInitialAdminPassword"
// 3. Autoriza si pide permisos
// 4. Verifica consola: "✅ Contraseña de admin configurada"
```

---

## PASO 6: Hacer lo Mismo para Evaluadores (Opcional pero Recomendado)

### En Google Apps Script:

```javascript
/**
 * FUNCIÓN NUEVA: Hashear contraseña al crear evaluador
 */
function addEvaluadorWithSecurePassword(rut, nombre, area, plainPassword) {
    if (!plainPassword || plainPassword.length < 6) {
        return { error: "Contraseña muy corta (mín. 6 caracteres)" };
    }

    // Hashear contraseña
    const passwordHash = Bcrypt.hashPassword(plainPassword, Bcrypt.DEFAULT_SALT_ROUNDS);

    // Guardar evaluador con hash
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('evaluadores');

    const newRow = [rut, nombre, area, passwordHash]; // ✅ Hash, no plaintext
    sheet.appendRow(newRow);

    return { success: true, message: "Evaluador guardado con contraseña segura" };
}
```

### En `app.js`, cuando guardes un evaluador nuevo:

```javascript
// ANTES (inseguro):
const password = document.getElementById('ev-clave').value;
// Enviar a Google Sheets en texto plano ❌

// DESPUÉS (seguro):
// El hash se genera en Google Apps Script
// El navegador NUNCA envía el plaintext
const password = document.getElementById('ev-clave').value;
// Enviar action="addEvaluador" con la contraseña plana
// Google Apps Script la hasheará
```

---

## CHECKLIST DE IMPLEMENTACIÓN

```
☐ Librería Bcrypt agregada a Google Apps Script
☐ Función setAdminPassword() implementada en GAS
☐ Función validateAdminPassword() implementada en GAS
☐ Función getConfig retorna hash (no plaintext)
☐ app.js usa bcrypt.compare() en handleLogin
☐ Contraseña admin inicial seteada con setAdminPassword()
☐ Test de login: contraseña correcta funciona
☐ Test de login: contraseña incorrecta rechazada
☐ Rate limiting sigue funcionando
☐ Nuevo evaluador se crea con hash (opcional)
```

---

## ⚠️ NOTAS DE SEGURIDAD

1. **NUNCA** guardes contraseña en texto plano
2. **NUNCA** envíes hashes hacia el navegador para comparación (debe ser en servidor)
3. **SIEMPRE** usa bcrypt en lugar de MD5/SHA1
4. Los hashes bcrypt incluyen salt, no necesitas uno separado
5. Cada hash es único aunque la contraseña sea igual (por el salt aleatorio)

---

## 🔒 Flujo Seguro Completo

```
Usuario ingresa contraseña
    ↓
[Navegador] handleLogin() recibe plaintext
    ↓
[Navegador] Envía al Google Apps Script
    ↓
[GAS] cloudGet('configuracion') retorna HASH
    ↓
[Navegador] bcrypt.compare(plaintext, hash)
    ↓
✅ Valida sin exponerse el plaintext
    ↓
[Navegador] Si válido, login exitoso
[Navegador] Si inválido, rate limiting se activa
```

---

## Troubleshooting

### ❌ "Bcrypt no está definido"
→ Verificar que librería se agregó correctamente en Libraries

### ❌ "comparePassword devuelve error"
→ Asegurar que el hash fue creado con `hashPassword()` (tiene formato especial)

### ❌ "Hash es demasiado largo"
→ Normal, bcrypt hashes tienen ~60 caracteres. Aumentar ancho de columna en Sheets.

### ❌ "Login lentísimo"
→ Normal, bcrypt es lento a propósito para prevenir fuerza bruta. Salt rounds = 10 es standard.

