/**
 * Physical, chemical, and numerical constants
 */

export const EPSILON = 1e-7;

export const MASS_BALANCE_TOLERANCE = 1e-5;

// Standard IUPAC atomic weights (g/mol)
export const ATOMIC_MASSES = {
  Fe: 55.845,
  O: 15.999,
  H: 1.008,
  C: 12.011,
} as const;

// Standard molar volume of gas at 25°C, 1 bar (L/mol - CT GDPT 2018)
export const MOLAR_GAS_VOLUME_25C = 24.79;
