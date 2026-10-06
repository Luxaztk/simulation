import { ATOMIC_MASSES, MOLAR_GAS_VOLUME_25C } from '../constants/constants';
import { SPECIES_CATALOG, SpeciesId } from './species';

/**
 * Calculates exact molar mass (g/mol) from elemental composition
 */
export function calculateMolarMass(speciesId: SpeciesId): number {
  const comp = SPECIES_CATALOG[speciesId].composition;
  const mass =
    comp.Fe * ATOMIC_MASSES.Fe +
    comp.O * ATOMIC_MASSES.O +
    comp.H * ATOMIC_MASSES.H;
  return Number(mass.toFixed(3));
}

export const MOLAR_MASSES: Record<SpeciesId, number> = {
  fe_oh2: calculateMolarMass('fe_oh2'), // ~89.86 g/mol
  o2: calculateMolarMass('o2'),         // ~32.00 g/mol
  h2o: calculateMolarMass('h2o'),       // ~18.02 g/mol
  fe_oh3: calculateMolarMass('fe_oh3'), // ~106.87 g/mol
};

/**
 * Converts mass (g) to moles (mol)
 */
export function massToMoles(speciesId: SpeciesId, massG: number): number {
  if (massG < 0) {
    throw new Error(`Khối lượng không thể âm (${massG}g cho ${speciesId})`);
  }
  return massG / MOLAR_MASSES[speciesId];
}

/**
 * Converts moles (mol) to mass (g)
 */
export function molesToMass(speciesId: SpeciesId, moles: number): number {
  if (moles < 0) {
    throw new Error(`Số mol không thể âm (${moles} mol cho ${speciesId})`);
  }
  return moles * MOLAR_MASSES[speciesId];
}

/**
 * Converts gas volume (Liters at 25°C, 1 bar) to moles for O2
 */
export function volumeToMolesO2(liters: number): number {
  if (liters < 0) {
    throw new Error(`Thể tích khí không thể âm (${liters} L)`);
  }
  return liters / MOLAR_GAS_VOLUME_25C;
}

/**
 * Converts moles of O2 to gas volume (Liters at 25°C, 1 bar)
 */
export function molesToVolumeO2(moles: number): number {
  if (moles < 0) {
    throw new Error(`Số mol không thể âm (${moles} mol)`);
  }
  return moles * MOLAR_GAS_VOLUME_25C;
}
