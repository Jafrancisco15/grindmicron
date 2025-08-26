# Grind → Micrones v2.1.1

App web **estática** para estimar distribución de tamaños (μm) de molienda de café desde fotos.
Funciona **offline**: abre `app/index.html` (multi-archivo) o `single/index.html` (todo en un archivo).

## Cambios v2.1.1
- Franja amarilla en **todas** las secciones.
- Color de acento: `#eab308` (amarillo medio) en botones, overlays y barras.
- Tipografía **Poppins** (Google Fonts) para todo el documento.
- Mantiene lo de v2.1: **Zoom/Pan**, **ROIs múltiples**, **umbral** (Percentil / **Otsu**), ignorar objetos en **borde**, exportar **CSV** y **PNG**.

## Calibración (paso 1)
1. Sube una foto de **regla**.
2. Dibuja un ROI sobre una sección clara de la regla.
3. Pulsa **Auto-calibrar (1 mm)** o **Manual 0–1 cm** (dos clics).
4. **Guardar** para persistir en `localStorage` (se reutiliza en el paso 2).

## Análisis (paso 2)
1. Sube foto de **molienda** (esparcida como polvillo, buena luz y enfoque).
2. Usa **🖱️ Zoom/Pan** para navegar.
3. **➕ Nueva área** para dibujar uno o varios ROIs en zonas con partículas (se ignora el resto).
4. Elige **Otsu** si el fondo no es uniforme; ajusta **Separación** y **Tamaño mínimo** si hay grumos.
5. Marca **Ignorar objetos en borde** para no medir partículas cortadas.
6. Pulsa **Calcular**. Verás D10, D50, D90, media y el histograma.
7. **Exportar CSV** (diámetros individuales en μm) o **Descargar PNG** (overlay con mediciones).

## Estructura
- `app/` → versión multi-archivo (HTML + CSS + JS).
- `single/` → versión **archivo único** (`index.html`).
- `assets/` → imágenes de ejemplo (siempre que se hayan incluido en esta build).

## Hosting
Es un proyecto estático. Puedes subir `app/` o `single/` a cualquier hosting (Vercel/Netlify/GitHub Pages) sin build.
Para frameworks (Vite/Next), coloca los archivos en `/public`.

## Créditos
Hecho con ❤️ para **Escuela de Café**.
