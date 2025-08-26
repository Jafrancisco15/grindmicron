export type Stats = {
  count: number;
  mean: number;
  std: number;
  min: number;
  max: number;
  p10: number;
  p50: number;
  p90: number;
  modeBinCenter: number;
  span: number; // (D90 - D10)/D50
  cov: number;  // std/mean
};

export function computeStats(values: number[], binWidth: number): Stats {
  if (values.length === 0) {
    return { count: 0, mean: 0, std: 0, min: 0, max: 0, p10: 0, p50: 0, p90: 0, modeBinCenter: 0, span: 0, cov: 0 };
  }
  const sorted = [...values].sort((a,b)=>a-b);
  const n = sorted.length;
  const mean = sorted.reduce((acc,v)=>acc+v,0)/n;
  const variance = sorted.reduce((acc,v)=>acc+(v-mean)*(v-mean),0)/n;
  const std = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[n-1];
  const quantile = (q:number) => {
    const idx = (n-1)*q;
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi]-sorted[lo])*(idx-lo);
  };
  const p10 = quantile(0.10);
  const p50 = quantile(0.50);
  const p90 = quantile(0.90);
  // mode by histogram bin
  const minVal = min, maxVal = max;
  const binCount = Math.max(1, Math.ceil((maxVal - minVal)/binWidth));
  const bins = new Array(binCount).fill(0);
  for (const v of sorted) {
    const idx = Math.min(binCount-1, Math.floor((v - minVal)/binWidth));
    bins[idx]++;
  }
  let bestIdx = 0, bestCount = -1;
  for (let i=0;i<bins.length;i++){ if (bins[i] > bestCount) { bestCount = bins[i]; bestIdx = i; } }
  const modeBinCenter = minVal + (bestIdx + 0.5)*binWidth;

  const span = p50 > 0 ? (p90 - p10) / p50 : 0;
  const cov = mean > 0 ? std / mean : 0;
  return { count:n, mean, std, min, max, p10, p50, p90, modeBinCenter, span, cov };
}

export function buildHistogram(values: number[], binWidth: number) {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binsCount = Math.max(1, Math.ceil((max - min)/binWidth));
  const bins = new Array(binsCount).fill(0);
  for (const v of values) {
    const idx = Math.min(binsCount-1, Math.floor((v - min)/binWidth));
    bins[idx]++;
  }
  return bins.map((count, i) => ({
    x0: min + i*binWidth,
    x1: min + (i+1)*binWidth,
    mid: min + (i+0.5)*binWidth,
    count
  }));
}