import React, { useEffect, useRef, useState } from "react";
import { useOpenCVReady } from "../hooks/useOpenCVReady";
import { loadCalibrations, Calibration, loadMeasurements, saveMeasurements, Measurement } from "../lib/storage";
import { buildHistogram, computeStats } from "../lib/stats";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

declare global {
  interface Window { cv: any }
}

const defaultParams = {
  blur: 5, // Gaussian blur ksize (odd)
  open: 3, // morphology open kernel size (odd)
  minAreaPx: 8, // filter small specks
  maxAreaPx: 1_000_000, // big cap
  invert: true,
  binWidth: 25, // microns
};

export default function GrindAnalyzer() {
  const cvReady = useOpenCVReady();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [calibrations, setCalibrations] = useState<Calibration[]>([]);
  const [calId, setCalId] = useState<string>("");
  const [params, setParams] = useState(defaultParams);
  const [thresholds, setThresholds] = useState({ fine: 200, coarse: 700 });
  const [micronSizes, setMicronSizes] = useState<number[]>([]);
  const [hist, setHist] = useState<{mid:number,count:number,x0:number,x1:number}[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [finePct, setFinePct] = useState(0);
  const [coarsePct, setCoarsePct] = useState(0);
  const [grinder, setGrinder] = useState("");
  const [setting, setSetting] = useState("");
  const [coffee, setCoffee] = useState("");

  useEffect(()=>{
    setCalibrations(loadCalibrations());
  }, []);

  useEffect(()=>{
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
  }, [img]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => setImg(im);
    im.src = url;
  }

  function analyze() {
    if (!cvReady) { alert("OpenCV aún se está cargando. Intenta en unos segundos."); return; }
    if (!img || !canvasRef.current) { alert("Sube una foto de la molienda."); return; }
    const cal = calibrations.find(c => c.id === calId);
    if (!cal) { alert("Selecciona una calibración válida."); return; }
    const micronsPerPixel = cal.micronsPerPixel;
    const cv = window.cv;
    const src = cv.imread(canvasRef.current);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    const blurK = Math.max(1, params.blur|0) | 1;
    const opened = new cv.Mat();
    const bin = new cv.Mat();

    const ksize = new cv.Size(blurK, blurK);
    cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);

    // Otsu threshold
    cv.threshold(gray, bin, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    if (params.invert) {
      cv.bitwise_not(bin, bin);
    }

    // Morph open to clean noise
    const openK = Math.max(1, params.open|0) | 1;
    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(openK, openK));
    cv.morphologyEx(bin, opened, cv.MORPH_OPEN, kernel);

    // Find contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(opened, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const sizesMicron: number[] = [];
    for (let i=0; i<contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      if (area < params.minAreaPx || area > params.maxAreaPx) continue;
      // equivalent circular diameter in pixels
      const dpx = 2 * Math.sqrt(area / Math.PI);
      const dum = dpx * micronsPerPixel;
      sizesMicron.push(dum);
      cnt.delete();
    }

    // cleanup
    src.delete(); gray.delete(); bin.delete(); opened.delete(); hierarchy.delete(); contours.delete();

    if (sizesMicron.length === 0) {
      setMicronSizes([]);
      setHist([]);
      setStats(null);
      setFinePct(0);
      setCoarsePct(0);
      alert("No se detectaron partículas. Ajusta los parámetros o usa una foto con mejor contraste.");
      return;
    }

    const histo = buildHistogram(sizesMicron, params.binWidth);
    const st = computeStats(sizesMicron, params.binWidth);
    const total = sizesMicron.length;
    const fineCount = sizesMicron.filter(v => v < thresholds.fine).length;
    const coarseCount = sizesMicron.filter(v => v > thresholds.coarse).length;
    setMicronSizes(sizesMicron);
    setHist(histo);
    setStats(st);
    setFinePct((fineCount/total)*100);
    setCoarsePct((coarseCount/total)*100);
  }

  function saveRecord() {
    const cal = calibrations.find(c => c.id === calId);
    if (!cal || !stats || micronSizes.length === 0) { alert("Analiza primero para guardar."); return; }
    const list = loadMeasurements();
    const rec: Measurement = {
      id: crypto.randomUUID(),
      dateISO: new Date().toISOString(),
      grinder,
      setting,
      coffee,
      calibrationId: cal.id,
      micronsPerPixel: cal.micronsPerPixel,
      thresholds: { ...thresholds },
      params: { ...params },
      stats,
      sampleSize: micronSizes.length,
      finePct,
      coarsePct,
    };
    list.unshift(rec);
    saveMeasurements(list);
    alert("Medición guardada en el historial.");
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="label">Sube una foto de la molienda (fondo claro mate, buena luz)</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="input w-full"/>
            <div className="relative inline-block mt-3 w-full rounded-xl">
  <canvas ref={canvasRef} onWheel={onWheel} className="w-full rounded-xl border border-white/10" />
  <canvas ref={overlayRef} onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          className="absolute inset-0 w-full h-full pointer-events-auto" />
</div>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <button className="btn btn-secondary" onClick={resetView}>Reiniciar vista</button>
              <button className={"btn " + (roiMode ? "btn-primary" : "btn-secondary")} onClick={()=>setRoiMode(!roiMode)}>
                {roiMode ? "ROI: Dibujar" : "ROI: Panear"}
              </button>
              <button className="btn btn-secondary" onClick={clearRois}>Limpiar ROIs</button>
              <label className="inline-flex items-center gap-2 ml-2">
                <input type="checkbox" checked={params.roiOnly} onChange={e=>setParams({...params, roiOnly: e.target.checked})}/>
                Analizar solo ROIs
              </label>
              <label className="inline-flex items-center gap-2 ml-2">
                <input type="checkbox" checked={params.splitClumps} onChange={e=>setParams({...params, splitClumps: e.target.checked})}/>
                Separar grumos (experimental)
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              <div>
                <div className="label">Calibración</div>
                <select className="input w-full" value={calId} onChange={e=>setCalId(e.target.value)}>
                  <option value="">Selecciona…</option>
                  {calibrations.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.micronsPerPixel.toFixed(2)} μm/px
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Blur (px, impar)</div>
                <input type="number" className="input w-full" value={params.blur} onChange={e=>setParams(p=>({...p, blur: parseInt(e.target.value||"0")}))}/>
              </div>
              <div>
                <div className="label">Open (px, impar)</div>
                <input type="number" className="input w-full" value={params.open} onChange={e=>setParams(p=>({...p, open: parseInt(e.target.value||"0")}))}/>
              </div>
              <div>
                <div className="label">Área mínima (px²)</div>
                <input type="number" className="input w-full" value={params.minAreaPx} onChange={e=>setParams(p=>({...p, minAreaPx: parseInt(e.target.value||"0")}))}/>
              </div>
              <div>
                <div className="label">Área máxima (px²)</div>
                <input type="number" className="input w-full" value={params.maxAreaPx} onChange={e=>setParams(p=>({...p, maxAreaPx: parseInt(e.target.value||"0")}))}/>
              </div>
              <div className="flex items-end gap-2">
                <input id="invert" type="checkbox" checked={params.invert} onChange={e=>setParams(p=>({...p, invert: e.target.checked}))}/>
                <label htmlFor="invert" className="label">Invertir binario</label>
              </div>
              <div>
                <div className="label">Ancho de bin (μm)</div>
                <input type="number" className="input w-full" value={params.binWidth} onChange={e=>setParams(p=>({...p, binWidth: parseInt(e.target.value||"0")}))}/>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={analyze} className="btn btn-primary">Analizar molienda</button>
              <button onClick={saveRecord} className="btn btn-ghost">Guardar en historial</button>
            </div>
          </div>
          <div className="w-full md:w-80 card-2">
            <div className="grid gap-3">
              <div>
                <div className="label">Molino</div>
                <input className="input w-full" value={grinder} onChange={e=>setGrinder(e.target.value)} placeholder="Ej. Niche Zero / EK43 / DF64"/>
              </div>
              <div>
                <div className="label">Número de dial</div>
                <input className="input w-full" value={setting} onChange={e=>setSetting(e.target.value)} placeholder="Ej. 10.5"/>
              </div>
              <div>
                <div className="label">Café / Lote</div>
                <input className="input w-full" value={coffee} onChange={e=>setCoffee(e.target.value)} placeholder="Ej. Jarabacoa, honey, 2025-08"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="label">Fino &lt; (μm)</div>
                  <input type="number" className="input w-full" value={thresholds.fine} onChange={e=>setThresholds({...thresholds, fine: parseFloat(e.target.value||"0")})}/>
                </div>
                <div>
                  <div className="label">Grueso &gt; (μm)</div>
                  <input type="number" className="input w-full" value={thresholds.coarse} onChange={e=>setThresholds({...thresholds, coarse: parseFloat(e.target.value||"0")})}/>
                </div>
              </div>
              {stats && (
                <div className="text-sm space-y-1 mt-2">
                  <div className="font-semibold text-white">Resumen</div>
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>n = {stats.count}</div>
                    <div>Media = {stats.mean.toFixed(0)} μm</div>
                    <div>σ = {stats.std.toFixed(0)} μm</div>
                    <div>Moda ≈ {stats.modeBinCenter.toFixed(0)} μm</div>
                    <div>D10 = {stats.p10.toFixed(0)} μm</div>
                    <div>D50 = {stats.p50.toFixed(0)} μm</div>
                    <div>D90 = {stats.p90.toFixed(0)} μm</div>
                    <div>Span = {stats.span.toFixed(2)}</div>
                    <div>CoV = {(stats.cov*100).toFixed(1)}%</div>
                    <div>Finos = {finePct.toFixed(1)}%</div>
                    <div>Gruesos = {coarsePct.toFixed(1)}%</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-2 text-sm text-neutral-400">Distribución de tamaños (μm)</div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hist}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="mid" tickFormatter={(v)=>String(Math.round(v))} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v:any, n:any, p:any)=>[v, `${Math.round(p.payload.x0)}–${Math.round(p.payload.x1)} μm`]} />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}