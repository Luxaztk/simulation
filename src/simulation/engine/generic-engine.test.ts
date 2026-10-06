import { describe, it, expect } from 'vitest';
import { balanceChemicalEquation } from '../../domain/balancer/equation-balancer';
import { simulateGenericReaction } from './generic-engine';

describe('Generic Simulation Engine', () => {
  it('mô phỏng định lượng tỉ lượng hoàn toàn cho Fe(OH)2 + O2 + H2O -> Fe(OH)3', () => {
    const rxn = balanceChemicalEquation('Fe(OH)2 + O2 + H2O -> Fe(OH)3');
    const state = simulateGenericReaction({
      balancedReaction: rxn,
      initialMoles: {
        'Fe(OH)2': 4.0,
        'O2': 1.0,
        'H2O': 10.0,
      },
    });

    expect(state.extentXi).toBe(1.0);
    expect(state.limitingReactantFormula).toBe('Fe(OH)2'); // Cả Fe(OH)2 và O2 đều đạt min 1.0
    expect(state.finalMoles['Fe(OH)2']).toBe(0);
    expect(state.finalMoles['O2']).toBe(0);
    expect(state.finalMoles['H2O']).toBe(8.0);
    expect(state.finalMoles['Fe(OH)3']).toBe(4.0);
    expect(state.electronsTransferredMoles).toBe(4.0); // 4 * 1.0 = 4 mol e
    expect(state.isMassConserved).toBe(true);
  });

  it('mô phỏng chính xác trường hợp thiếu axit: Cu + HNO3 -> Cu(NO3)2 + NO + H2O', () => {
    // 3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O
    const rxn = balanceChemicalEquation('Cu + HNO3 -> Cu(NO3)2 + NO + H2O');
    const state = simulateGenericReaction({
      balancedReaction: rxn,
      initialMoles: {
        'Cu': 3.0,
        'HNO3': 4.0, // Cần 8.0, chỉ có 4.0 => xi = 4 / 8 = 0.5
      },
    });

    expect(state.extentXi).toBe(0.5);
    expect(state.limitingReactantFormula).toBe('HNO3');
    expect(state.finalMoles['Cu']).toBeCloseTo(1.5, 4); // 3 - 3*0.5 = 1.5 mol
    expect(state.finalMoles['HNO3']).toBe(0);
    expect(state.finalMoles['Cu(NO3)2']).toBeCloseTo(1.5, 4); // 3 * 0.5 = 1.5 mol
    expect(state.finalMoles['NO']).toBeCloseTo(1.0, 4); // 2 * 0.5 = 1.0 mol
    expect(state.finalMoles['H2O']).toBeCloseTo(2.0, 4); // 4 * 0.5 = 2.0 mol
    expect(state.electronsTransferredMoles).toBeCloseTo(3.0, 4); // 6 * 0.5 = 3 mol e
    expect(state.isMassConserved).toBe(true);
  });

  it('bảo toàn tất cả các nguyên tố xuất hiện trong phản ứng', () => {
    const rxn = balanceChemicalEquation('KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O');
    const state = simulateGenericReaction({
      balancedReaction: rxn,
      initialMoles: {
        'KMnO4': 2.0,
        'HCl': 20.0,
      },
    });

    expect(state.isMassConserved).toBe(true);
    for (const b of state.elementBalances) {
      expect(b.isConserved).toBe(true);
    }
  });
});
