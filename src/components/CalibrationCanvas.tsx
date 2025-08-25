import React, { useEffect, useRef, useState } from "react";
import { Calibration, loadCalibrations, saveCalibrations } from "../lib/storage";

type Props = {
  onCalibrated?: (cal: Calibration) => void;
}

export default function CalibrationCanvas({ onCalibrated }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="label">Sube una foto de una regla (misma distancia y zoom que usarás para la molienda)</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="input w-full"/>
            <p className="mt-2 text-sm text-neutral-400">Haz clic en dos marcas conocidas (por ejemplo, 0 cm y 1 cm), luego introduce la distancia real.</p>
            <canvas ref={canvasRef} className="mt-3 w-full rounded-xl border border-white/10" onClick={onClick}/>
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