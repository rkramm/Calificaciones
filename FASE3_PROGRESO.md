# FASE 3 - Progreso y Pendientes

## Estado Actual: PARCIALMENTE COMPLETA

---

## ✅ COMPLETADOS EN FASE 3

### 1. Bcrypt en Cliente
- [x] dcodeIO.bcrypt integrado
- [x] Validación con bcrypt.compareSync()
- [x] Admin login usa bcrypt hash

### 2. CSRF Tokens Completados
- [x] Cliente genera token único
- [x] Validación de expiración (1 hora)
- [x] SessionID agregado a POST requests
- [x] Token incluido en cada POST

### 3. Event Listeners Migrados (PARCIAL)
- [x] setupEventListeners() usa addManagedListener()
- [x] ~15 listeners principales migrados
- ⏳ Faltan algunos listeners en la misma función

### 4. Mobile 404 Fixed
- [x] 404.html para redirección GitHub Pages
- [x] getBasePath() para resolución de rutas
- [x] BASE_PATH variable global

### 5. Google Apps Script - Código Listo
- [x] GAS_IMPLEMENTATION_CODE.js (copiar/pegar)
- [x] setAdminPasswordBcrypt()
- [x] validateCSRFToken(), generateServerCSRFToken()
- [x] cleanExpiredCSRFTokens()

---

## ⏳ PENDIENTES EN FASE 3

### 1. Completar setupEventListeners() Migration

**Ubicación:** app.js línea ~1466-1600 (aprox)

**Listeners restantes sin migrar:**
```javascript
// FALTAN ESTOS (aún con addEventListener directo):
document.getElementById('btn-save-entidad-modal').addEventListener('click', saveEntidad);
document.getElementById('btn-open-asignacion-modal').addEventListener('click', ...);
// ... más listeners en formularios
```

**Estimación:** 20-30 min

---

### 2. Revisar + Reemplazar innerHTML Restantes

**Total actual:** 67 usos de innerHTML
**Reemplazados:** ~5 críticos
**Pendientes:** ~62

**Estrategia:**
- [ ] Identificar cuáles tienen variables de usuario
- [ ] Reemplazar críticos con createTableRow()
- [ ] Dejar los HTML constantes como están
- [ ] Usar escapeHTML() donde sea necesario

**Estimación:** 1-2 horas

---

### 3. Memory Cleanup - Completar

**Estado actual:**
- [x] Sistema base implementado
- [x] cleanupAllListeners() en logout
- ⏳ No todos los listeners están registrados

**Pendientes:**
- [ ] Migrar REST de listeners a addManagedListener()
- [ ] Agregar debouncing a búsqueda
- [ ] Limpiar intervalos/timeouts
- [ ] Test con DevTools memory profiler

**Estimación:** 1 hora

---

### 4. Documentación - Encoding Issues

**Problema:** Caracteres especiales (emojis) causando errores

**Archivos afectados:**
- SECURITY.md
- INSTRUCCIONES_PRUEBA.md
- DETALLES_REVISION.md
- RESUMEN_SEGURIDAD.md

**Solución:** Verificar encoding UTF-8 sin BOM

**Estimación:** 30 min

---

## ❓ PREGUNTAS DEL USUARIO - RESPUESTAS

### 1. Data Versioning - ¿Qué es?

**Data Versioning = Manejo de conflictos cuando 2 usuarios editan lo mismo**

**Ejemplo del problema:**
```
Usuario A: Abre proyecto X (score = 75)
Usuario B: Abre proyecto X (score = 75)

Usuario A: Cambia a 80, GUARDA
Usuario B: Cambia a 90, GUARDA

¿Resultado?
- Opción 1: Se pierde cambio de A (último gana) ❌
- Opción 2: Se guarda ambos (merge inteligente) ✅
- Opción 3: Conflicto, usuario elige (complejo) ⚠️
```

