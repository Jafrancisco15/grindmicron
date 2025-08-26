export type PhoneLens = {
  name: string;          // e.g., 'Wide (1x)'
  focalMM: number;       // actual focal length in mm (approx)
  equiv35MM: number;     // 35mm equivalent focal length
  aspect: '4:3' | '3:2' | '16:9';
};

export type PhoneSpec = {
  brand: string;
  model: string;
  year?: number;
  lenses: PhoneLens[];
};

// NOTE: Values are reasonable approximations intended for scale estimation when EXIF is incomplete.
// For highest accuracy, the EXIF path is preferred (focal length + 35mm-equiv + distance).
export const PHONE_SPECS: PhoneSpec[] = [
  {
    brand: 'Apple', model: 'iPhone 11', year: 2019,
    lenses: [
      { name: 'Ultra-Wide (0.5x)', focalMM: 1.54, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',       focalMM: 4.25, equiv35MM: 26, aspect: '4:3' }
    ]
  },
  {
    brand: 'Apple', model: 'iPhone 12 / 12 Pro / 12 mini', year: 2020,
    lenses: [
      { name: 'Ultra-Wide (0.5x)', focalMM: 1.54, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',       focalMM: 5.1,  equiv35MM: 26, aspect: '4:3' },
      { name: 'Tele (2x/2.5x/3x)*', focalMM: 7.65, equiv35MM: 52, aspect: '4:3' }
    ]
  },
  {
    brand: 'Apple', model: 'iPhone 13 / 13 Pro', year: 2021,
    lenses: [
      { name: 'Ultra-Wide (0.5x)', focalMM: 1.57, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 5.7,  equiv35MM: 26, aspect: '4:3' },
      { name: 'Tele (3x)',         focalMM: 9.0,  equiv35MM: 77, aspect: '4:3' }
    ]
  },
  {
    brand: 'Apple', model: 'iPhone 14 / 14 Pro', year: 2022,
    lenses: [
      { name: 'Ultra-Wide (0.5x)', focalMM: 1.57, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 6.86, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x)',         focalMM: 9.0,  equiv35MM: 77, aspect: '4:3' }
    ]
  },
  {
    brand: 'Apple', model: 'iPhone 15 / 15 Pro', year: 2023,
    lenses: [
      { name: 'Ultra-Wide (0.5x)', focalMM: 1.57, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 6.86, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x/5x)*',     focalMM: 9.0,  equiv35MM: 77, aspect: '4:3' }
    ]
  },
  {
    brand: 'Google', model: 'Pixel 6 / 6 Pro', year: 2021,
    lenses: [
      { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 6.81, equiv35MM: 25, aspect: '4:3' },
      { name: 'Tele (4x)*',        focalMM: 19.0, equiv35MM: 104, aspect: '4:3' }
    ]
  },
  {
    brand: 'Google', model: 'Pixel 7 / 7 Pro', year: 2022,
    lenses: [
      { name: 'Ultra-Wide (0.7x)', focalMM: 1.95, equiv35MM: 16, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 6.81, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (5x)*',        focalMM: 26.0, equiv35MM: 120, aspect: '4:3' }
    ]
  },
  {
    brand: 'Google', model: 'Pixel 8 / 8 Pro', year: 2023,
    lenses: [
      { name: 'Ultra-Wide (0.5–0.7x)', focalMM: 2.0, equiv35MM: 14, aspect: '4:3' },
      { name: 'Wide (1x)',             focalMM: 6.5, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (5x)*',            focalMM: 26.0, equiv35MM: 120, aspect: '4:3' }
    ]
  },
  {
    brand: 'Samsung', model: 'Galaxy S21 / S21 Ultra', year: 2021,
    lenses: [
      { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x/10x)*',    focalMM: 10.0, equiv35MM: 70, aspect: '4:3' }
    ]
  },
  {
    brand: 'Samsung', model: 'Galaxy S22 / S22 Ultra', year: 2022,
    lenses: [
      { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x/10x)*',    focalMM: 10.0, equiv35MM: 70, aspect: '4:3' }
    ]
  },
  {
    brand: 'Samsung', model: 'Galaxy S23 / S23 Ultra', year: 2023,
    lenses: [
      { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x/10x)*',    focalMM: 10.0, equiv35MM: 70, aspect: '4:3' }
    ]
  },
  {
    brand: 'Samsung', model: 'Galaxy S24 / S24 Ultra', year: 2024,
    lenses: [
      { name: 'Ultra-Wide (0.6x)', focalMM: 1.8, equiv35MM: 13, aspect: '4:3' },
      { name: 'Wide (1x)',         focalMM: 5.4, equiv35MM: 24, aspect: '4:3' },
      { name: 'Tele (3x/5–10x)*',  focalMM: 9.0, equiv35MM: 70, aspect: '4:3' }
    ]
  }
];
