import { describe, it, expect } from 'vitest';
import { determineOxidationStates } from './oxidation-detector';

describe('Oxidation State Detector', () => {
  it('đơn chất có số oxi hóa bằng 0', () => {
    expect(determineOxidationStates('Fe').states).toEqual({ Fe: 0 });
    expect(determineOxidationStates('O2').states).toEqual({ O: 0 });
    expect(determineOxidationStates('Cu').states).toEqual({ Cu: 0 });
    expect(determineOxidationStates('Cl2').states).toEqual({ Cl: 0 });
  });

  it('xác định chính xác các chất trong phản ứng Fe(OH)2 + O2 + H2O -> Fe(OH)3', () => {
    const feOh2 = determineOxidationStates('Fe(OH)2');
    expect(feOh2.states.Fe).toBe(2);
    expect(feOh2.states.O).toBe(-2);
    expect(feOh2.states.H).toBe(1);

    const feOh3 = determineOxidationStates('Fe(OH)3');
    expect(feOh3.states.Fe).toBe(3);
    expect(feOh3.states.O).toBe(-2);
    expect(feOh3.states.H).toBe(1);
  });

  it('xác định chính xác các hợp chất trong phản ứng Cu + HNO3', () => {
    const hno3 = determineOxidationStates('HNO3');
    expect(hno3.states.H).toBe(1);
    expect(hno3.states.O).toBe(-2);
    expect(hno3.states.N).toBe(5);

    const cuNo32 = determineOxidationStates('Cu(NO3)2');
    expect(cuNo32.states.Cu).toBe(2);
    expect(cuNo32.states.N).toBe(5);
    expect(cuNo32.states.O).toBe(-2);

    const no = determineOxidationStates('NO');
    expect(no.states.N).toBe(2);
    expect(no.states.O).toBe(-2);
  });

  it('xác định chính xác thuốc thử KMnO4 + HCl', () => {
    const kmno4 = determineOxidationStates('KMnO4');
    expect(kmno4.states.K).toBe(1);
    expect(kmno4.states.O).toBe(-2);
    expect(kmno4.states.Mn).toBe(7);

    const hcl = determineOxidationStates('HCl');
    expect(hcl.states.H).toBe(1);
    expect(hcl.states.Cl).toBe(-1);

    const mncl2 = determineOxidationStates('MnCl2');
    expect(mncl2.states.Mn).toBe(2);
    expect(mncl2.states.Cl).toBe(-1);
  });

  it('xác định chính xác muối sắt sulfate', () => {
    const feso4 = determineOxidationStates('FeSO4');
    expect(feso4.states.Fe).toBe(2);
    expect(feso4.states.S).toBe(6);
    expect(feso4.states.O).toBe(-2);

    const fe2so43 = determineOxidationStates('Fe2(SO4)3');
    expect(fe2so43.states.Fe).toBe(3);
    expect(fe2so43.states.S).toBe(6);
    expect(fe2so43.states.O).toBe(-2);
  });
});
