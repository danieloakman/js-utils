/** Multiply some degrees by this to get the radian conversion. */
export declare const RADIANS_MULT: number;
/** Multiply some radians by this to get the degree conversion. */
export declare const DEGREES_MULT: number;
/**
 * 0 - 360 degrees corresponds to 0 - 6.28 in radians.
 * @param {number} degrees Can be positive or negative.
 * @returns The degrees parameter converted to radians.
 */
export declare function toRadians(degrees: number): number;
/**
 * 0 - 6.28 in radians corresponds to 0 - 360 in degrees.
 * @param {number} radians Can be positive or negative.
 * @returns The radians parameter converted to degrees.
 */
export declare function toDegrees(radians: number): number;
export declare function manhattanDistance(a: number[], b: number[]): number;
