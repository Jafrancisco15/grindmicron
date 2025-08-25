# Grind → Microns (Demo Web App)

App web para estimar el tamaño de partícula (μm) de una molienda de café a partir de una foto,
usando **OpenCV.js** en el navegador. Incluye:
- Calibración por imagen con regla (clic en dos puntos y distancia real en mm)
- Análisis de la molienda (umbral Otsu + morfología + contornos)
- Cálculo de distribución (histograma), D10/D50/D90, Span, CoV, % de finos/gruesos
- Historial local con exportación CSV

## Requisitos
- Node 18+
- Navegador moderno (soporta WebAssembly)

## Instalación
```bash
npm install
npm run dev
```

## Deploy en Vercel
1. Sube este repo a GitHub.
2. Importa el repo en Vercel como proyecto **Vite (React)**.
3. No requiere variables de entorno ni backend.
4. OpenCV.js se carga desde CDN: `https://docs.opencv.org/4.x/opencv.js`.
   > Si tu hosting bloquea recursos de terceros, puedes servir opencv.js localmente y configurar `cv.Module.locateFile`.

## Uso
1. Ve a **Calibración** y sube una foto de una regla.
2. Haz clic en dos marcas (p. ej., 0 mm y 10 mm) y escribe la distancia real.
3. Guarda la calibración.
4. En **Medir molienda**, sube la imagen de la molienda y selecciona la calibración.
5. Ajusta parámetros si es necesario y haz clic en **Analizar**.
6. Guarda el resultado para llevar un historial por molino / dial / café.

## Consejos de captura
- Misma altura/zoom para regla y molienda, o incluye la regla en la misma foto.
- Usa fondo claro mate con buena iluminación difusa.
- Evita grumos: esparce la muestra en una capa lo más uniforme posible.

## Limitaciones
- La equivalencia de diámetro asume partículas aproximadamente 2D en la imagen. Para granulometría profesional se usan tamices o láser.
- La calidad del resultado depende fuertemente de la calidad de la foto (enfoque, contraste, luz).

## Licencia
MIT — para uso educativo en Escuela de Café.