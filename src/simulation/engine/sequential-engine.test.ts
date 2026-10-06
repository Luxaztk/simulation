import { describe, it, expect } from 'vitest';
import { simulate } from './sequential-engine';
import {
  MOLAR_MASSES,
  massToMoles,
  molesToMass,
  volumeToMolesO2,
  molesToVolumeO2,
} from '../../domain/chemicals/molar-mass';

describe('Fe(OH)2 + O2 + H2O -> Fe(OH)3 Redox Simulation Engine', () => {
  it('Case 1: Stoichiometric complete reaction (4 mol Fe(OH)2 + 1 mol O2)', () => {
    const result = simulate({
      feOh2Mol: 4.0,
      o2Mol: 1.0,
      h2oMol: 10.0,
    });

    expect(result.status).toBe('completed');
    expect(result.conversionPercent).toBe(100);
    expect(result.species.fe_oh2).toBe(0);
    expect(result.species.o2).toBe(0);
    expect(result.species.fe_oh3).toBeCloseTo(4.0, 5);
    expect(result.electronTransfer.molesElectronsTransferred).toBeCloseTo(4.0, 5);
    expect(result.electronTransfer.isElectronBalanced).toBe(true);
    expect(result.precipitateColor.nameVi).toBe('Nâu đỏ');
    expect(result.massBalance.isValid).toBe(true);
  });

  it('Case 2: Deficient O2 (4 mol Fe(OH)2 + 0.5 mol O2) - partial oxidation', () => {
    const result = simulate({
      feOh2Mol: 4.0,
      o2Mol: 0.5,
      h2oMol: 10.0,
    });

    expect(result.status).toBe('partial_insufficient_o2');
    expect(result.conversionPercent).toBeCloseTo(50, 1);
    expect(result.species.fe_oh2).toBeCloseTo(2.0, 5);
    expect(result.species.o2).toBe(0);
    expect(result.species.fe_oh3).toBeCloseTo(2.0, 5);
    expect(result.electronTransfer.molesElectronsTransferred).toBeCloseTo(2.0, 5);
    expect(result.precipitateColor.nameVi).toBe('Xanh rêu ngả nâu');
    expect(result.massBalance.isValid).toBe(true);
  });

  it('Case 3: Excess O2 (4 mol Fe(OH)2 + 2 mol O2)', () => {
    const result = simulate({
      feOh2Mol: 4.0,
      o2Mol: 2.0,
      h2oMol: 10.0,
    });

    expect(result.status).toBe('completed');
    expect(result.species.fe_oh2).toBe(0);
    expect(result.species.o2).toBeCloseTo(1.0, 5); // 1 mol O2 remaining
    expect(result.species.fe_oh3).toBeCloseTo(4.0, 5);
    expect(result.massBalance.isValid).toBe(true);
  });

  it('Case 4: No O2 supplied (inert atmosphere)', () => {
    const result = simulate({
      feOh2Mol: 2.0,
      o2Mol: 0,
      h2oMol: 10.0,
    });

    expect(result.species.fe_oh2).toBeCloseTo(2.0, 5);
    expect(result.species.fe_oh3).toBe(0);
    expect(result.electronTransfer.molesElectronsTransferred).toBe(0);
    expect(result.precipitateColor.nameVi).toBe('Trắng xanh');
    expect(result.massBalance.isValid).toBe(true);
  });

  it('Case 5: Strict Elemental Balance (Fe, O, H) with non-integer numbers', () => {
    const result = simulate({
      feOh2Mol: 1.738,
      o2Mol: 0.612,
      h2oMol: 5.432,
    });

    expect(result.massBalance.isValid).toBe(true);
    expect(result.massBalance.feBalance.difference).toBeLessThan(1e-6);
    expect(result.massBalance.oBalance.difference).toBeLessThan(1e-6);
    expect(result.massBalance.hBalance.difference).toBeLessThan(1e-6);
    expect(result.massBalance.massDifferenceG).toBeLessThan(1e-4);
  });

  it('Case 6: Unit conversions (Mass & Gas Volume for O2)', () => {
    expect(MOLAR_MASSES.fe_oh2).toBeCloseTo(89.86, 1);
    expect(MOLAR_MASSES.fe_oh3).toBeCloseTo(106.87, 1);

    // 89.86 g Fe(OH)2 = 1.0 mol
    const molFeOh2 = massToMoles('fe_oh2', MOLAR_MASSES.fe_oh2);
    expect(molFeOh2).toBeCloseTo(1.0, 5);

    // 24.79 L of O2 at 25°C, 1 bar = 1.0 mol O2
    const molO2 = volumeToMolesO2(24.79);
    expect(molO2).toBeCloseTo(1.0, 4);

    const litersO2 = molesToVolumeO2(1.0);
    expect(litersO2).toBeCloseTo(24.79, 4);
  });
});
