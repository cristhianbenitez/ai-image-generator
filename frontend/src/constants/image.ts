export const RESOLUTIONS = [
  '1024 × 1024 (1:1)',
  '1152 × 896 (9:7)',
  '896 × 1152 (7:9)',
  '1344 × 768 (7:4)',
  '768 × 1344 (4:7)'
] as const;

export const COLORS = [
  'Red',
  'Orange',
  'Green',
  'Blue',
  'Purple',
  'White'
] as const;

export const COLORSHEX = {
  Red: '#DD524C',
  Orange: '#E87B35',
  Green: '#5EC269',
  Blue: '#4E80EE',
  Purple: '#9D59EF',
  White: '#E4E4E7'
} as const;

export const GUIDANCE_SCALE = {
  MIN: 1.0,
  MAX: 15.0,
  DEFAULT: 7.0,
  STEP: 0.1
} as const;

export const BREAKPOINT_COLUMNS = {
  default: 4,
  1024: 3,
  900: 2,
  640: 1
};
