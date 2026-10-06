/**
 * Bộ xác định số oxi hóa tự động cho các nguyên tố trong phân tử
 * Áp dụng hệ thống quy tắc thứ tự ưu tiên chuẩn IUPAC và SGK Hóa học 10
 */

import { parseChemicalFormula, ParsedSpecies } from '../parser/formula-parser';

export interface OxidationStateResult {
  readonly formula: string;
  readonly states: Record<string, number>;
}

// Bảng số oxi hóa cố định của một số kim loại điển hình
const FIXED_METAL_OXIDATION: Record<string, number> = {
  // Kim loại kiềm (Nhóm IA)
  Li: 1,
  Na: 1,
  K: 1,
  Rb: 1,
  Cs: 1,
  // Kim loại kiềm thổ (Nhóm IIA)
  Be: 2,
  Mg: 2,
  Ca: 2,
  Sr: 2,
  Ba: 2,
  // Kim loại khác có số ox duy nhất trong hợp chất
  Al: 3,
  Zn: 2,
  Ag: 1,
};

// Các gốc axit / ion đa nguyên tử phổ biến
const KNOWN_RADICALS: Array<{
  pattern: RegExp;
  states: Record<string, number>;
}> = [
  { pattern: /SO4/i, states: { S: 6, O: -2 } },
  { pattern: /SO3/i, states: { S: 4, O: -2 } },
  { pattern: /NO3/i, states: { N: 5, O: -2 } },
  { pattern: /NO2/i, states: { N: 3, O: -2 } },
  { pattern: /CO3/i, states: { C: 4, O: -2 } },
  { pattern: /PO4/i, states: { P: 5, O: -2 } },
  { pattern: /Cr2O7/i, states: { Cr: 6, O: -2 } },
  { pattern: /CrO4/i, states: { Cr: 6, O: -2 } },
  { pattern: /MnO4/i, states: { Mn: 7, O: -2 } },
];

/**
 * Xác định số oxi hóa của các nguyên tố trong một công thức hóa học
 */
export function determineOxidationStates(formulaOrParsed: string | ParsedSpecies): OxidationStateResult {
  const parsed = typeof formulaOrParsed === 'string'
    ? parseChemicalFormula(formulaOrParsed)
    : formulaOrParsed;

  const { formula, composition } = parsed;
  const elements = Object.keys(composition);
  const states: Record<string, number> = {};

  // QUY TẮC 1: ĐƠN CHẤT (Chỉ có duy nhất 1 nguyên tố)
  if (elements.length === 1) {
    const el = elements[0];
    states[el] = 0;
    return { formula, states };
  }

  // QUY TẮC 2: HỢP CHẤT ĐẶC BIỆT CỤ THỂ
  if (formula === 'H2O2') {
    return { formula, states: { H: 1, O: -1 } };
  }
  if (formula === 'OF2') {
    return { formula, states: { O: 2, F: -1 } };
  }
  if (formula === 'Fe3O4') {
    return { formula, states: { Fe: Number((8 / 3).toFixed(3)), O: -2 } };
  }

  // 1. Gán Fluorine luôn là -1
  if (composition.F !== undefined) {
    states.F = -1;
  }

  // 2. Gán các kim loại có số oxi hóa cố định (IA, IIA, Al, Zn, Ag)
  for (const el of elements) {
    if (FIXED_METAL_OXIDATION[el] !== undefined) {
      states[el] = FIXED_METAL_OXIDATION[el];
    }
  }

  // 3. Kiểm tra các gốc ion axit đã biết
  for (const radical of KNOWN_RADICALS) {
    if (radical.pattern.test(formula)) {
      for (const [el, val] of Object.entries(radical.states)) {
        if (composition[el] !== undefined && states[el] === undefined) {
          states[el] = val;
        }
      }
    }
  }

  // 4. Kiểm tra nhóm hydroxide (OH)
  if (formula.includes('(OH)') || formula.endsWith('OH')) {
    if (states.O === undefined) states.O = -2;
    if (states.H === undefined) states.H = 1;
  }

  // 5. Halide trong muối kim loại hoặc hydro halide (Cl, Br, I)
  // Nếu có halogen và một kim loại hoặc H, và không có O $\implies$ Halogen = -1
  const halogens = ['Cl', 'Br', 'I'];
  for (const hal of halogens) {
    if (composition[hal] !== undefined && states[hal] === undefined) {
      // Nếu hợp chất không có Oxygen hoặc các phi kim âm điện hơn
      if (composition.O === undefined && composition.F === undefined) {
        states[hal] = -1;
      }
    }
  }

  // 6. Gán H (+1) nếu chưa có (trừ khi liên kết chỉ với kim loại kiềm)
  if (composition.H !== undefined && states.H === undefined) {
    states.H = 1;
  }

  // 7. Gán O (-2) nếu chưa có
  if (composition.O !== undefined && states.O === undefined) {
    states.O = -2;
  }

  // 8. TÍNH NGUYÊN TỐ CÒN LẠI DỰA TRÊN TỔNG ĐIỆN TÍCH BẰNG 0
  const unknownElements = elements.filter((el) => states[el] === undefined);

  if (unknownElements.length === 1) {
    const unknown = unknownElements[0];
    let knownSum = 0;
    for (const [el, count] of Object.entries(composition)) {
      if (el !== unknown) {
        knownSum += count * (states[el] || 0);
      }
    }
    const unknownCount = composition[unknown];
    const calculatedOx = -knownSum / unknownCount;
    // Làm tròn nếu gần nguyên
    states[unknown] = Math.abs(calculatedOx - Math.round(calculatedOx)) < 1e-4
      ? Math.round(calculatedOx)
      : Number(calculatedOx.toFixed(3));
  } else if (unknownElements.length > 1) {
    // Trường hợp còn nhiều hơn 1 nguyên tố chưa biết (thường hiếm trong vô cơ phổ thông)
    // Áp dụng độ âm điện hoặc giả định gốc quen thuộc
    for (const unknown of unknownElements) {
      states[unknown] = 0; // Fallback an toàn
    }
  }

  return { formula, states };
}

/**
 * So sánh số oxi hóa của một nguyên tố giữa chất tham gia và sản phẩm
 */
export function getOxidationChange(
  element: string,
  reactantState: Record<string, number>,
  productState: Record<string, number>
): { before: number; after: number; delta: number } | null {
  if (reactantState[element] === undefined || productState[element] === undefined) {
    return null;
  }
  const before = reactantState[element];
  const after = productState[element];
  return {
    before,
    after,
    delta: after - before,
  };
}
