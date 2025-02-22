import { reduce, zip } from 'iteragain';

/** Multiply some degrees by this to get the radian conversion. */
export const RADIANS_MULT = Math.PI / 180;

/** Multiply some radians by this to get the degree conversion. */
export const DEGREES_MULT = 180 / Math.PI;

/**
 * 0 - 360 degrees corresponds to 0 - 6.28 in radians.
 * @param {number} degrees Can be positive or negative.
 * @returns The degrees parameter converted to radians.
 */
export function toRadians(degrees: number): number {
  return degrees * RADIANS_MULT;
}

/**
 * 0 - 6.28 in radians corresponds to 0 - 360 in degrees.
 * @param {number} radians Can be positive or negative.
 * @returns The radians parameter converted to degrees.
 */
export function toDegrees(radians: number): number {
  return radians * DEGREES_MULT;
}

export function manhattanDistance(a: number[], b: number[]): number {
  return reduce(zip(a, b), (sum, [a, b]) => sum + Math.abs(a - b), 0);
}

/** Perform linear interpolation between `a` and `b` with `t`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function randInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function roundTo(n: number, places: number): number {
  const mult = Math.pow(10, places);
  return Math.round(n * mult) / mult;
}

/**
 * @description Rounds `n` to the nearest factor of `f`.
 * @example roundToNearest(1.2345, 0.1) => 1.2
 * @example roundToNearest(1.2345, 0.01) => 1.23
 * @example roundToNearest(50, 30) => 60
 * @example roundToNearest(100, 30) => 90
 * @example roundToNearest(100, 40) => 80
 */
export function roundToNearest(n: number, f: number): number {
  const result = Math.round(n / f) * f;
  // Handle floating point precision issues by rounding to a reasonable number of decimal places
  const decimals = Math.max((f.toString().split('.')[1] || '').length, (n.toString().split('.')[1] || '').length);
  return Number(result.toFixed(decimals));
}

export function safeParseInt(str: string): number | null {
  const n = parseInt(str);
  return isNaN(n) ? null : n;
}

export function safeParseFloat(str: string): number | null {
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function isBetween(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}
