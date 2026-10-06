/**
 * Generic Simulation Engine: Tính toán định lượng cho mọi phản ứng hóa học vô cơ đã cân bằng
 * - Xác định chất hết trước (Limiting Reactant) & Độ tiến triển phản ứng (Reaction Extent ξ)
 * - Tính toán số mol, khối lượng, electron trao đổi thực tế
 * - Kiểm tra bảo toàn khối lượng và nguyên tố tự động cho mọi nguyên tố
 */

import { BalancedReactionResult, BalancedSpecies } from '../../domain/balancer/equation-balancer';
import { molesToGrams } from '../../domain/parser/formula-parser';

export interface ElementBalanceItem {
  readonly element: string;
  readonly initialMoles: number;
  readonly finalMoles: number;
  readonly delta: number;
  readonly isConserved: boolean;
}

export interface GenericSimulationState {
  readonly balancedReaction: BalancedReactionResult;
  readonly initialMoles: Record<string, number>;
  readonly finalMoles: Record<string, number>;
  readonly consumedMoles: Record<string, number>;
  readonly producedMoles: Record<string, number>;
  readonly initialMassGrams: Record<string, number>;
  readonly finalMassGrams: Record<string, number>;
  readonly totalInitialMassGrams: number;
  readonly totalFinalMassGrams: number;
  readonly extentXi: number;
  readonly maxExtentXi: number;
  readonly limitingReactantFormula: string;
  readonly electronsTransferredMoles: number;
  readonly elementBalances: readonly ElementBalanceItem[];
  readonly isMassConserved: boolean;
  readonly progressPercent: number;
}

export interface GenericSimulationInput {
  readonly balancedReaction: BalancedReactionResult;
  readonly initialMoles: Record<string, number>;
  readonly progressFraction?: number; // 0 to 1 (mặc định 1.0 = phản ứng hết mức có thể)
}

/**
 * Thực hiện mô phỏng định lượng phản ứng
 */
export function simulateGenericReaction(input: GenericSimulationInput): GenericSimulationState {
  const { balancedReaction, initialMoles } = input;
  const progressFraction = Math.min(1, Math.max(0, input.progressFraction ?? 1.0));

  const reactants = balancedReaction.reactants;
  const products = balancedReaction.products;

  // 1. TÌM CHẤT HẾT TRƯỚC (LIMITING REACTANT)
  let maxXi = Number.POSITIVE_INFINITY;
  let limitingFormula = reactants[0]?.formula || '';

  for (const r of reactants) {
    const n0 = Math.max(0, initialMoles[r.formula] || 0);
    const xiForThis = n0 / r.coefficient;
    if (xiForThis < maxXi) {
      maxXi = xiForThis;
      limitingFormula = r.formula;
    }
  }

  if (maxXi === Number.POSITIVE_INFINITY || maxXi < 0) {
    maxXi = 0;
  }

  // Độ tiến triển thực tế
  const extentXi = maxXi * progressFraction;

  // 2. TÍNH TOÁN SỐ MOL VÀ KHỐI LƯỢNG
  const finalMoles: Record<string, number> = {};
  const consumedMoles: Record<string, number> = {};
  const producedMoles: Record<string, number> = {};
  const initialMassGrams: Record<string, number> = {};
  const finalMassGrams: Record<string, number> = {};

  let totalInitialMass = 0;
  let totalFinalMass = 0;

  // Reactants
  for (const r of reactants) {
    const n0 = Math.max(0, initialMoles[r.formula] || 0);
    const consumed = Number((r.coefficient * extentXi).toFixed(6));
    const finalN = Number(Math.max(0, n0 - consumed).toFixed(6));

    consumedMoles[r.formula] = consumed;
    finalMoles[r.formula] = finalN;

    const m0 = molesToGrams(n0, r.parsed.molarMass);
    const mFinal = molesToGrams(finalN, r.parsed.molarMass);
    initialMassGrams[r.formula] = m0;
    finalMassGrams[r.formula] = mFinal;

    totalInitialMass += m0;
    totalFinalMass += mFinal;
  }

  // Products
  for (const p of products) {
    initialMoles[p.formula] = 0; // Sản phẩm ban đầu = 0
    const produced = Number((p.coefficient * extentXi).toFixed(6));
    producedMoles[p.formula] = produced;
    finalMoles[p.formula] = produced;

    initialMassGrams[p.formula] = 0;
    const mFinal = molesToGrams(produced, p.parsed.molarMass);
    finalMassGrams[p.formula] = mFinal;

    totalFinalMass += mFinal;
  }

  // 3. TÍNH SỐ MOL ELECTRON TRAO ĐỔI
  // n_e = (Số electron trao đổi theo tỉ lượng) * extentXi
  const electronsTransferredMoles = Number(
    (balancedReaction.electronsTransferred * extentXi).toFixed(6)
  );

  // 4. KIỂM TRA BẢO TOÀN NGUYÊN TỐ
  const allElementsSet = new Set<string>();
  reactants.forEach((r) => Object.keys(r.parsed.composition).forEach((el) => allElementsSet.add(el)));
  products.forEach((p) => Object.keys(p.parsed.composition).forEach((el) => allElementsSet.add(el)));

  const elementBalances: ElementBalanceItem[] = [];
  let isMassConserved = true;

  for (const el of Array.from(allElementsSet)) {
    let initialAtoms = 0;
    for (const r of reactants) {
      const count = r.parsed.composition[el] || 0;
      const n0 = Math.max(0, initialMoles[r.formula] || 0);
      initialAtoms += n0 * count;
    }

    let finalAtoms = 0;
    for (const r of reactants) {
      const count = r.parsed.composition[el] || 0;
      const nFinal = finalMoles[r.formula] || 0;
      finalAtoms += nFinal * count;
    }
    for (const p of products) {
      const count = p.parsed.composition[el] || 0;
      const nFinal = finalMoles[p.formula] || 0;
      finalAtoms += nFinal * count;
    }

    const delta = Math.abs(finalAtoms - initialAtoms);
    const isConserved = delta < 1e-4;
    if (!isConserved) isMassConserved = false;

    elementBalances.push({
      element: el,
      initialMoles: Number(initialAtoms.toFixed(5)),
      finalMoles: Number(finalAtoms.toFixed(5)),
      delta: Number(delta.toFixed(6)),
      isConserved,
    });
  }

  // Kiểm tra delta tổng khối lượng
  const totalMassDelta = Math.abs(totalFinalMass - totalInitialMass);
  if (totalMassDelta > 0.05) {
    isMassConserved = false;
  }

  const progressPercent = maxXi > 0 ? Number(((extentXi / maxXi) * 100).toFixed(1)) : 0;

  return {
    balancedReaction,
    initialMoles,
    finalMoles,
    consumedMoles,
    producedMoles,
    initialMassGrams,
    finalMassGrams,
    totalInitialMassGrams: Number(totalInitialMass.toFixed(3)),
    totalFinalMassGrams: Number(totalFinalMass.toFixed(3)),
    extentXi: Number(extentXi.toFixed(6)),
    maxExtentXi: Number(maxXi.toFixed(6)),
    limitingReactantFormula: limitingFormula,
    electronsTransferredMoles,
    elementBalances,
    isMassConserved,
    progressPercent,
  };
}
