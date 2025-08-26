export type PhoneLens = {
  name: string;          // e.g., 'Wide (1x)'
  focalMM: number;       // actual focal length in mm (approx)
  equiv35MM: number;     // 35mm equivalent focal length (approx)
  aspect: '4:3' | '3:2' | '16:9';
};

export type PhoneSpec = {
  brand: string;
  model: string;
  year?: number;
  lenses: PhoneLens[];
};

// IMPORTANT
// These values are APPROXIMATE and intended for scale estimation when EXIF is missing.
// For highest accuracy, prefer EXIF (FocalLength, FocalLengthIn35mmFilm, SubjectDistance).

const UW = (equiv:number=13) => ({ name: 'Ultra-Wide (0.5x)', focalMM: 1.5, equiv35MM: equiv, aspect: '4:3' as const });
const W1 = (equiv:number=26, focal:number=5.6) => ({ name: 'Wide (1x)', focalMM: focal, equiv35MM: equiv, aspect: '4:3' as const });
const TEL = (equiv:number=52, focal:number=7.6) => ({ name: 'Tele (2x)', focalMM: focal, equiv35MM: equiv, aspect: '4:3' as const });
const TEL25 = () => ({ name: 'Tele (2.5x)', focalMM: 7.65, equiv35MM: 65, aspect: '4:3' as const });
const TEL3 = (equiv:number=77, focal:number=9.0) => ({ name: 'Tele (3x)', focalMM: focal, equiv35MM: equiv, aspect: '4:3' as const });
const TEL5 = (equiv:number=120, focal:number=26.0) => ({ name: 'Tele (5x)', focalMM: focal, equiv35MM: equiv, aspect: '4:3' as const });
const TEL10 = (equiv:number=240, focal:number=35.0) => ({ name: 'Tele (10x)', focalMM: focal, equiv35MM: equiv, aspect: '4:3' as const });

function rangeYear(start:number, end:number): number[] {
  const a:number[] = [];
  for (let y=start; y<=end; y++) a.push(y);
  return a;
}