**Cómo implementar versioning:**
```javascript
// Agregar versión a cada dato:
{
    projectId: "P123",
    score: 80,
    version: 2,        // Versión del dato
    lastModified: "2026-06-25T10:30:00Z",
    modifiedBy: "user@mail.com"
}

// Al guardar, enviar versión anterior:
POST {
    table: "scores",
    data: [...],
    expectedVersion: 1  // "Esperaba versión 1"
}

// Servidor responde:
{
    success: true,
    newVersion: 2
}
// O si hay conflicto:
{
    success: false,
    error: "Version conflict",
    currentVersion: 3,   // Alguien más actualizó
    remoteData: {...}    // El dato actual en servidor
}
```

**¿Es necesario?**
- Si: Múltiples usuarios editando MISMO proyecto simultáneamente
- No: Si típicamente solo 1 usuario a la vez

**Tu caso:** Probablemente NO es crítico (usuarios diferentes = proyectos diferentes)

---

### 2. Logout Cleanup - Sugerencia

**Qué limpiar / Qué mantener:**

```javascript
// LIMPIAR DEFINITIVAMENTE:
- currentUser = null
- currentRole = null
- csrfToken = null
- Event listeners (ya lo hace)
- Intentos fallidos de login
- Sesión CSRF en GAS

// MANTENER PARA PRÓXIMO USUARIO:
- Configuración del sistema (entidades, programas)
- Datos de evaluadores (no son personales)
- Proyectos históricos (datos públicos)
- Scores/calificaciones (PERO solo del usuario que se va)

// PARCIAL (según política):
- IndexedDB cache (¿mantener para offline?)
- Últimas búsquedas (¿usufructo privacidad?)
- Tamaño de columnas (¿perso/sistema?)
```

**Recomendación:**
```javascript
// En performLogout() agregar:
dbClearByUser(currentUser.rut);  // Limpiar scores de este usuario
// PERO mantener tablas generales
```

---

### 3. Encoding en Documentación

**Problema:** Emojis y caracteres especiales pueden causar error

**Archivos a revisar:**
- RESUMEN_SEGURIDAD.md (muchos emojis)
- INSTRUCCIONES_PRUEBA.md (símbolos)
- GAS_BCRYPT_SETUP.md (verificar)

**Verificar con:**
```bash
file -i RESUMEN_SEGURIDAD.md
# Debe mostrar: charset=utf-8
```

**Si falla:**
```bash
# Convertir a UTF-8 limpio:
iconv -f ISO-8859-1 -t UTF-8 archivo.md > archivo_fixed.md
```

---

## 📋 CHECKLIST - QUÉ HACER AHORA

```
INMEDIATO (30 min):
[ ] Leer GAS_IMPLEMENTATION_CODE.js
[ ] Copiar código a Google Apps Script
[ ] Ejecutar setupBcryptInitial()
[ ] Test: Login funciona con bcrypt

HOJA (1-2 horas):
[ ] Completar setupEventListeners()
[ ] Verificar encoding de .md files
[ ] Revisar innerHTML críticos

ESTA SEMANA (2-3 horas):
[ ] Test completo de memoria (DevTools)
[ ] Resolver innerHTML restantes
[ ] Data versioning (solo si necesitas)

FINAL:
[ ] Test completo end-to-end
[ ] Pruebas en mobile (404 debería estar fijo)
[ ] Verificar CSRF en GAS funciona
```

---

## 🚀 PRÓXIMO PASO RECOMENDADO

1. **Abre Google Apps Script**
2. **Lee:** `GAS_IMPLEMENTATION_CODE.js` (en tu proyecto local)
3. **Copia:** Todos los CODE snippets a Code.gs
4. **Ejecuta:** setupBcryptInitial()
5. **Test:** Login debe funcionar

**Tiempo:** 15-20 min

**Si tienes dudas:** Hay comentarios en el código explicando cada sección

---

## ESTADO FINAL

```
FASE 1: Seguridad Crítica        ✅ COMPLETA
FASE 2: Protección Contra Ataques ✅ COMPLETA
FASE 3: GAS + Migración          ⏳ 70% COMPLETA

Blockers: Ninguno
Tiempo restante estimado: 3-4 horas
```

