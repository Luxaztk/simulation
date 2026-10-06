import { clampZero } from '../../utils/math-utils';
import {
  SimulationInput,
  SimulationState,
  SimulationStatus,
  SpeciesMoles,
} from '../state/simulation-state';
import { validateMassBalance } from '../validation/mass-balance';

/**
 * Pure, deterministic simulation engine for 1-step Fe(OH)2 oxidation:
 * 4Fe(OH)₂ + O₂ + 2H₂O ⟶ 4Fe(OH)₃
 */
export function simulate(input: SimulationInput): SimulationState {
  const { feOh2Mol, o2Mol, h2oMol = 10.0 } = input;

  if (feOh2Mol < 0 || o2Mol < 0 || h2oMol < 0) {
    throw new Error('Số mol nhập vào không thể nhỏ hơn 0.');
  }

  const initialSpecies: SpeciesMoles = {
    fe_oh2: Math.max(0, feOh2Mol),
    o2: Math.max(0, o2Mol),
    h2o: Math.max(0, h2oMol),
    fe_oh3: 0,
  };

  // Determine limiting reactant
  // 4 Fe(OH)2 + 1 O2 + 2 H2O -> 4 Fe(OH)3
  const maxXiByFeOh2 = initialSpecies.fe_oh2 / 4;
  const maxXiByO2 = initialSpecies.o2 / 1;
  const maxXiByH2o = initialSpecies.h2o / 2;

  const xi = clampZero(Math.min(maxXiByFeOh2, maxXiByO2, maxXiByH2o));

  const feOh2Consumed = clampZero(4 * xi);
  const o2Consumed = clampZero(1 * xi);
  const h2oConsumed = clampZero(2 * xi);
  const feOh3Produced = clampZero(4 * xi);

  const finalSpecies: SpeciesMoles = {
    fe_oh2: clampZero(initialSpecies.fe_oh2 - feOh2Consumed),
    o2: clampZero(initialSpecies.o2 - o2Consumed),
    h2o: clampZero(initialSpecies.h2o - h2oConsumed),
    fe_oh3: clampZero(feOh3Produced),
  };

  // Status determination
  let status: SimulationStatus = 'not_started';
  const conversionPercent =
    initialSpecies.fe_oh2 > 0
      ? (feOh2Consumed / initialSpecies.fe_oh2) * 100
      : 0;

  if (initialSpecies.fe_oh2 <= 1e-7) {
    status = 'not_started';
  } else if (conversionPercent >= 99.99) {
    status = 'completed';
  } else {
    status = 'partial_insufficient_o2';
  }

  // Electron transfer accounting:
  // Fe(+2) -> Fe(+3) + 1e- (each Fe(OH)2 loses 1 e-)
  // O2(0) + 4e- -> 2 O(-2) (each O2 gains 4 e-)
  const molesElectronsLost = clampZero(feOh2Consumed * 1);
  const molesElectronsGained = clampZero(o2Consumed * 4);
  const molesElectronsTransferred = molesElectronsLost;

  // Precipitate color appearance
  let precipitateColor = {
    nameVi: 'Trắng xanh',
    hexColor: '#10b981',
    descriptionVi: 'Kết tủa Fe(OH)₂ ban đầu có màu trắng xanh (hoặc xanh rêu nhạt).',
  };

  if (conversionPercent >= 99.99) {
    precipitateColor = {
      nameVi: 'Nâu đỏ',
      hexColor: '#b91c1c',
      descriptionVi: 'Toàn bộ kết tủa đã chuyển hoàn toàn thành Fe(OH)₃ màu nâu đỏ.',
    };
  } else if (conversionPercent > 0) {
    precipitateColor = {
      nameVi: 'Xanh rêu ngả nâu',
      hexColor: '#78716c',
      descriptionVi: `Đang trong quá trình chuyển màu (${conversionPercent.toFixed(1)}% Fe(OH)₃ nâu đỏ pha lẫn Fe(OH)₂ trắng xanh còn dư).`,
    };
  }

  const massBalance = validateMassBalance(initialSpecies, finalSpecies);

  return {
    species: finalSpecies,
    initialSpecies,
    status,
    extentXi: xi,
    conversionPercent,
    feOh2Consumed,
    o2Consumed,
    h2oConsumed,
    feOh3Produced,
    electronTransfer: {
      molesElectronsLost,
      molesElectronsGained,
      molesElectronsTransferred,
      isElectronBalanced: Math.abs(molesElectronsLost - molesElectronsGained) < 1e-6,
      donorSubstance: 'Fe(OH)₂ (Sắt(II) hydroxide)',
      acceptorSubstance: 'O₂ (Oxygen)',
      oxidationHalfEquation: 'Fe⁺² ⟶ Fe⁺³ + 1e⁻',
      reductionHalfEquation: 'O₂⁰ + 4e⁻ ⟶ 2O⁻²',
    },
    massBalance,
    precipitateColor,
  };
}
