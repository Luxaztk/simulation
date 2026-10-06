/**
 * Bộ cân bằng phương trình hóa học tự động & Phân tích bản chất Oxi hóa - Khử
 * Sử dụng giải thuật Khử Gauss-Jordan trên ma trận số hữu tỉ chính xác (Exact Rational Nullspace)
 * và đối chiếu phương pháp Thăng Bằng Electron (Electron Balance Method)
 */

import { parseChemicalFormula, ParsedSpecies } from '../parser/formula-parser';
import { determineOxidationStates } from '../redox/oxidation-detector';

// ==========================================
// 1. EXACT RATIONAL ARITHMETIC (SỐ HỮU TỈ)
// ==========================================

function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcmBigInt(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  const g = gcdBigInt(a, b);
  return (a * b) / g;
}

export class Rational {
  readonly num: bigint;
  readonly den: bigint;

  constructor(num: bigint | number, den: bigint | number = 1n) {
    let n = BigInt(num);
    let d = BigInt(den);
    if (d === 0n) {
      throw new Error('Mẫu số không thể bằng 0');
    }
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = gcdBigInt(n, d);
    this.num = n / g;
    this.den = d / g;
  }

  static zero(): Rational {
    return new Rational(0n, 1n);
  }

  static one(): Rational {
    return new Rational(1n, 1n);
  }

  add(other: Rational): Rational {
    return new Rational(
      this.num * other.den + other.num * this.den,
      this.den * other.den
    );
  }

  sub(other: Rational): Rational {
    return new Rational(
      this.num * other.den - other.num * this.den,
      this.den * other.den
    );
  }

  mul(other: Rational): Rational {
    return new Rational(this.num * other.num, this.den * other.den);
  }

  div(other: Rational): Rational {
    if (other.num === 0n) throw new Error('Chia cho 0');
    return new Rational(this.num * other.den, this.den * other.num);
  }

  isZero(): boolean {
    return this.num === 0n;
  }

  isPositive(): boolean {
    return this.num > 0n;
  }

  toNumber(): number {
    return Number(this.num) / Number(this.den);
  }
}

// ==========================================
// 2. DATA TYPES & INTERFACES
// ==========================================

export interface FormulaConditionExtraction {
  readonly formula: string;
  readonly conditions: string[];
}

