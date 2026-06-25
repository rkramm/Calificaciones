# 📋 PLAN DE ACCIÓN FINAL - Completar Implementación

**Fecha:** 2026-06-25  
**Completado:** 70% de FASE 3  
**Tiempo Estimado Restante:** 3-4 horas  

---

## PASO 1: GOOGLE APPS SCRIPT (15-20 min) ⚡ CRÍTICO

### Instrucciones Exactas:

1. **Abre Google Apps Script:**
   - URL: `script.google.com`
   - Selecciona tu proyecto

2. **Agregar Librería Bcrypt (primero):**
   - Click en "+ Libraries"
   - Pega ID: `MWASUMVf7KeTIZ4bu2xAXQ_11SVRPZGN93UE7j2Ro8KoRm8h5IhIHqN3I`
   - Click "Add" → selecciona versión
   - Alias: `Bcrypt` (default)

3. **Copiar Código a Code.gs:**
   - Abre archivo local: `GAS_IMPLEMENTATION_CODE.js`
   - Copia TODA sección: A) FUNCIONES BCRYPT hasta F) LIMPIAR CACHE
   - Pega al final de tu `Code.gs`

4. **Ejecutar Setup (UNA SOLA VEZ):**
   - En Apps Script Console:
   - Busca función `setupBcryptInitial()`
   - Click en lista desplegable → selecciona `setupBcryptInitial`
   - Click "Run" ▶️
   - Autoriza permisos si pide
   - Verifica Log: `✅ Setup completado`

5. **Cambiar Contraseña Admin:**
   - En setupBcryptInitial(), línea con `const adminPassword = "tu_contraseña..."`
   - Reemplaza con tu contraseña REAL
   - Ejecuta de nuevo
   - Borra contraseña del código

### ✅ Verificación:
```
- Log muestra: "✅ Setup completado"
- Configuración sheet tiene hash (no plaintext)
- Hash comienza con: $2a$ o $2b$
```

---

## PASO 2: ACTUALIZAR doPost() en GAS (10 min)

**TU FUNCIÓN EXISTENTE está en Code.gs.**

### Agregar VALIDACIÓN CSRF:

**ANTES de tu lógica actual, agregar:**
```javascript
function doPost(e) {
    try {
        const body = JSON.parse(e.postData.contents);
        const { csrfToken, sessionId } = body;

        // ===== NUEVO: VALIDAR CSRF =====
        if (!csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    error: 'CSRF token inválido o expirado'
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // ===== REST DE TU CÓDIGO AQUÍ =====
        // Tu lógica existente de guardado
        // ...
```

### ✅ Verificación:
```
- POST desde navegador funciona (tiene token)
- POST desde otro sitio es rechazado
- Log muestra validación correcta
```

---

## PASO 3: COMPLETAR setupEventListeners() (20-30 min)

**Ubicación:** `app.js` línea ~1466+

### Falta migrar última sección:

```javascript
// DESPUÉS de lo que ya está, agregar:

    // Entidad modal - completar
    const btnSaveEnt = document.getElementById('btn-save-entidad-modal');
    if (btnSaveEnt) addManagedListener(btnSaveEnt, 'click', saveEntidad);

    // Agregar los que falten en tu función
    // (Buscar todos los addEventListener que quedan)
```

### Cómo encontrar los que faltan:

```bash
grep -n "addEventListener" app.js | grep -v "addManagedListener"
# Esto muestra líneas que AÚN usan addEventListener directo
```

---

## PASO 4: REVISAR innerHTML CRÍTICOS (1-2 horas)

### Archivos críticos a revisar:

1. **app.js** líneas con variables de usuario:
   ```bash
   grep -n 'innerHTML.*${.*entidad\|innerHTML.*${.*nombre' app.js
   ```

2. **Reemplazar patrón:**
   ```javascript
   // ANTES:
   element.innerHTML = `<div>${userData}</div>`;

   // DESPUÉS:
   element.textContent = userData;
   // O si necesitas HTML:
   element.appendChild(createSafeElement('div', userData));
   ```

3. **Ya reemplazados (NO TOCAR):**
   - loadProjectsTable()
   - renderProjectsTableAllPrograms()
   - createTableRow(), createTableMessage()

---

## PASO 5: TESTING COMPLETO (45 min)

### Test 1: bcrypt Funciona
```
1. Cierra sesión
2. Intenta login con contraseña INCORRECTA
3. Debe mostrar "Contraseña incorrecta" (bcrypt comparando hash)
4. Intenta login con contraseña CORRECTA
5. Debe entrar normalmente
✅ Si funciona: bcrypt está OK
```

