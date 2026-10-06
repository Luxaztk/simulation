import { describe, it, expect } from 'vitest';
import { parseChemicalFormula } from './formula-parser';

describe('Chemical Formula Parser', () => {
  it('phân tích chính xác đơn chất', () => {
    const o2 = parseChemicalFormula('O2');
    expect(o2.composition).toEqual({ O: 2 });
    expect(o2.molarMass).toBeCloseTo(31.998, 2);

    const fe = parseChemicalFormula('Fe');
    expect(fe.composition).toEqual({ Fe: 1 });
    expect(fe.molarMass).toBeCloseTo(55.845, 2);
  });

  it('phân tích chính xác hợp chất đơn giản', () => {
    const h2o = parseChemicalFormula('H2O');
    expect(h2o.composition).toEqual({ H: 2, O: 1 });
    expect(h2o.molarMass).toBeCloseTo(18.015, 2);

    const kmno4 = parseChemicalFormula('KMnO4');
    expect(kmno4.composition).toEqual({ K: 1, Mn: 1, O: 4 });
  });

  it('phân tích chính xác công thức có 1 cặp ngoặc', () => {
    const feOh2 = parseChemicalFormula('Fe(OH)2');
    expect(feOh2.composition).toEqual({ Fe: 1, O: 2, H: 2 });
    expect(feOh2.molarMass).toBeCloseTo(89.86, 1);

    const cuNo32 = parseChemicalFormula('Cu(NO3)2');
    expect(cuNo32.composition).toEqual({ Cu: 1, N: 2, O: 6 });
  });

  it('phân tích chính xác công thức phức tạp nhiều cặp ngoặc', () => {
    const al2So43 = parseChemicalFormula('Al2(SO4)3');
    expect(al2So43.composition).toEqual({ Al: 2, S: 3, O: 12 });

    const nh42So4 = parseChemicalFormula('(NH4)2SO4');
    expect(nh42So4.composition).toEqual({ N: 2, H: 8, S: 1, O: 4 });
  });

  it('ném ngoại lệ với cú pháp sai', () => {
    expect(() => parseChemicalFormula('')).toThrow();
    expect(() => parseChemicalFormula('Fe(OH')).toThrow();
    expect(() => parseChemicalFormula('Xx2O3')).toThrow(); // Nguyên tố không tồn tại
  });
});
