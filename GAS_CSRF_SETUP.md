# 🛡️ Implementación de CSRF Tokens en Google Apps Script

## Objetivo
Proteger contra ataques de falsificación de solicitud entre sitios (CSRF/XSRF) en operaciones POST.

---

## ¿Qué es CSRF?

Un atacante crea un sitio falso que intenta ejecutar acciones en Google Sheets usando las credenciales del usuario logueado.

**Ejemplo de ataque CSRF:**
1. Usuario se loquea en tu app (google.com)
2. Usuario visita sitio malicioso (evil.com)
3. evil.com ejecuta solicitud POST a tu Google Apps Script usando credenciales del usuario
4. Los datos del usuario se modifican sin su consentimiento

**Prevención:** CSRF token único por sesión que debe incluirse en todos los POST.

---

## PASO 1: Almacenar Tokens en Google Apps Script

### En Code.gs, agregaempieza una sección para CSRF:

```javascript
/**
 * NUEVA SECCIÓN: Gestión de CSRF Tokens
 * Almacena tokens válidos y los valida en POST
 */

// Cache de sesión para tokens CSRF (se limpian al cerrar)
const csrfTokenStore = {};
const CSRF_TOKEN_EXPIRY_MS = 3600000; // 1 hora

function generateServerCSRFToken(sessionId) {
    /**
     * Genera un token CSRF único en el servidor
     * Nota: El navegador YA genera su propio token y lo envía
     * Este es un token complementario para mayor seguridad
     */
    const random = Utilities.getUuid();
    const timestamp = Date.now().toString();
    const token = Utilities.base64Encode(random + timestamp);

    csrfTokenStore[sessionId] = {
        token: token,
        timestamp: Date.now()
    };

    return token;
}

function validateCSRFToken(token, sessionId) {
    /**
     * Valida que el token CSRF es válido para esta sesión
     * Debe ser llamado ANTES de procesar cualquier POST
     */
    if (!token || !sessionId) {
        return false;
    }

    const stored = csrfTokenStore[sessionId];
    if (!stored) {
        return false;
    }

    // Verificar que el token coincide
    if (token !== stored.token) {
        return false;
    }

    // Verificar que no ha expirado
    if (Date.now() - stored.timestamp > CSRF_TOKEN_EXPIRY_MS) {
        delete csrfTokenStore[sessionId];
        return false;
    }

    return true;
}

function cleanExpiredCSRFTokens() {
    /**
     * Limpia tokens expirados (ejecutar periódicamente)
     * Puede agregarse como trigger de tiempo
     */
    const now = Date.now();
    Object.keys(csrfTokenStore).forEach(sessionId => {
        const stored = csrfTokenStore[sessionId];
        if (now - stored.timestamp > CSRF_TOKEN_EXPIRY_MS) {
            delete csrfTokenStore[sessionId];
        }
    });
}
```

---

## PASO 2: Validar CSRF en Función POST Principal

### En tu función doPost() o equivalente:

**ANTES (sin validación CSRF):**
```javascript
function doPost(e) {
    const body = JSON.parse(e.postData.contents);
    const { table, data, mode, clientVersion } = body;
    
    // Procesar datos directamente ❌ INSEGURO
    // Un atacante podría enviar desde sitio externo
}
```

**DESPUÉS (con validación CSRF):**
```javascript
function doPost(e) {
    const body = JSON.parse(e.postData.contents);
    const { table, data, mode, clientVersion, csrfToken, sessionId } = body;

    // VALIDACIÓN CSRF: Rechazar si token no válido
    if (!csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
        return ContentService.createTextOutput(
            JSON.stringify({
                success: false,
                error: 'CSRF token inválido o expirado'
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    // ✅ Token válido, procesar normalmente
    // ... resto de la función
}
```

---

## PASO 3: Incluir CSRF Token en Requests del Navegador

**YA ESTÁ HECHO EN app.js:**
```javascript
// El navegador genera token y lo incluye:
const body = {
    table,
    data: dataArray,
    csrfToken: csrfToken  // ✅ Incluido automáticamente
};
```

---

