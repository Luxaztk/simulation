import { ReactionDefinition } from '../../domain/reactions/reaction';

export interface TemperatureThreshold {
  /**
   * Minimum temperature (in Celsius) required for reaction to proceed
   */
  readonly min?: number;
  /**
   * Maximum temperature (in Celsius) above which reaction behavior changes or halts
   */
  readonly max?: number;
  /**
   * Flag indicating whether this threshold is scientifically verified
   * or an educational pedagogical simplification.
   */
  readonly verified: boolean;
  /**
   * Explanation or pedagogical citation
   */
  readonly rationaleVi: string;
}

export interface ReductionRule {
  readonly id: string;
  readonly reaction: ReactionDefinition;
  readonly temperature: TemperatureThreshold;
  /**
   * Fractional conversion efficiency under sufficient conditions (0.0 to 1.0)
   */
  readonly efficiency: number;
  readonly notesVi?: string;
}
