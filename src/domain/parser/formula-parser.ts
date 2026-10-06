/**
 * Bộ phân tích cú pháp công thức hóa học (Chemical Formula Parser)
 * Hỗ trợ phân tích cấu tử đơn chất, hợp chất và các cụm ngoặc lồng nhau (e.g., Fe(OH)2, Al2(SO4)3, (NH4)2SO4)
 */

import { getElement, isValidElement } from '../periodic-table/elements';

export interface ParsedSpecies {
  readonly formula: string;
  readonly latex: string;
  readonly composition: Record<string, number>;
  readonly molarMass: number;
}

/**
 * Phân tích cú pháp chuỗi công thức thành bảng thành phần nguyên tố { [symbol: string]: count }
 */
export function parseChemicalFormula(rawFormula: string): ParsedSpecies {
  const formula = rawFormula.trim().replace(/\s+/g, '');
  if (!formula) {
    throw new Error('Công thức hóa học không được để trống.');
  }

  const composition = parseFormulaInternal(formula);
  const molarMass = calculateMolarMass(composition);
  const latex = formatFormulaToLatex(formula);

  return {
    formula,
    latex,
    composition,
    molarMass,
  };
}

/**
 * Thuật toán đệ quy/ngăn xếp phân tích công thức có ngoặc
 */
function parseFormulaInternal(formula: string): Record<string, number> {
  let index = 0;

  function parseSubgroup(): Record<string, number> {
    const counts: Record<string, number> = {};

    while (index < formula.length) {
      const char = formula[index];

      if (char === '(' || char === '[' || char === '{') {
        const closeChar = char === '(' ? ')' : char === '[' ? ']' : '}';
        index++; // bỏ qua mở ngoặc
        const innerCounts = parseSubgroup();

        if (index >= formula.length || formula[index] !== closeChar) {
          throw new Error(`Thiếu dấu đóng ngoặc '${closeChar}' trong công thức: ${formula}`);
        }
        index++; // bỏ qua đóng ngoặc

        // Đọc chỉ số nhân sau dấu ngoặc
        let multiplier = 1;
        const numStart = index;
        while (index < formula.length && isDigit(formula[index])) {
          index++;
        }
        if (index > numStart) {
          multiplier = parseInt(formula.slice(numStart, index), 10);
        }

        // Nhân vào counts
        for (const [el, count] of Object.entries(innerCounts)) {
          counts[el] = (counts[el] || 0) + count * multiplier;
        }
      } else if (char === ')' || char === ']' || char === '}') {
        // Gặp dấu đóng ngoặc của nhóm hiện tại, trả về để nhóm ngoài xử lý
        break;
      } else if (isUpperCase(char)) {
        // Đọc tên nguyên tố (1 chữ cái viết hoa + 0 hoặc 1-2 chữ cái viết thường)
        const elStart = index;
        index++;
        while (index < formula.length && isLowerCase(formula[index])) {
          index++;
        }
        const symbol = formula.slice(elStart, index);

        if (!isValidElement(symbol)) {
          throw new Error(`Nguyên tố hóa học '${symbol}' không tồn tại hoặc chưa được hỗ trợ.`);
        }

        // Đọc chỉ số nguyên tử đi sau
        let count = 1;
        const numStart = index;
        while (index < formula.length && isDigit(formula[index])) {
          index++;
        }
        if (index > numStart) {
          count = parseInt(formula.slice(numStart, index), 10);
        }

        counts[symbol] = (counts[symbol] || 0) + count;
      } else {
        throw new Error(`Ký tự không hợp lệ '${char}' tại vị trí ${index} trong công thức: ${formula}`);
      }
    }

    return counts;
  }

  const result = parseSubgroup();
  if (Object.keys(result).length === 0) {
    throw new Error(`Công thức hóa học không hợp lệ: ${formula}`);
  }
  return result;
}

function isUpperCase(char: string): boolean {
  return char >= 'A' && char <= 'Z';
}

function isLowerCase(char: string): boolean {
  return char >= 'a' && char <= 'z';
}

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

/**
 * Tính tổng khối lượng mol từ composition
 */
export function calculateMolarMass(composition: Record<string, number>): number {
  let total = 0;
  for (const [symbol, count] of Object.entries(composition)) {
    const el = getElement(symbol);
    if (!el) {
      throw new Error(`Không tìm thấy nguyên tố: ${symbol}`);
    }
    total += el.atomicMass * count;
  }
  return Number(total.toFixed(4));
}

/**
 * Chuyển công thức thường sang định dạng LaTeX
 * Ví dụ: Fe(OH)2 -> \text{Fe(OH)}_2
 */
export function formatFormulaToLatex(formula: string): string {
  // Thay thế số bằng chỉ số dưới _{n}
  const formatted = formula.replace(/(\d+)/g, '_$1');
  return `\\text{${formatted}}`;
}

/**
 * Chuyển đổi giữa mol và gam cho một chất đã phân tích
 */
export function molesToGrams(moles: number, molarMass: number): number {
  return Number((moles * molarMass).toFixed(4));
}

export function gramsToMoles(grams: number, molarMass: number): number {
  if (molarMass <= 0) return 0;
  return Number((grams / molarMass).toFixed(4));
}
