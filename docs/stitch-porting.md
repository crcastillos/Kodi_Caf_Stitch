# Portar pantallas desde Stitch

Workflow para agentes al traer contenido del [proyecto Stitch 9014673166241808888](https://stitch.withgoogle.com/projects/9014673166241808888?pli=1) al código de este repo.

## Mapa pantalla Stitch → ruta app

| Pantalla Stitch | Ruta hash | Estado en repo |
|-----------------|-----------|----------------|
| ¿Qué está pasando? | `#/inicio` | Placeholder |
| Dashboard Principal | `#/inicio` | Placeholder |
| Así está tu finca hoy | `#/inicio` | Placeholder |
| Monitoreo Agroclimático Cafetalero | `#/inicio` | Placeholder |
| Mi finca | `#/mi-finca` | Placeholder |
| Registro de Finca | `#/mi-finca` | Placeholder |
| Simulador Climático | `#/simular` | Placeholder |
| Asistente CafIA | `#/asistente` | Placeholder |
| Análisis de Riesgo | `#/riesgos` | Vista CAF-102 |
| Plan de Acción | — | Sin ruta |
| Recomendaciones Preventivas | — | Sin ruta |
| CafIA Logo | — | Referencia de marca |
| Retratos / assets sueltos | — | Usar en `assets.js` o `public/` |

Lista extendida (IDs): ver [`.cursor/skills/cafia-stitch-design/reference.md`](../.cursor/skills/cafia-stitch-design/reference.md) si existe.

## Pasos de portado

1. **Identificar** pantalla en Stitch y la ruta hash destino (tabla arriba).
2. **Obtener HTML**
   - Stitch MCP: `list_screens` con `project_id: 9014673166241808888`, luego URL `htmlCode.downloadUrl`.
   - O export manual desde la UI de Stitch.
3. **Limpiar el export** — eliminar del HTML:
   - `<script src="https://cdn.tailwindcss.com">` y bloque `tailwind.config`
   - `<aside>...</aside>` (sidebar)
   - `<header>` fijo duplicado del mock
   - `<html>`, `<head>`, `<body>` wrappers — quedarse con el contenido de `<main>` o equivalente
4. **Implementar** en `src/pages/<nombre>.js`:
   - `export function render<Nombre>(...) { return \`...\`; }`
   - Mantener clases Tailwind del export; tokens ya existen vía `@theme`
5. **Integrar** en [`src/pages/shell.js`](../src/pages/shell.js) o mapa en [`src/pages/placeholders.js`](../src/pages/placeholders.js) → sustituir placeholder por `render<Nombre>()`.
6. **Router** — la ruta ya está en [`src/config/navigation.js`](../src/config/navigation.js); solo cambia el contenido del main.
7. **Verificar** visualmente con `pnpm dev`.

## Checklist de calidad

- [ ] Sidebar sigue siendo el de `sidebar.js` (un solo aside en la app)
- [ ] Ítem de nav correcto marcado activo para la ruta
- [ ] Sin colores hex sueltos que dupliquen tokens (usar `text-primary`, `bg-surface`, etc.)
- [ ] Textos en español
- [ ] `pnpm build` sin errores

## Stitch MCP (editores compatibles)

Endpoint remoto: `https://stitch.googleapis.com/mcp` (autenticación con API key en config local del usuario, **no** en el repo).

Herramientas útiles:

- `list_screens` — listar pantallas y URLs de HTML
- `get_screen` — metadatos de una pantalla
- `fetch_screen_code` — código/HTML cuando esté disponible vía tool

Si el editor muestra “0 tools” con Stitch conectado, es un límite conocido del cliente; usar export manual o proxy documentado en foros de Cursor.

## Login

No portar login desde Stitch (no existe). Mantener [`src/pages/login.js`](../src/pages/login.js) y [design-system.md](design-system.md) para formularios.
