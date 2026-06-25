# 🧪 Instrucciones de Prueba - Medidas de Seguridad

## Resumen de lo que se implementó

### ✅ IMPLEMENTACIONES COMPLETADAS (HOY)

1. **Rate Limiting** - 5 intentos, 15 min lockout
2. **URL de Google Apps Script Protegida** - Extraída a config.js (no versionado)
3. **Funciones de Seguridad XSS** - escapeHTML, createSafeElement, setSafeHTML
4. **bcryptjs Integrado** - Listo para hash de contraseñas
5. **SRI en CDN Resources** - html2pdf con verificación de integridad
6. **Pruebas Automatizadas** - tests.security.js y tests.functional.js

---

## PRUEBA 1: Verificación Rápida (Visual) ⚡

### Paso 1: Abrir pruebas visuales
```
1. Abre en navegador: TEST_SECURITY.html
2. O navega a: http://localhost:8000/Calificaciones/TEST_SECURITY.html
```

### Paso 2: Verificar resultado
```
Deberías ver:
✅ CONFIG.js cargado correctamente
✅ SECURITY_CONFIG con valores correctos
✅ bcryptjs cargado desde CDN
✅ Google Apps Script URL configurada
✅ Rate Limiting (informativo)
...y más tests

Si ves 7+ tests verdes: ✅ FUNCIONA
```

---

## PRUEBA 2: Pruebas en Consola del Navegador 🖥️

### Paso 1: Abrir consola de desarrollador
```
Windows/Linux: F12 o Ctrl+Shift+I
Mac: Cmd+Option+I
```

### Paso 2: Ir a pestaña "Console"

### Paso 3: Ejecutar pruebas de seguridad
```javascript
runSecurityTests()
```

**Resultado esperado:**
```
=== PRUEBAS DE SEGURIDAD Y FUNCIONALIDAD ===
✅ CONFIG.js cargado correctamente
✅ GOOGLE_SCRIPT_URL usando CONFIG
✅ Funciones de seguridad existen
✅ escapeHTML sanitiza tags HTML
✅ Sistema de rate limiting inicializado
...
🎉 TODAS LAS PRUEBAS PASADAS
```

### Paso 4: Ejecutar pruebas funcionales
```javascript
runFunctionalTests()
```

**Resultado esperado:**
```
🧪 PRUEBAS FUNCIONALES DE SEGURIDAD
═════════════════════════════════════
✅ CONFIG cargado desde config.js
✅ bcryptjs disponible (dcodeIO.bcrypt)
✅ Funciones de seguridad disponibles
✅ escapeHTML previene XSS injection
✅ createSafeElement crea elementos seguros
✅ Sistema de rate limiting inicializado
...
🎉 ¡TODAS LAS PRUEBAS FUNCIONALES PASADAS!
```

---

## PRUEBA 3: Prueba de Rate Limiting (Interactiva) 🔐

### Objetivo: Verificar que el bloqueo funciona sin afectar acceso legítimo

### Paso 1: Login normal funciona
```
1. Abre: http://localhost:8000/Calificaciones/
2. Ingresa un RUT válido que existe en el sistema
3. Ingresa contraseña correcta
4. Debería entrar normalmente

✅ Si entra: La autenticación normal NO está afectada
```

### Paso 2: Rate limiting se activa
```
1. Abre nuevamente en otra pestaña/navegador
2. Ingresa RUT válido
3. Contraseña INCORRECTA (intenta deliberadamente)
4. Click en "Ingresar"
5. Deberías ver: "❌ Contraseña incorrecta. Intento 1/5"

✅ Visible: Rate limiting está registrando
```

### Paso 3: Contador incrementa
```
1. Repite paso 2 cuatro veces más (total 5 intentos fallidos)
2. En intento 1: "Intento 1/5 - 4 intentos restantes"
3. En intento 2: "Intento 2/5 - 3 intentos restantes"
4. En intento 3: "Intento 3/5 - 2 intentos restantes"
5. En intento 4: "Intento 4/5 - 1 intento restante"
6. En intento 5: "🔒 Máximo de intentos alcanzado. Bloqueado 15 minutos"

✅ Si funciona: Rate limiting está activo
```

### Paso 4: Bloqueo se aplica
```
1. Intenta login de nuevo INMEDIATAMENTE
2. Deberías ver: "⏳ Demasiados intentos fallidos. Intente en 15 minuto(s)"
3. El botón "Ingresar" no responde

✅ Si funciona: Bloqueo está implementado correctamente
```

### Paso 5: Reset manual (para testing)
```
Si quieres hacer el test de nuevo sin esperar 15 minutos:

1. Abre Consola (F12)
2. Ejecuta:
   delete loginAttempts['RUT_QUE_BLOQUEASTE']

3. Ahora puedes intentar de nuevo
```

---

## PRUEBA 4: Seguridad contra XSS 🛡️

