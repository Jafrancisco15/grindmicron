import * as exifr from 'exifr';
import { PHONE_SPECS, PhoneSpec, PhoneLens } from './phoneDB';

export type AutoCalibResult = {
  model?: string;
  lens?: string;
  focalMM?: number;       // actual focal length used (mm)
  equiv35MM?: number;     // 35mm equivalent focal length
  sensorDiagMM?: number;  // estimated sensor diagonal (mm)
  sensorWidthMM?: number; // assuming aspect ratio (default 4:3)
  distanceMM?: number;    // subject distance (mm)
  imageWidthPx: number;
  micronsPerPixel: number;
  warnings: string[];
};

const DIAG_35MM = 43.266615305567875; // diagonal of 36x24mm

// Compute sensor diagonal from EXIF pair
function sensorDiagFromExif(focalMM: number, equiv35: number): number | null {
  if (!focalMM || !equiv35) return null;
  // equiv35 = focalMM * (DIAG_35MM / sensorDiag)
  // => sensorDiag = focalMM * (DIAG_35MM / equiv35)
  return focalMM * (DIAG_35MM / equiv35);
}

function aspectWidthFactor(aspect: '4:3'|'3:2'|'16:9'): number {
  switch (aspect) {
    case '4:3': return 4 / Math.sqrt(4*4 + 3*3); // 4/5 = 0.8
    case '3:2': return 3 / Math.sqrt(3*3 + 2*2);
    case '16:9': return 16 / Math.sqrt(16*16 + 9*9);
    default: return 4 / Math.sqrt(25);
  }
}

export function estimateMicronsPerPixel(params: {
  imageEl: HTMLImageElement;
  file?: File;
  selectedPhone?: PhoneSpec;
  selectedLens?: PhoneLens | null;
  distanceMM?: number; // if not provided, attempt EXIF SubjectDistance; fallback 200mm
}): Promise<AutoCalibResult> {
  const { imageEl, file, selectedPhone, selectedLens } = params;
  const imageWidthPx = imageEl.naturalWidth || imageEl.width;
  const warnings: string[] = [];
  let distanceMM = params.distanceMM ?? 200;

  const parseExif = file ? exifr.parse(file, { 
    tiff: true, ifd0: true, exif: true, 
    userComment: true
  }) : Promise.resolve<any>({});

  return parseExif.then(exif => {
    let model = exif?.Model || exif?.Make || undefined;
    let focalMM: number | undefined = exif?.FocalLength || exif?.FocalLengthIn35mmFilm && selectedLens?.focalMM;
    let equiv35MM: number | undefined = exif?.FocalLengthIn35mmFilm;
    let subjectDistanceM = exif?.SubjectDistance || exif?.SubjectDistanceRange;
    if (typeof subjectDistanceM === 'number' && isFinite(subjectDistanceM)) {
      distanceMM = subjectDistanceM * 1000;
    }

    // If EXIF lacks focal or equiv, try selectedLens from DB
    if ((!focalMM || !equiv35MM) && selectedLens) {
      focalMM = focalMM ?? selectedLens.focalMM;
      equiv35MM = equiv35MM ?? selectedLens.equiv35MM;
    }

    // If still missing equiv but we have selected lens & focal, infer from phone DB typical equiv
    if (!equiv35MM && selectedLens) {
      equiv35MM = selectedLens.equiv35MM;
    }

    // Derive sensor diagonal
    let sensorDiagMM = (focalMM && equiv35MM) ? sensorDiagFromExif(focalMM, equiv35MM) : undefined;

    // Decide aspect ratio – prefer selected lens aspect, default 4:3
    const aspect: '4:3'|'3:2'|'16:9' = (selectedLens?.aspect ?? '4:3');

    // If still missing sensor diagonal, attempt to use common values
    if (!sensorDiagMM && focalMM && equiv35MM) {
      sensorDiagMM = sensorDiagFromExif(focalMM, equiv35MM);
    }
    if (!sensorDiagMM) {
      // Fallback: assume 1/1.7" ~ 9.5mm or 1/1.9" ~ 8.9mm diagonals typical for mains
      sensorDiagMM = 9.0;
      warnings.push('EXIF incompleto: se asumió un sensor ~9.0 mm de diagonal (valor típico).');
    }

    // Compute sensor width from diagonal & aspect
    const widthFactor = aspectWidthFactor(aspect);
    const sensorWidthMM = sensorDiagMM * widthFactor;

    // Field of view
    const f = focalMM || (selectedLens?.focalMM ?? 5.5);
    const hfov = 2 * Math.atan((sensorWidthMM / 2) / f);

    // Physical scene width at distance
    const sceneWidthMM = 2 * distanceMM * Math.tan(hfov / 2);

    // Microns per pixel
    const micronsPerPixel = (sceneWidthMM * 1000) / imageWidthPx;

    if (!exif?.FocalLength) warnings.push('No se encontró FocalLength en EXIF; se usó el valor típico del lente.');
    if (!exif?.FocalLengthIn35mmFilm) warnings.push('No se encontró FocalLengthIn35mmFilm en EXIF; se usó el equivalente típico del lente.');
    if (!exif?.SubjectDistance) warnings.push('No se encontró distancia al sujeto en EXIF; se asumieron ~20 cm (ajustable).');

    return {
      model: model || selectedPhone?.brand + ' ' + selectedPhone?.model,
      lens: selectedLens?.name,
      focalMM: f,
      equiv35MM: equiv35MM,
      sensorDiagMM,
      sensorWidthMM,
      distanceMM,
      imageWidthPx,
      micronsPerPixel,
      warnings
    };
  });
}

// Helpers to list brands/models for UI
export function listBrands(): string[] {
  return Array.from(new Set(PHONE_SPECS.map(p => p.brand))).sort();
}
export function listModels(brand: string): PhoneSpec[] {
  return PHONE_SPECS.filter(p => p.brand === brand);
}
