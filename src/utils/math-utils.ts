import { EPSILON } from '../domain/constants/constants';

/**
 * Clamps near-zero floating numbers to exact zero if within epsilon
 */
export function clampZero(val: number, eps: number = EPSILON): number {
  if (Math.abs(val) < eps) {
    return 0;
  }
  return val;
}

/**
 * Formats a mole value for display with appropriate decimals
 */
export function formatMoles(val: number, decimals: number = 4): string {
  const clamped = clampZero(val);
  return clamped.toFixed(decimals);
}

/**
 * Formats mass in grams for display
 */
export function formatMassG(val: number, decimals: number = 2): string {
  const clamped = clampZero(val);
  return clamped.toFixed(decimals);
}

/**
 * Formats a percentage for display
 */
export function formatPercent(val: number, decimals: number = 1): string {
  return `${val.toFixed(decimals)}%`;
}
