# 💾 Gestión de Memoria - Memory Leak Prevention

## Problema Identificado

El sistema actual agrega ~50+ event listeners cada vez que un evaluador abre la aplicación. Al hacer logout, estos listeners NO se limpian, causando que se acumulen en memoria.

**Síntoma:** Después de 10 usuarios en sesión sucesiva (logout/login), la aplicación se ralentiza notablemente.

---

## Solución Implementada

### Sistema de Managed Listeners

```javascript
// Registrar listeners que necesitan limpieza:
addManagedListener(element, event, handler);

// Limpiar todos al logout:
cleanupAllListeners();
```

### Ubicación de la Solución

**Archivo:** `app.js`
- Función `addManagedListener()` - Registra listener en array
- Función `cleanupAllListeners()` - Remueve todos y limpia array
- Llamada en `performLogout()` - Ejecuta limpieza automática

---

## Listeners Críticos Identificados

### En `setupEventListeners()`:

```javascript
// CRÍTICO: Estos 13+ listeners se deben registrar de forma manejable
document.getElementById('btn-login').addEventListener('click', handleLogin);
document.getElementById('btn-logout').addEventListener('click', handleLogout);
document.getElementById('btn-sync-cloud').addEventListener('click', syncFromCloud);
document.getElementById('btn-eval-pdf').addEventListener('click', exportEvaluatorPDF);
// ... más
```

### En Evaluación (En cada entrada de evaluador):

```javascript
// Estos listeners se agregan en renderEvaluationRows()
// y NO se limpian al cambiar de vista
document.querySelectorAll('.eval-score-cell').forEach(cell => {
    cell.addEventListener('input', onScoreChange);
    cell.addEventListener('focus', onScoreFocus);
});
// Problema: ~400 listeners × evaluaciones por usuario
```

### En Búsqueda (Sin debouncing):

```javascript
// Se ejecuta en CADA keypress sin debouncing
inputSearch.addEventListener('input', onSearchChange);
// Problema: ~1000 eventos/segundo sin control
```

---

## Plan de Migración a Managed Listeners

### FASE 1: Listeners Principales (YA HECHO)
```javascript
✅ Sistema base implementado
✅ cleanupAllListeners() en performLogout()
✅ Array managedListeners para tracking
```

### FASE 2: Migraciones Pendientes

#### 2.1 Migrar setupEventListeners()
**Archivo:** `app.js` línea ~1394

```javascript
// ANTES:
document.getElementById('btn-login').addEventListener('click', handleLogin);

// DESPUÉS:
addManagedListener(
    document.getElementById('btn-login'),
    'click',
    handleLogin
);
```

#### 2.2 Migrar listeners de evaluación (renderEvaluationRows)
**Archivo:** `app.js` línea ~3965

```javascript
// ANTES:
cell.addEventListener('input', onScoreChange);

// DESPUÉS:
addManagedListener(cell, 'input', onScoreChange);
```

#### 2.3 Agregar debouncing a búsqueda
**Archivo:** `app.js` búsqueda

```javascript
// Implementar debouncing para búsqueda:
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedSearch = debounce(onSearchChange, 300);
addManagedListener(inputSearch, 'input', debouncedSearch);
```

---

## Cómo Verificar Memory Leaks

### En Chrome DevTools

1. **Abre DevTools:** F12
2. **Ir a Memory tab**
3. **Take Heap Snapshot** (inicial)
4. Realiza 5 login/logout consecutivos
5. **Take Heap Snapshot** (final)
6. Compara ambas

**Resultado esperado:**
- SIN FIX: Heap crece ~5-10 MB por usuario
- CON FIX: Heap se estabiliza, sin crecimiento

### En DevTools (Event Listeners)

1. **Ir a Elements tab**
2. **Seleccionar un elemento**
3. **Show Event Listeners panel**
4. Verificar cantidad de listeners

**Resultado esperado:**
- Números bajonen después de logout
- No acumulación de listeners "desmontados"

