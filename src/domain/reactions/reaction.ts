import { SpeciesId } from '../chemicals/species';

export interface ReactionDefinition {
  readonly id: string;
  readonly nameVi: string;
  readonly equationDisplay: string;
  readonly equationLatex: string;
  readonly reactants: Partial<Record<SpeciesId, number>>;
  readonly products: Partial<Record<SpeciesId, number>>;
  readonly descriptionVi: string;
}

export const FEOH2_OXIDATION_REACTION: ReactionDefinition = {
  id: 'fe-oh2-oxidation',
  nameVi: 'Oxi hóa Fe(OH)₂ trong không khí ẩm tạo Fe(OH)₃',
  equationDisplay: '4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃',
  equationLatex: '4Fe(OH)_2 + O_2 + 2H_2O \\rightarrow 4Fe(OH)_3',
  reactants: {
    fe_oh2: 4,
    o2: 1,
    h2o: 2,
  },
  products: {
    fe_oh3: 4,
  },
  descriptionVi:
    'Kết tủa trắng xanh Fe(OH)₂ tiếp xúc với oxygen hòa tan và hơi ẩm trong không khí bị oxi hóa nhanh chóng thành kết tủa màu nâu đỏ Fe(OH)₃.',
};
