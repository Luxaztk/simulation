import { EPSILON, MASS_BALANCE_TOLERANCE } from '../../domain/constants/constants';
import { MOLAR_MASSES } from '../../domain/chemicals/molar-mass';
import {
  ElementBalanceRecord,
  MassBalanceValidation,
  SpeciesMoles,
} from '../state/simulation-state';

/**
 * Calculates total atoms of Fe, O, H for a given species distribution
 */
export function calculateElementalMoles(species: SpeciesMoles): {
  fe: number;
  o: number;
  h: number;
} {
  const fe = 1 * species.fe_oh2 + 1 * species.fe_oh3;
  const o = 2 * species.fe_oh2 + 2 * species.o2 + 1 * species.h2o + 3 * species.fe_oh3;
  const h = 2 * species.fe_oh2 + 2 * species.h2o + 3 * species.fe_oh3;

  return { fe, o, h };
}

/**
 * Calculates total mass in grams of the system
 */
export function calculateTotalMassG(species: SpeciesMoles): number {
  return (
    species.fe_oh2 * MOLAR_MASSES.fe_oh2 +
    species.o2 * MOLAR_MASSES.o2 +
    species.h2o * MOLAR_MASSES.h2o +
    species.fe_oh3 * MOLAR_MASSES.fe_oh3
  );
}

/**
 * Validates element and mass conservation between initial and final states
 */
export function validateMassBalance(
  initial: SpeciesMoles,
  final: SpeciesMoles,
  tolerance: number = MASS_BALANCE_TOLERANCE
): MassBalanceValidation {
  // Check for negative species
  for (const [key, val] of Object.entries(final)) {
    if (val < -EPSILON) {
      throw new Error(
        `Mass balance violation: Cấu tử ${key} có số mol âm (${val.toFixed(8)} mol)`
      );
    }
  }

  const inElements = calculateElementalMoles(initial);
  const outElements = calculateElementalMoles(final);

  const diffFe = Math.abs(outElements.fe - inElements.fe);
  const diffO = Math.abs(outElements.o - inElements.o);
  const diffH = Math.abs(outElements.h - inElements.h);

  const feRecord: ElementBalanceRecord = {
    element: 'Fe',
    initialMoles: inElements.fe,
    finalMoles: outElements.fe,
    difference: diffFe,
    balanced: diffFe <= tolerance,
  };

  const oRecord: ElementBalanceRecord = {
    element: 'O',
    initialMoles: inElements.o,
    finalMoles: outElements.o,
    difference: diffO,
    balanced: diffO <= tolerance,
  };

  const hRecord: ElementBalanceRecord = {
    element: 'H',
    initialMoles: inElements.h,
    finalMoles: outElements.h,
    difference: diffH,
    balanced: diffH <= tolerance,
  };

  const totalInitialMassG = calculateTotalMassG(initial);
  const totalFinalMassG = calculateTotalMassG(final);
  const massDifferenceG = Math.abs(totalFinalMassG - totalInitialMassG);
  const massBalanced = massDifferenceG <= tolerance * 100;

  const isValid = feRecord.balanced && oRecord.balanced && hRecord.balanced;

  return {
    isValid,
    tolerance,
    feBalance: feRecord,
    oBalance: oRecord,
    hBalance: hRecord,
    totalInitialMassG,
    totalFinalMassG,
    massDifferenceG,
    massBalanced,
  };
}