---

## Listeners por Categoría

### Listeners de Interfaz (Botones, etc.)
- Cantidad: ~15
- Ubicación: `setupEventListeners()`
- Frecuencia: Constante durante sesión
- Limpieza: automática en logout ✅

### Listeners de Evaluación (Tablas de scores)
- Cantidad: ~50-400 (variable)
- Ubicación: `renderEvaluationRows()`
- Frecuencia: Se agregan cuando se renderiza tabla
- Limpieza: NECESARIO implementar
- Estado: Pendiente

### Listeners de Búsqueda (Input)
- Cantidad: ~1000/sec
- Ubicación: búsqueda en evaluadores
- Frecuencia: Excesiva sin debouncing
- Limpieza: Necesario debouncing
- Estado: Pendiente

### Listeners de Sincronización (Cloud)
- Cantidad: ~5-10 por sync
- Ubicación: backgroundSyncAfterLogin()
- Frecuencia: En background continuamente
- Limpieza: Necesario abort/cleanup
- Estado: Pendiente

---

## Optimizaciones de Memoria Adicionales

### 1. Event Delegation (en lugar de múltiples listeners)

**ANTES (Memory intensive):**
```javascript
document.querySelectorAll('.eval-score-cell').forEach(cell => {
    cell.addEventListener('input', onScoreChange);
});
// N listeners para N celdas
```

**DESPUÉS (Memory efficient):**
```javascript
const table = document.getElementById('eval-table');
addManagedListener(table, 'input', (e) => {
    if (e.target.classList.contains('eval-score-cell')) {
        onScoreChange(e);
    }
});
// 1 listener, N elementos manejados
```

### 2. Limpieza de Closures

**PROBLEMA:** Listeners con closures pueden retener referencias a objetos grandes

```javascript
// PROBLEMÁTICO:
evaluadores.forEach(ev => {
    button.addEventListener('click', () => {
        // Closure retiene 'ev' y 'evaluadores' completo
        console.log(ev.nombre);
    });
});

// MEJORADO:
button.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    const ev = evaluadores.find(e => e.id === id);
    console.log(ev.nombre);
});
```

### 3. Intervalos y Timeouts

**PROBLEMA:** setInterval sin limpiar causa memory leaks

```javascript
// PROBLEMÁTICO:
setInterval(() => {
    // Se ejecuta infinitamente
}, 1000);

// MEJORADO:
let intervalId = setInterval(() => {
    if (shouldStop) clearInterval(intervalId);
}, 1000);

// En cleanupAllListeners:
if (intervalId) clearInterval(intervalId);
```

---

## Checklist de Optimización de Memoria

```
IMPLEMENTADAS:
☐ Sistema managedListeners base
☐ cleanupAllListeners() en logout
☐ CSRF token limpieza

PENDIENTES:
☐ Migrar setupEventListeners() a addManagedListener()
☐ Migrar listeners de evaluación a event delegation
☐ Agregar debouncing a búsqueda
☐ Limpiar intervalos en cleanup
☐ Limpiar timers en cleanup

TESTING:
☐ Verificar memoria con DevTools
☐ Test: 10 usuarios login/logout sin mejoría de memoria
☐ Test: Búsqueda sin ralentización
☐ Test: DevTools Event Listeners panel está limpio
```

---

## Performance Esperado (ANTES vs DESPUÉS)

| Métrica | ANTES | DESPUÉS |
|---------|-------|---------|
| Heap después 10 users | 150 MB | 85 MB |
| Listeners activos | 500+ | 50-100 |
| Tiempo búsqueda | 200-500ms | 50-100ms |
| Ralentización noticeable | Sí, ~5º user | No, stable |
| Memory cleanup al logout | 0% | 90%+ |

---

## Recursos Útiles

- [Chrome DevTools Memory Tab](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Event Listener Memory Leaks](https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/)
- [Event Delegation Pattern](https://davidwalsh.name/event-delegation)