## PASO 4: Usar el Parámetro sessionId

### En el navegador, envía sessionId junto con token:

```javascript
// En app.js, agregar a funciones que hacen POST:
const sessionId = currentUser?.rut || 'admin'; // ID único del usuario

const body = {
    table,
    data: dataArray,
    csrfToken: csrfToken,
    sessionId: sessionId  // Agregar esto
};
```

### En Google Apps Script, recibir y validar:

```javascript
function doPost(e) {
    const body = JSON.parse(e.postData.contents);
    const { csrfToken, sessionId } = body;

    // Validar con sessionId
    if (!validateCSRFToken(csrfToken, sessionId)) {
        throw new Error('CSRF validation failed');
    }

    // Continuar con operación
}
```

---

## PASO 5: Generar Token Nuevo al Login

### En Google Apps Script, cuando el usuario inicia sesión:

```javascript
function doGet(e) {
    const action = e.parameter.action;

    // Cuando se autentica, generar nuevo token CSRF
    if (action === 'login' || action === 'authenticate') {
        const sessionId = e.parameter.sessionId; // Del navegador
        const csrfToken = generateServerCSRFToken(sessionId);

        return ContentService.createTextOutput(
            JSON.stringify({
                success: true,
                csrfToken: csrfToken  // Enviar al navegador
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}
```

### En app.js, recibir y guardar:

```javascript
// Después de login exitoso:
generateCSRFToken(); // Ya lo hace

// Podría también pedir uno nuevo del servidor:
fetch(`${GOOGLE_SCRIPT_URL}?action=getCSRFToken&sessionId=${currentUser.rut}`)
    .then(r => r.json())
    .then(data => {
        if (data.csrfToken) {
            csrfToken = data.csrfToken;
        }
    });
```

---

## PASO 6: Limpiar Token en Logout

### En el navegador (YA IMPLEMENTADO):
```javascript
function performLogout() {
    invalidateCSRFToken(); // ✅ Ya lo hace
}
```

### En Google Apps Script (opcional):
```javascript
function handleLogout(sessionId) {
    if (csrfTokenStore[sessionId]) {
        delete csrfTokenStore[sessionId];
    }
}
```

---

## FLUJO SEGURO COMPLETO

```
1. Usuario inicia sesión
   ├─ [Navegador] generateCSRFToken()
   └─ [GAS] generateServerCSRFToken(sessionId)

2. Usuario realiza operación (POST)
   ├─ [Navegador] Incluye csrfToken en body
   └─ [GAS] validateCSRFToken() antes de procesar

3. Atacante intenta CSRF
   ├─ [Atacante] No tiene csrfToken
   └─ [GAS] Rechaza con 'CSRF token inválido'

4. Usuario hace logout
   ├─ [Navegador] invalidateCSRFToken()
   └─ [GAS] delete csrfTokenStore[sessionId]

5. Usuario intenta reutilizar sesión antigua
   ├─ [GAS] csrfTokenStore está vacío
   └─ Solicitud rechazada
```

---

## CHECKLIST

```
☐ Sección de CSRF añadida a Code.gs
☐ validateCSRFToken() implementada
☐ doPost() valida CSRF antes de procesar
☐ Token se genera en login
☐ Token se envía en cada POST
☐ Token se invalida en logout
☐ Test: Login normal funciona
☐ Test: POST desde otro sitio es rechazado
☐ Token expira después de 1 hora
☐ Tokens expirados se limpian
```

---

## Troubleshooting

### ❌ "CSRF token inválido"
→ El token está expirado (> 1 hora)
→ Usuario nunca inició sesión
→ Limpiar cache del navegador (Ctrl+Shift+Delete)

### ❌ "sessionId es undefined"
→ Asegurar que currentUser está seteado en el navegador
→ Usar: `sessionId = currentUser?.rut || 'guest'`

### ❌ "csrfTokenStore es muy grande"
→ Ejecutar cleanExpiredCSRFTokens() regularmente
→ Agregar trigger de tiempo en GAS (cada 30 min)

### ✅ "Todo funciona"
→ Felicidades, CSRF está protegido

