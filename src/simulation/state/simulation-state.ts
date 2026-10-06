export interface SimulationInput {
  feOh2Mol: number;
  o2Mol: number;
  h2oMol?: number;
}

export interface SpeciesMoles {
  fe_oh2: number;
  o2: number;
  h2o: number;
  fe_oh3: number;
}

export type SimulationStatus =
  | 'not_started'
  | 'partial_insufficient_o2'
  | 'completed';

export interface ElementBalanceRecord {
  element: 'Fe' | 'O' | 'H';
  initialMoles: number;
  finalMoles: number;
  difference: number;
  balanced: boolean;
}

export interface MassBalanceValidation {
  isValid: boolean;
  tolerance: number;
  feBalance: ElementBalanceRecord;
  oBalance: ElementBalanceRecord;
  hBalance: ElementBalanceRecord;
  totalInitialMassG: number;
  totalFinalMassG: number;
  massDifferenceG: number;
  massBalanced: boolean;
}

export interface ElectronTransferSummary {
  molesElectronsLost: number;       // n(e- cho) = 1 * n(Fe(OH)2 phản ứng)
  molesElectronsGained: number;     // n(e- nhận) = 4 * n(O2 phản ứng)
  molesElectronsTransferred: number;
  isElectronBalanced: boolean;
  donorSubstance: string;
  acceptorSubstance: string;
  oxidationHalfEquation: string;
  reductionHalfEquation: string;
}

export interface PrecipitateColorState {
  nameVi: string;
  hexColor: string;
  descriptionVi: string;
}

export interface SimulationState {
  species: SpeciesMoles;
  initialSpecies: SpeciesMoles;
  status: SimulationStatus;
  extentXi: number;
  conversionPercent: number;
  feOh2Consumed: number;
  o2Consumed: number;
  h2oConsumed: number;
  feOh3Produced: number;
  electronTransfer: ElectronTransferSummary;
  massBalance: MassBalanceValidation;
  precipitateColor: PrecipitateColorState;
}