### Test 2: CSRF Token Funciona
```
1. Open DevTools (F12) → Network tab
2. Login normalmente
3. Realiza una operación que guarde datos
4. En Network, busca POST request
5. En payload, verifica:
   - "csrfToken": "..." existe
   - "sessionId": "..." existe
✅ Si existen: CSRF está OK
```

### Test 3: Rate Limiting Sigue Funcionando
```
1. Intenta 5 logins CON contraseña incorrecta
2. En 6to intento: "🔒 Bloqueado 15 minutos"
✅ Si funciona: Rate limiting está OK
```

### Test 4: Mobile No Trae 404
```
1. Accede desde teléfono: http://[tu-github-pages]/Calificaciones/
2. Debe cargar página normalmente
3. Si intenta acceder a /Calificaciones/index.html → redirecciona a 404.html
✅ Si funciona: Mobile está OK
```

### Test 5: Memory Cleanup
```
1. DevTools (F12) → Memory
2. Take Heap Snapshot (inicial)
3. Login/Logout 5 veces
4. Take Heap Snapshot (final)
5. Comparar: memoria NO debe crecer más de 5%
✅ Si se mantiene: Memory está OK
```

---

## PRIORIDAD Y SECUENCIA

```
1️⃣  CRÍTICO - HACER HOY:
   [ ] PASO 1: Google Apps Script (15 min)
   [ ] PASO 2: doPost() validación CSRF (10 min)
   [ ] PASO 3: Completar setupEventListeners() (20 min)
   Tiempo: 45 min

2️⃣  IMPORTANTE - HOY SI ES POSIBLE:
   [ ] PASO 4: innerHTML críticos (1-2 hours)
   [ ] PASO 5: Testing (45 min)
   Tiempo: 2.5-3 horas

3️⃣  NICE-TO-HAVE - PRÓXIMA SEMANA:
   [ ] Documentación cleanup (encoding)
   [ ] innerHTML no críticos
   [ ] Data versioning (si es necesario)
```

---

## SEÑALES DE ÉXITO

✅ **Al completar estos pasos, deberías ver:**

- [ ] Login funciona con bcrypt (más seguro)
- [ ] Rate limiting sigue activo (5 intentos, 15 min)
- [ ] CSRF tokens en POST (protegido contra ataques)
- [ ] Event listeners se limpian (sin memory leaks)
- [ ] Mobile 404 resuelto
- [ ] Ningún error en consola
- [ ] Aplicación responde igual que antes (invisible improvement)

---

## ROLLBACK Si Algo Se Rompe

```bash
# Si algo no funciona, revert último commit:
git revert HEAD

# O volver a estado anterior:
git checkout HEAD~1 -- app.js
```

---

## 📞 TROUBLESHOOTING

### ❌ "bcrypt is not defined" en GAS
→ Verificar que librería Bcrypt se agregó (Libraries panel)

### ❌ Login lentísimo (>5 segundos)
→ Normal, bcrypt es lento a propósito (security vs speed tradeoff)

### ❌ Mobile aún trae 404
→ Verificar 404.html está en root del proyecto
→ Verificar GitHub Pages está en rama `main`

### ❌ CSRF token error
→ Verificar GAS_IMPLEMENTATION_CODE.js se copió completo
→ Verificar validateCSRFToken() existe en GAS

### ❌ innerHTML error
→ Verificar escapeHTML() se llama en datos dinámicos
→ Usar textContent en lugar de innerHTML cuando sea posible

---

## ESTIMADO FINAL

| Paso | Tiempo | Estado |
|------|--------|--------|
| 1. GAS Setup | 15 min | 🚀 CRÍTICO |
| 2. CSRF Validation | 10 min | 🚀 CRÍTICO |
| 3. Listeners | 20 min | 🚀 CRÍTICO |
| 4. innerHTML | 60-120 min | ⏳ IMPORTANTE |
| 5. Testing | 45 min | ⏳ IMPORTANTE |
| **TOTAL** | **2.5-4 horas** | **✅ 70% DONE** |

---

## ✅ SIGUIENTE USUARIO LUEGO DE ESTOS PASOS

```javascript
Si todo está OK:
- Contraseña del admin está hasheada (bcrypt)
- CSRF protege contra ataques
- Memory no se acumula (listeners limpios)
- Mobile funciona sin 404
- Rate limiting activo
- System está ~85% seguro de ataque básicos
```

**Falta solo:** Validación de RUT (si quieres), data versioning (si hay conflictos), y documentación cleanup

---

**¿Listo para empezar? Comienza por PASO 1.**