export const PHONE_SPECS: PhoneSpec[] = [
  // ==================== APPLE / iPhone (approx) ====================
  // Older iPhones (single lens)
  { brand: 'Apple', model: 'iPhone 6 / 6 Plus', year: 2014, lenses: [ { name: 'Wide (1x)', focalMM: 4.15, equiv35MM: 29, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone 6s / 6s Plus', year: 2015, lenses: [ { name: 'Wide (1x)', focalMM: 4.15, equiv35MM: 29, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone SE (1st gen)', year: 2016, lenses: [ { name: 'Wide (1x)', focalMM: 4.15, equiv35MM: 29, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone 7', year: 2016, lenses: [ { name: 'Wide (1x)', focalMM: 3.99, equiv35MM: 28, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone 7 Plus', year: 2016, lenses: [ { name: 'Wide (1x)', focalMM: 3.99, equiv35MM: 28, aspect: '4:3' }, TEL() ] },
  { brand: 'Apple', model: 'iPhone 8', year: 2017, lenses: [ { name: 'Wide (1x)', focalMM: 3.99, equiv35MM: 28, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone 8 Plus', year: 2017, lenses: [ { name: 'Wide (1x)', focalMM: 3.99, equiv35MM: 28, aspect: '4:3' }, TEL() ] },
  { brand: 'Apple', model: 'iPhone X', year: 2017, lenses: [ { name: 'Wide (1x)', focalMM: 4.0, equiv35MM: 28, aspect: '4:3' }, TEL() ] },
  { brand: 'Apple', model: 'iPhone XR', year: 2018, lenses: [ { name: 'Wide (1x)', focalMM: 4.25, equiv35MM: 26, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone XS / XS Max', year: 2018, lenses: [ { name: 'Wide (1x)', focalMM: 4.25, equiv35MM: 26, aspect: '4:3' }, TEL() ] },

  // iPhone 11 family
  { brand: 'Apple', model: 'iPhone 11', year: 2019, lenses: [ UW(), W1(26,4.25) ] },
  { brand: 'Apple', model: 'iPhone 11 Pro / Pro Max', year: 2019, lenses: [ UW(), W1(26,4.25), TEL() ] },

  // iPhone 12 family
  { brand: 'Apple', model: 'iPhone 12 / 12 mini', year: 2020, lenses: [ UW(), W1(26,5.1) ] },
  { brand: 'Apple', model: 'iPhone 12 Pro / Pro Max', year: 2020, lenses: [ UW(), W1(26,5.1), TEL() ] },

  // iPhone 13 family
  { brand: 'Apple', model: 'iPhone 13 / 13 mini', year: 2021, lenses: [ UW(13), W1(26,5.7) ] },
  { brand: 'Apple', model: 'iPhone 13 Pro / Pro Max', year: 2021, lenses: [ UW(13), W1(26,5.7), TEL3() ] },

  // iPhone 14 family
  { brand: 'Apple', model: 'iPhone 14 / 14 Plus', year: 2022, lenses: [ UW(13), W1(26,6.0) ] },
  { brand: 'Apple', model: 'iPhone 14 Pro / Pro Max', year: 2022, lenses: [ UW(13), { name:'Wide (1x)', focalMM: 6.86, equiv35MM: 24, aspect: '4:3' }, TEL3(77,9.0) ] },

  // iPhone 15 family
  { brand: 'Apple', model: 'iPhone 15 / 15 Plus', year: 2023, lenses: [ UW(13), { name:'Wide (1x)', focalMM: 6.86, equiv35MM: 24, aspect: '4:3' } ] },
  { brand: 'Apple', model: 'iPhone 15 Pro', year: 2023, lenses: [ UW(13), { name:'Wide (1x)', focalMM: 6.86, equiv35MM: 24, aspect: '4:3' }, TEL3() ] },
  { brand: 'Apple', model: 'iPhone 15 Pro Max', year: 2023, lenses: [ UW(13), { name:'Wide (1x)', focalMM: 6.86, equiv35MM: 24, aspect: '4:3' }, TEL5(120, 26.0) ] },

  // iPhone SE later
  { brand: 'Apple', model: 'iPhone SE (2nd gen)', year: 2020, lenses: [ W1(28,3.99) ] },
  { brand: 'Apple', model: 'iPhone SE (3rd gen)', year: 2022, lenses: [ W1(28,3.99) ] },

  // ==================== GOOGLE / Pixel (approx) ====================
  { brand: 'Google', model: 'Pixel / Pixel XL', year: 2016, lenses: [ { name: 'Wide (1x)', focalMM: 4.67, equiv35MM: 28, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 2 / 2 XL', year: 2017, lenses: [ { name: 'Wide (1x)', focalMM: 4.44, equiv35MM: 27, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 3 / 3 XL', year: 2018, lenses: [ { name: 'Wide (1x)', focalMM: 4.44, equiv35MM: 28, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 3a / 3a XL', year: 2019, lenses: [ { name: 'Wide (1x)', focalMM: 4.44, equiv35MM: 28, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 4', year: 2019, lenses: [ { name: 'Wide (1x)', focalMM: 4.38, equiv35MM: 27, aspect: '4:3' }, { name:'Tele (2x)', focalMM: 6.4, equiv35MM: 50, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 4 XL', year: 2019, lenses: [ { name: 'Wide (1x)', focalMM: 4.38, equiv35MM: 27, aspect: '4:3' }, { name:'Tele (2x)', focalMM: 6.4, equiv35MM: 50, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 4a', year: 2020, lenses: [ { name: 'Wide (1x)', focalMM: 4.38, equiv35MM: 27, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 5', year: 2020, lenses: [ { name: 'Wide (1x)', focalMM: 5.0, equiv35MM: 27, aspect: '4:3' }, { name:'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 5a', year: 2021, lenses: [ { name: 'Wide (1x)', focalMM: 4.38, equiv35MM: 27, aspect: '4:3' }, { name:'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' } ] },

  { brand: 'Google', model: 'Pixel 6', year: 2021, lenses: [ { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.81, equiv35MM: 25, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 6 Pro', year: 2021, lenses: [ { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.81, equiv35MM: 25, aspect: '4:3' }, { name:'Tele (4x)', focalMM: 19.0, equiv35MM: 104, aspect: '4:3' } ] },

  { brand: 'Google', model: 'Pixel 6a', year: 2022, lenses: [ { name: 'Wide (1x)', focalMM: 5.0, equiv35MM: 27, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 7', year: 2022, lenses: [ { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.81, equiv35MM: 24, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 7 Pro', year: 2022, lenses: [ { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.81, equiv35MM: 24, aspect: '4:3' }, { name:'Tele (5x)', focalMM: 26.0, equiv35MM: 120, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 7a', year: 2023, lenses: [ { name: 'Wide (1x)', focalMM: 6.5, equiv35MM: 24, aspect: '4:3' } ] },

  { brand: 'Google', model: 'Pixel 8', year: 2023, lenses: [ { name: 'Ultra-Wide (0.5x)', focalMM: 2.0, equiv35MM: 14, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.5, equiv35MM: 24, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 8 Pro', year: 2023, lenses: [ { name: 'Ultra-Wide (0.5x)', focalMM: 2.0, equiv35MM: 14, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.5, equiv35MM: 24, aspect: '4:3' }, { name:'Tele (5x)', focalMM: 26.0, equiv35MM: 120, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 8a', year: 2024, lenses: [ { name: 'Wide (1x)', focalMM: 6.5, equiv35MM: 25, aspect: '4:3' } ] },

  // Pixel 9 series (approx continuation)
  { brand: 'Google', model: 'Pixel 9', year: 2024, lenses: [ { name: 'Ultra-Wide (0.5x)', focalMM: 2.0, equiv35MM: 14, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.5, equiv35MM: 24, aspect: '4:3' } ] },
  { brand: 'Google', model: 'Pixel 9 Pro / 9 Pro XL', year: 2024, lenses: [ { name: 'Ultra-Wide (0.5x)', focalMM: 2.0, equiv35MM: 14, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 6.5, equiv35MM: 24, aspect: '4:3' }, { name:'Tele (5x)', focalMM: 26.0, equiv35MM: 120, aspect: '4:3' } ] },

  // ==================== SAMSUNG / Galaxy S (approx) ====================
  { brand: 'Samsung', model: 'Galaxy S8 / S8+', year: 2017, lenses: [ { name: 'Wide (1x)', focalMM: 4.2, equiv35MM: 26, aspect: '4:3' } ] },
  { brand: 'Samsung', model: 'Galaxy S9 / S9+', year: 2018, lenses: [ { name: 'Wide (1x)', focalMM: 4.3, equiv35MM: 26, aspect: '4:3' } ] },
  { brand: 'Samsung', model: 'Galaxy S10 / S10e / S10+', year: 2019, lenses: [ { name: 'Ultra-Wide (0.5x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' }, { name:'Wide (1x)', focalMM: 4.3, equiv35MM: 26, aspect: '4:3' }, TEL3(52, 7.0) ] },

  { brand: 'Samsung', model: 'Galaxy S20 / S20+ / S20 Ultra', year: 2020, lenses: [
    { name: 'Ultra-Wide (0.5x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
    { name: 'Wide (1x)', focalMM: 5.4, equiv35MM: 26, aspect: '4:3' },
    { name: 'Tele (3x/10x)*', focalMM: 10.0, equiv35MM: 70, aspect: '4:3' }
  ]},

  { brand: 'Samsung', model: 'Galaxy S21 / S21+ / S21 Ultra', year: 2021, lenses: [
    { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
    { name: 'Wide (1x)', focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
    { name: 'Tele (3x)', focalMM: 10.0, equiv35MM: 70, aspect: '4:3' },
    { name: 'Tele (10x)* (Ultra)', focalMM: 35.0, equiv35MM: 240, aspect: '4:3' }
  ]},

  { brand: 'Samsung', model: 'Galaxy S22 / S22+ / S22 Ultra', year: 2022, lenses: [
    { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
    { name: 'Wide (1x)', focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
    { name: 'Tele (3x)', focalMM: 10.0, equiv35MM: 70, aspect: '4:3' },
    { name: 'Tele (10x)* (Ultra)', focalMM: 35.0, equiv35MM: 240, aspect: '4:3' }
  ]},

  { brand: 'Samsung', model: 'Galaxy S23 / S23+ / S23 Ultra', year: 2023, lenses: [
    { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
    { name: 'Wide (1x)', focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
    { name: 'Tele (3x)', focalMM: 10.0, equiv35MM: 70, aspect: '4:3' },
    { name: 'Tele (10x)* (Ultra)', focalMM: 35.0, equiv35MM: 240, aspect: '4:3' }
  ]},

  { brand: 'Samsung', model: 'Galaxy S24 / S24+ / S24 Ultra', year: 2024, lenses: [
    { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
    { name: 'Wide (1x)', focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
    { name: 'Tele (3x)', focalMM: 9.0, equiv35MM: 70, aspect: '4:3' },
    { name: 'Tele (5x)* (Ultra)', focalMM: 26.0, equiv35MM: 120, aspect: '4:3' }
  ]},
];