### Paso 1: Verificar escapeHTML funciona
```javascript
// En la consola (F12):
escapeHTML("<script>alert('XSS')</script>")

// Resultado esperado:
"&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;"

✅ Si ves &lt; y &gt; en lugar de < y >: XSS prevenido
```

### Paso 2: Verificar createSafeElement funciona
```javascript
// En la consola:
const el = createSafeElement('div', '<img src=x onerror="alert(1)">', 'test');
console.log(el.textContent);
console.log(el.innerHTML);

// Resultado esperado:
// textContent: <img src=x onerror="alert(1)">
// innerHTML: &lt;img src=x onerror="alert(1)"&gt;

✅ Si innerHTML muestra &lt; no &gt;: Elemento seguro
```

---

## PRUEBA 5: Verificar config.js está protegido 📝

### Paso 1: Verificar que config.js no está en git
```bash
cd tu/proyecto
git status

# Resultado esperado:
On branch main
nothing to commit, working tree clean

# config.js NO debería aparecer

✅ Si config.js no aparece en git: Secretos protegidos
```

### Paso 2: Verificar .gitignore
```bash
cat .gitignore

# Debería contener:
config.js

✅ Si está listado: Configuración protegida
```

### Paso 3: Verificar que config.js existe localmente
```bash
ls config.js
# o en Windows:
dir config.js

# Debería mostrar el archivo

✅ Si existe: Configuración local lista
```

---

## PRUEBA 6: Funcionalidad General NO afectada ✨

### Objetivo: Asegurar que los cambios de seguridad NO rompieron funcionalidad

```
1. Abre http://localhost:8000/Calificaciones/
2. Prueba login normal
3. Prueba navegación entre vistas
4. Prueba crear/editar evaluaciones
5. Prueba descargar PDF
6. Prueba sincronizar con nube

✅ Si todo funciona igual: Cambios de seguridad son compatibles
❌ Si algo no funciona: Reportar en consola
```

---

## PRUEBA 7: Consola sin errores 🔍

### Paso 1: Abrir consola (F12)

### Paso 2: Buscar errores en rojo
```
- Cuando carga la página
- Cuando haces login
- Cuando sincronizas
- Cuando descargas PDF

✅ Si no hay mensajes rojos: Sin errores críticos
❌ Si ves errores: Revisar qué dice exactamente
```

### Paso 3: Ver mensajes informativos
```javascript
// Deberías ver algo como:
📱 Sistema de pruebas funcionales listo
🔬 Ejecuta: runFunctionalTests()
```

---

## CHECKLIST FINAL

Marca cada línea cuando verifies:

```
PRUEBAS BÁSICAS:
☐ TEST_SECURITY.html muestra 7+ tests verdes
☐ runSecurityTests() en consola pasa
☐ runFunctionalTests() en consola pasa

RATE LIMITING:
☐ 5 intentos se cuentan correctamente
☐ Bloqueo se activa en intento 6
☐ Mensaje de bloqueo muestra duración
☐ Login normal no es afectado

SEGURIDAD XSS:
☐ escapeHTML sanitiza &lt; y &gt;
☐ createSafeElement no ejecuta scripts
☐ Elementos creados son seguros

CONFIGURACIÓN:
☐ config.js existe localmente
☐ config.js NO aparece en git status
☐ .gitignore tiene config.js

FUNCIONALIDAD:
☐ Login funciona normalmente
☐ Navegación no es afectada
☐ Descargas de PDF funcionan
☐ Sincronización con nube funciona
☐ Consola sin errores críticos

RESUMEN:
☐ TODOS los puntos arriba verificados = ✅ SISTEMA SEGURO
```

---

## Troubleshooting

### ❓ "CONFIG no está definido"
```
→ Asegúrate de que config.js existe en la misma carpeta que index.html
→ Verifica que <script src="config.js"></script> está en index.html ANTES de app.js
```

### ❓ "bcryptjs no disponible"
```
→ Verifica conexión a internet (CDN bloqueado)
→ Abre DevTools > Network y busca bcrypt.min.js
→ Si falla, está siendo bloqueado (check antivirus/firewall)
```

### ❓ "Rate limiting no funciona"
```
→ Abre Consola (F12)
→ Ejecuta: console.log(loginAttempts)
→ Debería mostrar un objeto vacío {}
→ Si está vacío, intenta login 5 veces con contraseña falsa
```

### ❓ "Tests fallan"
```
→ Ejecuta en Consola: Object.keys(window)
→ Busca: escapeHTML, createSafeElement, handleLogin
→ Si no están, app.js no cargó completamente
→ Recarga la página con Ctrl+Shift+R (hard refresh)
```

---

## Contacto

¿Problemas durante las pruebas?
1. Abre consola (F12)
2. Ejecuta: `runFunctionalTests()`
3. Copia el resultado
4. Reporta en el comentario del commit

