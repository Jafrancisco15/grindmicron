# Grind → Micrones (v2)

App simple y **offline** para convertir el tamaño de partículas de molienda en **micrones** a partir de fotos.

## Novedades v2
- Guarda la calibración de forma estable en **localStorage** (botón Guardar).
- Muestra **tamaño de archivo** y **progreso** al subir imágenes.
- **Auto-calibración**: detecta el espaciado típico entre marcas de **1 mm** dentro de un área (ROI) de la regla.
- **Manual 0–1 cm**: alternativa rápida si la auto-detección falla (haz click en 0 y en 1 cm).
- Segmentación de partículas con umbral, separación morfológica y filtro de tamaño.
- Cálculo de **D10/D50/D90**, media y **histograma**.
- Exporta **CSV** de diámetros (μm) y **PNG** con las medidas superpuestas.
