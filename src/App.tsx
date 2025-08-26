import React, { useState } from "react";
import CalibrationCanvas from "./components/CalibrationCanvas";
import GrindAnalyzer from "./components/GrindAnalyzer";
import History from "./components/History";

function TabButton({label, active, onClick}:{label:string; active:boolean; onClick:()=>void}){
  return (
    <button onClick={onClick} className={`btn ${active ? 'btn-primary' : 'btn-ghost'}`}>
      {label}
    </button>
  );
}

export default function App(){
  const [tab, setTab] = useState<"calib"|"analyze"|"history"|"help">("calib");
  return (
    <div className="max-w-6xl mx-auto p-5 md:p-8 space-y-5">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold">Grind → Microns</div>
          <div className="text-sm text-neutral-400">Medición de tamaño de partícula de molienda con visión por computadora (client‑side)</div>
        </div>
        <nav className="flex gap-2">
          <TabButton label="Calibración" active={tab==='calib'} onClick={()=>setTab('calib')}/>
          <TabButton label="Medir molienda" active={tab==='analyze'} onClick={()=>setTab('analyze')}/>
          <TabButton label="Historial" active={tab==='history'} onClick={()=>setTab('history')}/>
          <TabButton label="Ayuda" active={tab==='help'} onClick={()=>setTab('help')}/>
        </nav>
      </header>

      {tab === 'calib' && <CalibrationCanvas />}
      {tab === 'analyze' && <GrindAnalyzer />}
      {tab === 'history' && <History />}
      {tab === 'help' && (
        <div className="card space-y-3 text-sm text-neutral-300">
          <p><b>Flujo recomendado</b>: 1) Calibra con una foto de una regla (elige dos marcas y escribe la distancia real en mm). 2) Toma la foto de la molienda en el mismo plano, altura y zoom. 3) Analiza y ajusta parámetros si es necesario. 4) Guarda en historial.</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Iluminación</b>: luz suave y difusa. Evita sombras duras.</li>
            <li><b>Fondo</b>: claro, mate, sin textura. Un plato blanco mate funciona bien.</li>
            <li><b>Contraste</b>: busca que la molienda sea claramente más oscura que el fondo para segmentar.</li>
            <li><b>Parámetros</b>: aumenta <i>Blur</i> si hay ruido; ajusta área mínima para ignorar polvo; cambia <i>Invertir</i> si las partículas salen negras.</li>
            <li><b>Métricas</b>: D10/D50/D90 y <i>Span</i> resumen la distribución; <i>CoV</i> refleja consistencia del molino.</li>
            <li><b>Privacidad</b>: todo el procesamiento ocurre en tu navegador. No subimos imágenes a ningún servidor.</li>
          </ul>
        </div>
      )}

      <footer className="text-center text-xs text-neutral-500 pt-6 pb-8">
        © {new Date().getFullYear()} Escuela de Café — Versión demo educativa
      </footer>
    </div>
  );
}