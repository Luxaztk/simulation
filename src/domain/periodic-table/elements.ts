/**
 * Bảng dữ liệu nguyên tố hóa học phục vụ tính toán khối lượng mol và phân tích cấu tử
 * Dữ liệu nguyên tử khối theo tiêu chuẩn IUPAC
 */

export interface ElementData {
  readonly symbol: string;
  readonly nameVi: string;
  readonly atomicNumber: number;
  readonly atomicMass: number;
  readonly electronegativity?: number;
  readonly defaultOxidationState?: number;
  readonly commonOxidationStates: readonly number[];
  readonly isMetal: boolean;
}

export const PERIODIC_TABLE: Record<string, ElementData> = {
  H: {
    symbol: 'H',
    nameVi: 'Hydrogen',
    atomicNumber: 1,
    atomicMass: 1.008,
    electronegativity: 2.2,
    defaultOxidationState: 1,
    commonOxidationStates: [1, -1],
    isMetal: false,
  },
  He: {
    symbol: 'He',
    nameVi: 'Helium',
    atomicNumber: 2,
    atomicMass: 4.0026,
    commonOxidationStates: [0],
    isMetal: false,
  },
  Li: {
    symbol: 'Li',
    nameVi: 'Lithium',
    atomicNumber: 3,
    atomicMass: 6.94,
    defaultOxidationState: 1,
    commonOxidationStates: [1],
    isMetal: true,
  },
  Be: {
    symbol: 'Be',
    nameVi: 'Beryllium',
    atomicNumber: 4,
    atomicMass: 9.0122,
    defaultOxidationState: 2,
    commonOxidationStates: [2],
    isMetal: true,
  },
  B: {
    symbol: 'B',
    nameVi: 'Boron',
    atomicNumber: 5,
    atomicMass: 10.81,
    defaultOxidationState: 3,
    commonOxidationStates: [3],
    isMetal: false,
  },
  C: {
    symbol: 'C',
    nameVi: 'Carbon',
    atomicNumber: 6,
    atomicMass: 12.011,
    electronegativity: 2.55,
    commonOxidationStates: [-4, 2, 4],
    isMetal: false,
  },
  N: {
    symbol: 'N',
    nameVi: 'Nitrogen',
    atomicNumber: 7,
    atomicMass: 14.007,
    electronegativity: 3.04,
    commonOxidationStates: [-3, 1, 2, 3, 4, 5],
    isMetal: false,
  },
  O: {
    symbol: 'O',
    nameVi: 'Oxygen',
    atomicNumber: 8,
    atomicMass: 15.999,
    electronegativity: 3.44,
    defaultOxidationState: -2,
    commonOxidationStates: [-2, -1],
    isMetal: false,
  },
  F: {
    symbol: 'F',
    nameVi: 'Fluorine',
    atomicNumber: 9,
    atomicMass: 18.998,
    electronegativity: 3.98,
    defaultOxidationState: -1,
    commonOxidationStates: [-1],
    isMetal: false,
  },
  Ne: {
    symbol: 'Ne',
    nameVi: 'Neon',
    atomicNumber: 10,
    atomicMass: 20.18,
    commonOxidationStates: [0],
    isMetal: false,
  },
  Na: {
    symbol: 'Na',
    nameVi: 'Sodium',
    atomicNumber: 11,
    atomicMass: 22.99,
    defaultOxidationState: 1,
    commonOxidationStates: [1],
    isMetal: true,
  },
  Mg: {
    symbol: 'Mg',
    nameVi: 'Magnesium',
    atomicNumber: 12,
    atomicMass: 24.305,
    defaultOxidationState: 2,
    commonOxidationStates: [2],
    isMetal: true,
  },
  Al: {
    symbol: 'Al',
    nameVi: 'Aluminium',
    atomicNumber: 13,
    atomicMass: 26.982,
    defaultOxidationState: 3,
    commonOxidationStates: [3],
    isMetal: true,
  },
  Si: {
    symbol: 'Si',
    nameVi: 'Silicon',
    atomicNumber: 14,
    atomicMass: 28.085,
    commonOxidationStates: [-4, 4],
    isMetal: false,
  },
  P: {
    symbol: 'P',
    nameVi: 'Phosphorus',
    atomicNumber: 15,
    atomicMass: 30.974,
    commonOxidationStates: [-3, 3, 5],
    isMetal: false,
  },
  S: {
    symbol: 'S',
    nameVi: 'Sulfur',
    atomicNumber: 16,
    atomicMass: 32.06,
    electronegativity: 2.58,
    commonOxidationStates: [-2, 4, 6],
    isMetal: false,
  },
  Cl: {
    symbol: 'Cl',
    nameVi: 'Chlorine',
    atomicNumber: 17,
    atomicMass: 35.45,
    electronegativity: 3.16,
    commonOxidationStates: [-1, 1, 3, 5, 7],
    isMetal: false,
  },
  Ar: {
    symbol: 'Ar',
    nameVi: 'Argon',
    atomicNumber: 18,
    atomicMass: 39.948,
    commonOxidationStates: [0],
    isMetal: false,
  },
  K: {
    symbol: 'K',
    nameVi: 'Potassium',
    atomicNumber: 19,
    atomicMass: 39.098,
    defaultOxidationState: 1,
    commonOxidationStates: [1],
    isMetal: true,
  },
  Ca: {
    symbol: 'Ca',
    nameVi: 'Calcium',
    atomicNumber: 20,
    atomicMass: 40.078,
    defaultOxidationState: 2,
    commonOxidationStates: [2],
    isMetal: true,
  },
  Cr: {
    symbol: 'Cr',
    nameVi: 'Chromium',
    atomicNumber: 24,
    atomicMass: 51.996,
    commonOxidationStates: [2, 3, 6],
    isMetal: true,
  },
  Mn: {
    symbol: 'Mn',
    nameVi: 'Manganese',
    atomicNumber: 25,
    atomicMass: 54.938,
    commonOxidationStates: [2, 4, 6, 7],
    isMetal: true,
  },
  Fe: {
    symbol: 'Fe',
    nameVi: 'Iron',
    atomicNumber: 26,
    atomicMass: 55.845,
    commonOxidationStates: [2, 3],
    isMetal: true,
  },
  Co: {
    symbol: 'Co',
    nameVi: 'Cobalt',
    atomicNumber: 27,
    atomicMass: 58.933,
    commonOxidationStates: [2, 3],
    isMetal: true,
  },
  Ni: {
    symbol: 'Ni',
    nameVi: 'Nickel',
    atomicNumber: 28,
    atomicMass: 58.693,
    commonOxidationStates: [2],
    isMetal: true,
  },
  Cu: {
    symbol: 'Cu',
    nameVi: 'Copper',
    atomicNumber: 29,
    atomicMass: 63.546,
    commonOxidationStates: [1, 2],
    isMetal: true,
  },
  Zn: {
    symbol: 'Zn',
    nameVi: 'Zinc',
    atomicNumber: 30,
    atomicMass: 65.38,
    defaultOxidationState: 2,
    commonOxidationStates: [2],
    isMetal: true,
  },
  Br: {
    symbol: 'Br',
    nameVi: 'Bromine',
    atomicNumber: 35,
    atomicMass: 79.904,
    electronegativity: 2.96,
    commonOxidationStates: [-1, 1, 3, 5],
    isMetal: false,
  },
  Ag: {
    symbol: 'Ag',
    nameVi: 'Silver',
    atomicNumber: 47,
    atomicMass: 107.868,
    defaultOxidationState: 1,
    commonOxidationStates: [1],
    isMetal: true,
  },
  Sn: {
    symbol: 'Sn',
    nameVi: 'Tin',
    atomicNumber: 50,
    atomicMass: 118.71,
    commonOxidationStates: [2, 4],
    isMetal: true,
  },
  I: {
    symbol: 'I',
    nameVi: 'Iodine',
    atomicNumber: 53,
    atomicMass: 126.9,
    electronegativity: 2.66,
    commonOxidationStates: [-1, 1, 5, 7],
    isMetal: false,
  },
  Ba: {
    symbol: 'Ba',
    nameVi: 'Barium',
    atomicNumber: 56,
    atomicMass: 137.327,
    defaultOxidationState: 2,
    commonOxidationStates: [2],
    isMetal: true,
  },
  Pt: {
    symbol: 'Pt',
    nameVi: 'Platinum',
    atomicNumber: 78,
    atomicMass: 195.084,
    commonOxidationStates: [2, 4],
    isMetal: true,
  },
  Au: {
    symbol: 'Au',
    nameVi: 'Gold',
    atomicNumber: 79,
    atomicMass: 196.967,
    commonOxidationStates: [1, 3],
    isMetal: true,
  },
  Pb: {
    symbol: 'Pb',
    nameVi: 'Lead',
    atomicNumber: 82,
    atomicMass: 207.2,
    commonOxidationStates: [2, 4],
    isMetal: true,
  },
};

/**
 * Tra cứu thông tin nguyên tố theo ký hiệu hóa học (case-sensitive)
 */
export function getElement(symbol: string): ElementData | undefined {
  return PERIODIC_TABLE[symbol];
}

/**
 * Kiểm tra xem một ký hiệu có phải là nguyên tố hợp lệ hay không
 */
export function isValidElement(symbol: string): boolean {
  return symbol in PERIODIC_TABLE;
}