export function extractConditionAndFormula(raw: string): FormulaConditionExtraction {
  let s = raw.trim();
  const conditions: string[] = [];

  // Bỏ hệ số đứng trước nếu người dùng lỡ gõ (e.g. "2KClO3" -> "KClO3")
  const leadingMatch = s.match(/^\d+\s*([A-Za-z(].*)$/);
  if (leadingMatch) {
    s = leadingMatch[1].trim();
  }

  // Bắt các điều kiện như (đặc), đặc, (loãng), loãng
  if (/\((đặc|dac|conc)\)/i.test(s) || /\s+(đặc|dac|conc)\b/i.test(s)) {
    conditions.push('đặc');
    s = s.replace(/\((đặc|dac|conc)\)/gi, '').replace(/\s+(đặc|dac|conc)\b/gi, '').trim();
  } else if (/\((loãng|loang|dil)\)/i.test(s) || /\s+(loãng|loang|dil)\b/i.test(s)) {
    conditions.push('loãng');
    s = s.replace(/\((loãng|loang|dil)\)/gi, '').replace(/\s+(loãng|loang|dil)\b/gi, '').trim();
  }

  // Bắt các điều kiện nhiệt độ t°, (t°), (t°C), (t0), t°C, nhiệt phân
  if (/\((t°|t°C|t0|to|nhiệt|nhiệt\s*phân|heat)\)/i.test(s) || /\b(t°|t°C|t0)\b/i.test(s)) {
    conditions.push('t°');
    s = s.replace(/\((t°|t°C|t0|to|nhiệt|nhiệt\s*phân|heat)\)/gi, '').replace(/\b(t°|t°C|t0)\b/gi, '').trim();
  }

  // Bỏ các trạng thái (r), (k), (dd), (lỏng), (rắn), (khí)
  s = s.replace(/\((r|k|dd|lỏng|long|khí|khi|rắn|ran)\)/gi, '').trim();

  return {
    formula: s,
    conditions,
  };
}

export interface BalancedSpecies {
  readonly formula: string;
  readonly parsed: ParsedSpecies;
  readonly coefficient: number;
  readonly isReactant: boolean;
  readonly role: 'reducing_agent' | 'oxidizing_agent' | 'self_redox' | 'medium' | 'product';
  readonly oxidationStates: Record<string, number>;
}

export interface HalfReaction {
  readonly element: string;
  readonly fromState: number;
  readonly toState: number;
  readonly electronsTransferred: number;
  readonly equationText: string;
  readonly roleNameVi: string;
  readonly substanceFormula: string;
}

export interface BalancedReactionResult {
  readonly rawEquation: string;
  readonly balancedEquation: string;
  readonly conditionLabel?: string;
  readonly reactionType: 'redox' | 'self_redox' | 'decomposition' | 'non_redox';
  readonly reactants: readonly BalancedSpecies[];
  readonly products: readonly BalancedSpecies[];
  readonly isRedox: boolean;
  readonly reducingAgent: BalancedSpecies | null;
  readonly oxidizingAgent: BalancedSpecies | null;
  readonly mediumSpecies: readonly BalancedSpecies[];
  readonly oxidationHalfReaction: HalfReaction | null;
  readonly reductionHalfReaction: HalfReaction | null;
  readonly electronsTransferred: number;
  readonly stoichiometryCoefficients: Record<string, number>;
}

// ==========================================
// 3. CHEMICAL EQUATION BALANCER
// ==========================================

/**
 * Cân bằng một phương trình hóa học từ chuỗi văn bản (e.g., "Fe(OH)2 + O2 + H2O -> Fe(OH)3")
 * hoặc từ mảng các chất tham gia và sản phẩm.
 */
export function balanceChemicalEquation(
  input: string | { reactants: string[]; products: string[]; conditions?: string[] }
): BalancedReactionResult {
  let reactantStrings: string[];
  let productStrings: string[];
  let rawEqText: string;
  const detectedConditions: string[] = [];

  if (typeof input === 'string') {
    rawEqText = input;
    const arrow = input.includes('->') ? '->' : input.includes('⟶') ? '⟶' : '=';
    const parts = input.split(arrow);
    if (parts.length !== 2) {
      throw new Error("Phương trình phải có dạng 'Chất tham gia -> Sản phẩm' (ngăn cách bởi '->' hoặc '=')");
    }
    reactantStrings = parts[0].split('+').map((s) => s.trim()).filter(Boolean);
    productStrings = parts[1].split('+').map((s) => s.trim()).filter(Boolean);
  } else {
    reactantStrings = input.reactants.map((s) => s.trim()).filter(Boolean);
    productStrings = input.products.map((s) => s.trim()).filter(Boolean);
    rawEqText = `${reactantStrings.join(' + ')} -> ${productStrings.join(' + ')}`;
    if (input.conditions) {
      input.conditions.forEach((c) => detectedConditions.push(c));
    }
  }

  if (reactantStrings.length === 0 || productStrings.length === 0) {
    throw new Error('Phương trình phải có ít nhất một chất tham gia và một sản phẩm.');
  }

  // Tách điều kiện phản ứng nếu có trong công thức
  const cleanedReactants: string[] = [];
  for (const r of reactantStrings) {
    const ext = extractConditionAndFormula(r);
    cleanedReactants.push(ext.formula);
    ext.conditions.forEach((c) => detectedConditions.push(c));
  }

  const cleanedProducts: string[] = [];
  for (const p of productStrings) {
    const ext = extractConditionAndFormula(p);
    cleanedProducts.push(ext.formula);
    ext.conditions.forEach((c) => detectedConditions.push(c));
  }

  // Parse từng chất
  const reactantParsed = cleanedReactants.map((f) => parseChemicalFormula(f));
  const productParsed = cleanedProducts.map((f) => parseChemicalFormula(f));

  // Tập hợp danh sách tất cả các nguyên tố duy nhất
  const allElementsSet = new Set<string>();
  reactantParsed.forEach((p) => Object.keys(p.composition).forEach((el) => allElementsSet.add(el)));
  productParsed.forEach((p) => Object.keys(p.composition).forEach((el) => allElementsSet.add(el)));
  const elements = Array.from(allElementsSet);

  // Kiểm tra tính toàn vẹn: Các nguyên tố ở vế trái phải xuất hiện ở vế phải
  const leftElements = new Set<string>();
  reactantParsed.forEach((p) => Object.keys(p.composition).forEach((el) => leftElements.add(el)));
  const rightElements = new Set<string>();
  productParsed.forEach((p) => Object.keys(p.composition).forEach((el) => rightElements.add(el)));

  for (const el of elements) {
    if (!leftElements.has(el)) {
      throw new Error(`Nguyên tố '${el}' có ở sản phẩm nhưng không có ở chất tham gia.`);
    }
    if (!rightElements.has(el)) {
      throw new Error(`Nguyên tố '${el}' có ở chất tham gia nhưng không có ở sản phẩm.`);
    }
  }

  const allSpecies = [...reactantParsed, ...productParsed];
  const numReactants = reactantParsed.length;
  const totalSpecies = allSpecies.length;
  const numElements = elements.length;

  // Xây dựng ma trận A: số dòng = numElements, số cột = totalSpecies
  // Reactant: +count, Product: -count
  const matrix: Rational[][] = [];
  for (let i = 0; i < numElements; i++) {
    const el = elements[i];
    const row: Rational[] = [];
    for (let j = 0; j < totalSpecies; j++) {
      const count = allSpecies[j].composition[el] || 0;
      if (j < numReactants) {
        row.push(new Rational(count));
      } else {
        row.push(new Rational(-count));
      }
    }
    matrix.push(row);
  }

  // Giải tìm vector nghiệm nguyên dương tối giản bằng Khử Gauss-Jordan
  const solution = solveNullspace(matrix, totalSpecies);
  if (!solution) {
    throw new Error(`Không thể cân bằng phương trình: ${rawEqText}. Vui lòng kiểm tra lại chất tham gia và sản phẩm.`);
  }

  // Xác định số oxi hóa của các chất
  const reactantOx = reactantParsed.map((p) => determineOxidationStates(p).states);
  const productOx = productParsed.map((p) => determineOxidationStates(p).states);

  // Phân tích vai trò Redox: tìm nguyên tố thay đổi số oxi hóa
  const changes: Array<{
    element: string;
    from: number;
    to: number;
    delta: number;
    reactantIndex: number;
    productIndex: number;
  }> = [];

  for (const el of elements) {
    // Thu thập tất cả các mức oxi hóa của nguyên tố el ở chất tham gia
    const reactantOccurrences: Array<{ rIdx: number; ox: number }> = [];
    for (let r = 0; r < reactantParsed.length; r++) {
      if (reactantParsed[r].composition[el] !== undefined && reactantOx[r][el] !== undefined) {
        reactantOccurrences.push({ rIdx: r, ox: reactantOx[r][el] });
      }
    }

    // Thu thập tất cả các mức oxi hóa của nguyên tố el ở sản phẩm
    const productOccurrences: Array<{ pIdx: number; ox: number }> = [];
    for (let p = 0; p < productParsed.length; p++) {
      if (productParsed[p].composition[el] !== undefined && productOx[p][el] !== undefined) {
        productOccurrences.push({ pIdx: p, ox: productOx[p][el] });
      }
    }

    // Đối chiếu từng cặp để phát hiện sự thay đổi số oxi hóa
    for (const rItem of reactantOccurrences) {
      for (const pItem of productOccurrences) {
        const delta = pItem.ox - rItem.ox;
        if (Math.abs(delta) > 1e-4) {
          // Tránh thêm trùng lặp cùng reactantIndex và cùng delta
          const existing = changes.find(
            (c) => c.element === el && c.reactantIndex === rItem.rIdx && c.delta === delta
          );
          if (!existing) {
            changes.push({
              element: el,
              from: rItem.ox,
              to: pItem.ox,
              delta,
              reactantIndex: rItem.rIdx,
              productIndex: pItem.pIdx,
            });
          }
        }
      }
    }
  }

  const isRedox = changes.length > 0;
  let reducingAgentIdx = -1;
  let oxidizingAgentIdx = -1;
  let oxHalf: HalfReaction | null = null;
  let redHalf: HalfReaction | null = null;
  let electronsTransferred = 0;

  if (isRedox) {
    // Nguyên tố tăng số oxi hóa -> Bán phản ứng oxi hóa (Chất khử)
    const donorChange = changes.find((c) => c.delta > 0);
    if (donorChange) {
      reducingAgentIdx = donorChange.reactantIndex;
      const eLost = donorChange.delta;
      const formula = reactantParsed[donorChange.reactantIndex].formula;
      oxHalf = {
        element: donorChange.element,
        fromState: donorChange.from,
        toState: donorChange.to,
        electronsTransferred: eLost,
        equationText: `${donorChange.element}⁺${donorChange.from} ⟶ ${donorChange.element}⁺${donorChange.to} + ${eLost}e⁻`,
        roleNameVi: 'Quá trình Oxi hóa (Sự oxi hóa)',
        substanceFormula: formula,
      };
      // Tính số electron trao đổi từ sản phẩm có số oxi hóa đã biến đổi
      const productIdx = donorChange.productIndex;
      const pCoeff = solution[numReactants + productIdx];
      const pAtoms = productParsed[productIdx].composition[donorChange.element] || 1;
      electronsTransferred = Math.round(pCoeff * pAtoms * eLost);
    }

    // Nguyên tố giảm số oxi hóa -> Bán phản ứng khử (Chất oxi hóa)
    const acceptorChange = changes.find((c) => c.delta < 0);
    if (acceptorChange) {
      oxidizingAgentIdx = acceptorChange.reactantIndex;
      const eGained = -acceptorChange.delta;
      const formula = reactantParsed[acceptorChange.reactantIndex].formula;
      redHalf = {
        element: acceptorChange.element,
        fromState: acceptorChange.from,
        toState: acceptorChange.to,
        electronsTransferred: eGained,
        equationText: `${acceptorChange.element}⁺${acceptorChange.from} + ${eGained}e⁻ ⟶ ${acceptorChange.element}⁺${acceptorChange.to}`,
        roleNameVi: 'Quá trình Khử (Sự khử)',
        substanceFormula: formula,
      };
      // Nếu chưa tính electronsTransferred từ donor, tính từ acceptor product
      if (electronsTransferred === 0) {
        const productIdx = acceptorChange.productIndex;
        const pCoeff = solution[numReactants + productIdx];
        const pAtoms = productParsed[productIdx].composition[acceptorChange.element] || 1;
        electronsTransferred = Math.round(pCoeff * pAtoms * eGained);
      }
    }
  }

  // Xây dựng danh sách BalancedSpecies cho reactants và products
  const reactantsList: BalancedSpecies[] = reactantParsed.map((p, idx) => {
    let role: 'reducing_agent' | 'oxidizing_agent' | 'self_redox' | 'medium' | 'product' = 'medium';
    if (idx === reducingAgentIdx && idx === oxidizingAgentIdx) {
      role = 'self_redox';
    } else if (idx === reducingAgentIdx) {
      role = 'reducing_agent';
    } else if (idx === oxidizingAgentIdx) {
      role = 'oxidizing_agent';
    }
    return {
      formula: p.formula,
      parsed: p,
      coefficient: solution[idx],
      isReactant: true,
      role,
      oxidationStates: reactantOx[idx],
    };
  });

  const productsList: BalancedSpecies[] = productParsed.map((p, idx) => {
    const solIdx = numReactants + idx;
    return {
      formula: p.formula,
      parsed: p,
      coefficient: solution[solIdx],
      isReactant: false,
      role: 'product',
      oxidationStates: productOx[idx],
    };
  });

  const stoichiometryCoefficients: Record<string, number> = {};
  reactantsList.forEach((r) => (stoichiometryCoefficients[r.formula] = r.coefficient));
  productsList.forEach((p) => (stoichiometryCoefficients[p.formula] = p.coefficient));

  // Xác định kiểu phản ứng: redox, self_redox (tự oxi hóa khử / nội phân tử), decomposition (nhiệt phân không redox), non_redox
  let reactionType: 'redox' | 'self_redox' | 'decomposition' | 'non_redox' = 'non_redox';
  if (isRedox) {
    if (numReactants === 1) {
      reactionType = 'self_redox';
    } else {
      reactionType = 'redox';
    }
  } else {
    if (numReactants === 1 && productParsed.length > 1) {
      reactionType = 'decomposition';
    } else {
      reactionType = 'non_redox';
    }
  }

  const conditionLabel = detectedConditions.length > 0 ? Array.from(new Set(detectedConditions)).join(', ') : undefined;

  // Tạo chuỗi phương trình cân bằng hiển thị
  const leftStr = reactantsList
    .map((r) => (r.coefficient === 1 ? r.formula : `${r.coefficient}${r.formula}`))
    .join(' + ');
  const rightStr = productsList
    .map((p) => (p.coefficient === 1 ? p.formula : `${p.coefficient}${p.formula}`))
    .join(' + ');
  const balancedEquation = `${leftStr} ⟶ ${rightStr}`;

  return {
    rawEquation: rawEqText,
    balancedEquation,
    conditionLabel,
    reactionType,
    reactants: reactantsList,
    products: productsList,
    isRedox,
    reducingAgent: reducingAgentIdx >= 0 ? reactantsList[reducingAgentIdx] : null,
    oxidizingAgent: oxidizingAgentIdx >= 0 ? reactantsList[oxidizingAgentIdx] : null,
    mediumSpecies: reactantsList.filter((r) => r.role === 'medium'),
    oxidationHalfReaction: oxHalf,
    reductionHalfReaction: redHalf,
    electronsTransferred,
    stoichiometryCoefficients,
  };
}

// ==========================================
// 4. GAUSS-JORDAN NULLSPACE SOLVER
// ==========================================

function solveNullspace(matrix: Rational[][], numCols: number): number[] | null {
  const numRows = matrix.length;
  // Sao chép ma trận
  const m = matrix.map((row) => row.map((cell) => new Rational(cell.num, cell.den)));

  let lead = 0;
  const pivotColumns: number[] = [];

  for (let r = 0; r < numRows; r++) {
    if (lead >= numCols) break;
    let i = r;
    while (m[i][lead].isZero()) {
      i++;
      if (i === numRows) {
        i = r;
        lead++;
        if (lead === numCols) break;
      }
    }
    if (lead >= numCols) break;

    // Hoán vị dòng i và dòng r
    const temp = m[i];
    m[i] = m[r];
    m[r] = temp;

    // Chuẩn hóa dòng r với pivot = 1
    const pivot = m[r][lead];
    for (let c = 0; c < numCols; c++) {
      m[r][c] = m[r][c].div(pivot);
    }

    // Triệt tiêu các dòng khác trên cột lead
    for (let j = 0; j < numRows; j++) {
      if (j !== r && !m[j][lead].isZero()) {
        const factor = m[j][lead];
        for (let c = 0; c < numCols; c++) {
          m[j][c] = m[j][c].sub(factor.mul(m[r][c]));
        }
      }
    }

    pivotColumns.push(lead);
    lead++;
  }

  // Tìm biến tự do (free variables)
  const freeColumns: number[] = [];
  for (let c = 0; c < numCols; c++) {
    if (!pivotColumns.includes(c)) {
      freeColumns.push(c);
    }
  }

  if (freeColumns.length === 0) {
    // Không có nghiệm không tầm thường
    return null;
  }

  // Lấy biến tự do cuối cùng gán giá trị 1 và giải lùi
  const freeCol = freeColumns[freeColumns.length - 1];
  const solRationals: Rational[] = new Array(numCols).fill(Rational.zero());
  solRationals[freeCol] = Rational.one();

  for (let i = 0; i < pivotColumns.length; i++) {
    const pivotCol = pivotColumns[i];
    // x_pivot + m[i][freeCol] * x_free = 0  =>  x_pivot = - m[i][freeCol] * x_free
    const val = Rational.zero().sub(m[i][freeCol].mul(solRationals[freeCol]));
    solRationals[pivotCol] = val;
  }

  // Kiểm tra xem tất cả các hệ số có cùng dấu và dương không
  let allPositive = true;
  let allNegative = true;
  for (const val of solRationals) {
    if (val.isZero()) return null;
    if (val.isPositive()) allNegative = false;
    else allPositive = false;
  }

  if (!allPositive && !allNegative) {
    // Có cả số âm và số dương => Phản ứng không tự cân bằng hợp lệ theo chiều này
    return null;
  }

  // Nếu tất cả âm, đổi dấu
  if (allNegative) {
    for (let i = 0; i < solRationals.length; i++) {
      solRationals[i] = Rational.zero().sub(solRationals[i]);
    }
  }

  // Tìm Bội Chung Nhỏ Nhất (LCM) của tất cả các mẫu số
  let commonDen = 1n;
  for (const val of solRationals) {
    commonDen = lcmBigInt(commonDen, val.den);
  }

  // Quy đồng thành mảng số nguyên
  const intSol = solRationals.map((val) => {
    return (val.num * commonDen) / val.den;
  });

  // Tìm Ước Chung Lớn Nhất (GCD) của các tử số nguyên để tối giản
  let overallGcd = intSol[0];
  for (let i = 1; i < intSol.length; i++) {
    overallGcd = gcdBigInt(overallGcd, intSol[i]);
  }

  const result = intSol.map((x) => Number(x / overallGcd));
  return result;
}
