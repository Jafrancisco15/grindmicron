import React, { useEffect, useState } from "react";
import { loadMeasurements, loadCalibrations, Measurement } from "../lib/storage";

export default function History() {
  const [rows, setRows] = useState<Measurement[]>([]);
  const [calNames, setCalNames] = useState<Record<string,string>>({});

  useEffect(()=>{
    const list = loadMeasurements();
    setRows(list);
    const cals = loadCalibrations();
    const map: Record<string,string> = {};
    for (const c of cals) map[c.id] = c.name;
    setCalNames(map);
  }, []);

  function exportCSV() {
    const header = [
      "dateISO","grinder","setting","coffee","calibrationName","micronsPerPixel",
      "n","mean","std","D10","D50","D90","span","cov","finePct","coarsePct",
      "binWidth","minAreaPx","maxAreaPx","blur","open","invert"
    ];
    const lines = [header.join(",")];
    for (const r of rows) {
      const s = r.stats || {};
      lines.push([
        r.dateISO, r.grinder||"", r.setting||"", r.coffee||"", calNames[r.calibrationId]||"",
        r.micronsPerPixel,
        r.sampleSize,
        s.mean, s.std, s.p10, s.p50, s.p90, s.span, s.cov,
        r.finePct, r.coarsePct,
        r.params.binWidth, r.params.minAreaPx, r.params.maxAreaPx, r.params.blur, r.params.open, r.params.invert
      ].join(","));
    }
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "grind-history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">Historial de mediciones</div>
        <button onClick={exportCSV} className="btn btn-ghost">Exportar CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr>
              <th className="py-2">Fecha</th>
              <th>Molino</th>
              <th>Dial</th>
              <th>Café</th>
              <th>Calibración</th>
              <th>n</th>
              <th>Media (μm)</th>
              <th>σ (μm)</th>
              <th>D10</th>
              <th>D50</th>
              <th>D90</th>
              <th>Finos %</th>
              <th>Gruesos %</th>
              <th>Span</th>
              <th>CoV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-2">{new Date(r.dateISO).toLocaleString()}</td>
                <td>{r.grinder}</td>
                <td>{r.setting}</td>
                <td>{r.coffee}</td>
                <td>{calNames[r.calibrationId]}</td>
                <td>{r.sampleSize}</td>
                <td>{r.stats?.mean?.toFixed?.(0)}</td>
                <td>{r.stats?.std?.toFixed?.(0)}</td>
                <td>{r.stats?.p10?.toFixed?.(0)}</td>
                <td>{r.stats?.p50?.toFixed?.(0)}</td>
                <td>{r.stats?.p90?.toFixed?.(0)}</td>
                <td>{r.finePct.toFixed(1)}</td>
                <td>{r.coarsePct.toFixed(1)}</td>
                <td>{r.stats?.span?.toFixed?.(2)}</td>
                <td>{(r.stats?.cov*100)?.toFixed?.(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}