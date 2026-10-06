/**
 * Chemical Species definitions for Fe(OH)2 Oxidation:
 * 4Fe(OH)2 + O2 + 2H2O -> 4Fe(OH)3
 */

export type SpeciesId = 'fe_oh2' | 'o2' | 'h2o' | 'fe_oh3';

export interface ElementComposition {
  readonly Fe: number;
  readonly O: number;
  readonly H: number;
}

export interface SpeciesInfo {
  readonly id: SpeciesId;
  readonly formula: string;
  readonly nameVi: string;
  readonly nameEn: string;
  readonly phase: 'solid' | 'gas' | 'liquid';
  readonly composition: ElementComposition;
  readonly color: string;
  readonly descriptionVi: string;
}

export const SPECIES_CATALOG: Record<SpeciesId, SpeciesInfo> = {
  fe_oh2: {
    id: 'fe_oh2',
    formula: 'Fe(OH)₂',
    nameVi: 'Sắt(II) hydroxide',
    nameEn: 'Iron(II) hydroxide',
    phase: 'solid',
    composition: { Fe: 1, O: 2, H: 2 },
    color: '#10b981', // White-greenish precipitate
    descriptionVi: 'Chất kết tủa màu trắng xanh, sắt ở số oxi hóa +2 (đóng vai trò là CHẤT KHỬ, nhường 1e⁻).',
  },
  o2: {
    id: 'o2',
    formula: 'O₂',
    nameVi: 'Khí oxygen',
    nameEn: 'Oxygen gas',
    phase: 'gas',
    composition: { Fe: 0, O: 2, H: 0 },
    color: '#38bdf8', // Light sky blue
    descriptionVi: 'Khí không màu trong không khí, đóng vai trò là CHẤT OXI HÓA (nhận 4e⁻ cho mỗi phân tử O₂).',
  },
  h2o: {
    id: 'h2o',
    formula: 'H₂O',
    nameVi: 'Nước',
    nameEn: 'Water',
    phase: 'liquid',
    composition: { Fe: 0, O: 1, H: 2 },
    color: '#60a5fa', // Blue liquid
    descriptionVi: 'Môi trường phản ứng, cung cấp nhóm -OH tạo kết tủa, không thay đổi số oxi hóa.',
  },
  fe_oh3: {
    id: 'fe_oh3',
    formula: 'Fe(OH)₃',
    nameVi: 'Sắt(III) hydroxide',
    nameEn: 'Iron(III) hydroxide',
    phase: 'solid',
    composition: { Fe: 1, O: 3, H: 3 },
    color: '#b91c1c', // Rust brown-red
    descriptionVi: 'Chất kết tủa màu nâu đỏ, sắt ở số oxi hóa +3 (sản phẩm của quá trình oxi hóa Fe(OH)₂).',
  },
};
