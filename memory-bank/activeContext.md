# Estado Actual del Sistema

Última actualización: 2026-06-19

## Cambios recientes
- Se implementó el módulo de calificaciones históricas.
- Se añadió el check "HISTORICO" con selector de año dinámico en la asignación rápida.
- Se creó el tab "Históricos" en el panel de administración.
- Se agregó la store 'historicos' en IndexedDB con registro por ítem.
- Se implementó guardar/cargar histórico local y sincronización masiva a Google Sheets en formato de fila ancha.
- Se actualizó Code.gs para manejar encabezados fijos de la pestaña 'historicos'.

## Enfoque actual
- Verificar estabilidad del nuevo módulo histórico.
- Validar sincronización de históricos con Google Sheets.
- Validar recreación de IndexedDB v22 y existencia de stores 'historicos' y 'asigna_historico'.
- Validar guardado local de asignaciones históricas y sincronización con nube.
- Validar diálogo de resolución de conflictos al iniciar sesión como admin.
- Validar persistencia y recuperación de asignaciones históricas desde Google Sheets.
