export type Calibration = {
  id: string;
  name: string;
  dateISO: string;
  micronsPerPixel: number;
  pixelDistance: number;
  realDistanceMM: number;
  notes?: string;
};

export type Measurement = {
  id: string;
  dateISO: string;
  grinder?: string;
  setting?: string;
  coffee?: string;
  calibrationId: string;
  micronsPerPixel: number;
  thresholds: { fine: number; coarse: number };
  params: { blur: number; open: number; minAreaPx: number; maxAreaPx: number; invert: boolean; binWidth: number };
  stats: any;
  sampleSize: number;
  finePct: number;
  coarsePct: number;
  // Optional future: thumbnail data URL (avoid for now, storage size)
};

const CAL_KEY = "grind_microns_calibrations_v1";
const MEAS_KEY = "grind_microns_measurements_v1";

export function loadCalibrations(): Calibration[] {
  try { return JSON.parse(localStorage.getItem(CAL_KEY) || "[]"); }
  catch { return []; }
}
export function saveCalibrations(list: Calibration[]) {
  localStorage.setItem(CAL_KEY, JSON.stringify(list));
}

export function loadMeasurements(): Measurement[] {
  try { return JSON.parse(localStorage.getItem(MEAS_KEY) || "[]"); }
  catch { return []; }
}
export function saveMeasurements(list: Measurement[]) {
  localStorage.setItem(MEAS_KEY, JSON.stringify(list));
}