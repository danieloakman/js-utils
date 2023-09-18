/** Multiply some degrees by this to get the radian conversion. */
export const RADIANS_MULT = Math.PI / 180;

/** Multiply some radians by this to get the degree conversion. */
export const DEGREES_MULT = 180 / Math.PI;

/**
 * 0 - 360 degrees corresponds to 0 - 6.28 in radians.
 * @param {number} degrees Can be positive or negative.
 * @returns The degrees parameter converted to radians.
 */
export function toRadians(degrees: number) {
  return degrees * RADIANS_MULT;
}

/**
 * 0 - 6.28 in radians corresponds to 0 - 360 in degrees.
 * @param {number} radians Can be positive or negative.
 * @returns The radians parameter converted to degrees.
 */
export function toDegrees(radians: number) {
  return radians * DEGREES_MULT;
}

export function manhattanDistance(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);
}

/** Perform linear interpolation between `a` and `b` with `t`. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
