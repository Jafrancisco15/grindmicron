import React, { useEffect, useRef, useState } from "react";
import { Calibration, loadCalibrations, saveCalibrations } from "../lib/storage";

type Props = {
  onCalibrated?: (cal: Calibration) => void;
}

export default function CalibrationCanvas({ onCalibrated }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x:0, y:0});
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{x:number,y:number}|null>(null);

  function viewToImage(pt:{x:number,y:number}){
    const x = (pt.x - offset.x)/scale;
    const y = (pt.y - offset.y)/scale;
    return {x,y};
  }
  function imageToView(pt:{x:number,y:number}){
    return {x: pt.x*scale + offset.x, y: pt.y*scale + offset.y};
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;
    e.preventDefault();
    const rect = (overlayRef.current ?? canvasRef.current).getBoundingClientRect();
    const mouse = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    const before = viewToImage(mouse);
    const dir = Math.sign(e.deltaY) > 0 ? -1 : 1;
    const factor = 1 + 0.15 * dir;
    const newScale = Math.min(12, Math.max(0.2, scale * factor));
    setScale(newScale);
    const after = {x: before.x * newScale, y: before.y * newScale};
    setOffset({x: mouse.x - after.x, y: mouse.y - after.y});
  }
  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>){
    const rect = (overlayRef.current ?? canvasRef.current).getBoundingClientRect();
    const mouse = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    setIsPanning(true);
    panRef.current = {x: mouse.x - offset.x, y: mouse.y - offset.y};
  }
  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>){
    if (!isPanning || !panRef.current) return;
    const rect = (overlayRef.current ?? canvasRef.current).getBoundingClientRect();
    const mouse = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    setOffset({x: mouse.x - panRef.current.x, y: mouse.y - panRef.current.y});
  }
  function onMouseUp(){ setIsPanning(false); panRef.current = null; }
  function resetView(){ setScale(1); setOffset({x:0,y:0}); }
const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [pts, setPts] = useState<{x:number,y:number}[]>([]);
  const [mm, setMM] = useState<number>(10);
  const [name, setName] = useState<string>("Regla #1");
  const [notes, setNotes] = useState<string>("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setImg(im);
      const canvas = canvasRef.current!;
      canvas.width = im.width;
      canvas.height = im.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(im, 0, 0);
    };
    im.src = url;
  }

  function redraw() {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(img, 0, 0);
    if (pts.length >= 1) {
      const p0 = pts[0];
      ctx.fillStyle = "#F4D03F";
      ctx.beginPath(); ctx.arc(p0.x, p0.y, 6, 0, Math.PI*2); ctx.fill();
    }
    if (pts.length >= 2) {
      const [p0, p1] = pts;
      ctx.strokeStyle = "#F4D03F";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      ctx.fillStyle = "#F4D03F";
      ctx.beginPath(); ctx.arc(p1.x, p1.y, 6, 0, Math.PI*2); ctx.fill();

      // label pixel distance
      const dx = p1.x - p0.x, dy = p1.y - p0.y;
      const dpx = Math.sqrt(dx*dx + dy*dy);
      ctx.font = "16px ui-sans-serif, system-ui, -apple-system";
      ctx.fillStyle = "white";
      ctx.fillText(`${dpx.toFixed(1)} px`, p1.x + 8, p1.y + 8);
    }
  }

  useEffect(()=>{ redraw(); }, [img, pts]);

  function onClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    setPts(prev => prev.length >= 2 ? [{x,y}] : [...prev, {x,y}]);
  }

  function doSave() {
    if (pts.length < 2 || mm <= 0) return;
    const [p0, p1] = pts;
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const dpx = Math.sqrt(dx*dx + dy*dy);
    const micronsPerPixel = (mm * 1000) / dpx;
    const cal: Calibration = {
      id: crypto.randomUUID(),
      name,
      dateISO: new Date().toISOString(),
      micronsPerPixel,
      pixelDistance: dpx,
      realDistanceMM: mm,
      notes: notes || undefined
    };
    const list = loadCalibrations();
    list.unshift(cal);
    saveCalibrations(list);
    if (onCalibrated) onCalibrated(cal);
    alert(`Calibración guardada. ${micronsPerPixel.toFixed(2)} μm/px`);
  }

  
  function onOverlayClick(e: React.MouseEvent<HTMLCanvasElement>){
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const mouse = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    const imgPt = viewToImage(mouse);
    setPts(prev => {
      const next = [...prev, {x: imgPt.x, y: imgPt.y}];
      if (next.length > 2) return next.slice(-2);
      return next;
    });
  }
return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="label">Sube una foto de una regla (misma distancia y zoom que usarás para la molienda)</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="input w-full"/>
<div className="flex gap-2 mt-2">
  <button className="btn btn-secondary" onClick={resetView}>Reiniciar vista</button>
  <span className="text-xs text-neutral-400 self-center">Usa rueda del mouse para zoom, arrastra para pan</span>
</div>
            <p className="mt-2 text-sm text-neutral-400">Haz clic en dos marcas conocidas (por ejemplo, 0 cm y 1 cm), luego introduce la distancia real.</p>
            <div className="relative mt-3 w-full rounded-xl">
  <canvas ref={canvasRef} onWheel={onWheel} className="w-full rounded-xl border border-white/10" />
  <canvas ref={overlayRef} onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
          className="absolute inset-0 w-full h-full pointer-events-auto" onClick={onOverlayClick} />
</div>
          </div>
          <div className="w-full md:w-80 card-2">
            <div className="space-y-3">
              <div>
                <div className="label mb-1">Nombre</div>
                <input className="input w-full" value={name} onChange={e=>setName(e.target.value)} placeholder="Regla mesa blanca"/>
              </div>
              <div>
                <div className="label mb-1">Distancia real (mm)</div>
                <input type="number" className="input w-full" value={mm} onChange={e=>setMM(parseFloat(e.target.value))}/>
              </div>
              <div>
                <div className="label mb-1">Notas</div>
                <textarea className="input w-full" rows={4} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Luz natural, iPhone 14, mesa de mármol, 20cm de altura"/>
              </div>
              <button onClick={doSave} className="btn btn-primary w-full">Guardar calibración</button>
              <div className="text-xs text-neutral-400">
                Consejos: evita sombras duras, usa fondo mate y toma ambas fotos (regla y molienda) a la misma altura y zoom.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}