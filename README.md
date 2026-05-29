# Sistema de Calificaciones

Frontend del Sistema de Calificaciones para Entidades de Asistencia Tecnica.

## 🚀 Despliegue en GitHub Pages

### Paso 1: Crear repositorio en GitHub
1. Ve a [github.com](https://github.com) e inicia sesion
2. Clic en "New repository"
3. Nombre: `sistema-calificaciones` (o el que prefieras)
4. Marca "Public" y clic en "Create repository"

### Paso 2: Subir archivos
Sube estos 3 archivos manteniendo la estructura:

```
sistema-calificaciones/
├── index.html          ← Raiz del repo
├── assets/
│   ├── app.js         ← Logica de la app
│   └── styles.css     ← Estilos responsive
```

**Opcion A - Subir manualmente:**
1. En GitHub, clic en "Add file" → "Upload files"
2. Arrastra los archivos manteniendo la carpeta `assets/`

**Opcion B - Con Git (recomendado para actualizaciones futuras):**
```bash
git clone https://github.com/TUUSUARIO/sistema-calificaciones.git
cd sistema-calificaciones
# Copia los archivos aqui
git add .
git commit -m "Version inicial"
git push origin main
```

### Paso 3: Activar GitHub Pages
1. En tu repo, ve a **Settings** (pestaña superior)
2. En el menu lateral izquierdo, clic en **Pages**
3. En "Source", selecciona **Deploy from a branch**
4. Selecciona **main** y carpeta **/(root)**
5. Clic en **Save**
6. Espera 1-2 minutos y recarga la pagina
7. Tu URL aparecera arriba: `https://TUUSUARIO.github.io/sistema-calificaciones- /`

### Paso 4: Actualizar el backend (Google Apps Script)

Tu backend de GAS debe aceptar peticiones desde tu nuevo dominio de GitHub Pages.

En tu Google Apps Script, asegurate de que `doPost` y `doGet` incluyan:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    // Parsear el body (viene como text/plain)
    var params = JSON.parse(e.postData.contents);
    var action = params.action;

    // ... tu logica aqui ...

    return jsonResponse({success: true});

  } catch(err) {
    return jsonResponse({error: err.toString()});
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = e.parameter.action;
  // ... tu logica aqui ...
  return jsonResponse({data: 'respuesta'});
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

**Importante:** En tu Apps Script, ve a **Deploy → Manage deployments → Web app** y asegurate de que:
- "Execute as" este en **Me**
- "Who has access" este en **Anyone**

## 🔄 Actualizar el frontend despues del despliegue

Para hacer cambios posteriores:

1. **Edita los archivos** en tu computadora
2. **Sube los cambios** con Git:
   ```bash
   git add .
   git commit -m "Descripcion del cambio"
   git push origin main
   ```
3. **GitHub Pages se actualiza automaticamente** en 1-2 minutos
4. **Recarga la pagina** en el navegador (Ctrl+F5 para forzar)

## ✅ Verificar que todo funciona

1. Abre tu URL de GitHub Pages
2. Presiona **F12** → pestaña **Console**
3. Intenta hacer login como ADMIN
4. Debe aparecer la barra de progreso (overlay oscuro con spinner)
5. Si funciona, veras el panel de administracion

## 🐛 Solucion de problemas

| Problema | Solucion |
|----------|----------|
| Pagina en blanco | Verifica que los archivos esten en la ruta correcta |
| CORS error | Asegurate de que tu GAS tenga `Access-Control-Allow-Origin: *` |
| "ACCION POST NO VALIDA" | Verifica que el Content-Type sea `text/plain` en el POST |
| Cambios no aparecen | Espera 2 minutos y recarga con Ctrl+F5 |
| Login admin no funciona | Escribe exactamente "ADMIN" (mayusculas) |

## 📁 Estructura de archivos

```
assets/
  app.js      - Logica principal (login, evaluador, admin, reportes)
  styles.css  - Estilos responsive (mobile, tablet, desktop)
index.html    - Estructura HTML de todas las pantallas
```

## 🔧 Fixes aplicados en esta version

1. **POST Content-Type: text/plain** - Evita preflight CORS en Google Apps Script
2. **Login ADMIN preservado** - `normalizarRUT()` mantiene "ADMIN" en mayusculas
3. **Barra de progreso** - Spinner en todas las operaciones async
4. **Responsive completo** - Se adapta a mobile, tablet y desktop
5. **Pantalla completa** - Ocupa 100% del viewport
