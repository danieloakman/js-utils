import { classToFn } from './functional';

export type Vector2Like = { x: number; y: number } | [x: number, y: number];

export type Vector2SupportedParams =
  | [{ x: number; y: number }]
  | [[x: number, y: number]]
  | [x: number, y: number]
  | [xAndY: number];

const numRegex = /\d+(\.\d+)?/g;

export class Vector2 {
  public static readonly ZERO = new Vector2(0, 0);
  public static readonly ONE = new Vector2(1, 1);
  public static readonly UP = new Vector2(0, 1);
  public static readonly DOWN = new Vector2(0, -1);
  public static readonly LEFT = new Vector2(-1, 0);
  public static readonly RIGHT = new Vector2(1, 0);

  public readonly x: number;
  public readonly y: number;

  constructor(...[x, y]: Vector2SupportedParams) {
    if (typeof x === 'number') {
      this.x = x;
      this.y = y ?? x;
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      throw new Error('Invalid arguments');
    }
  }

  static fromString(str: string): Vector2 {
    const [x, y] = str
      .matchAll(numRegex)
      .take(2)
      .map(m => parseFloat(m[0]));
    return new Vector2(x ?? 0, y ?? 0);
  }

  static fromAngle(angle: number): Vector2 {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  add(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    return new Vector2(this.x + o.x, this.y + o.y);
  }

  sub(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    return new Vector2(this.x - o.x, this.y - o.y);
  }

  mul(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    return new Vector2(this.x * o.x, this.y * o.y);
  }

  div(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    const x = this.x / o.x;
    const y = this.y / o.y;
    return new Vector2(isNaN(x) ? 0 : x, isNaN(y) ? 0 : y);
  }

  neg(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  abs(): Vector2 {
    return new Vector2(Math.abs(this.x), Math.abs(this.y));
  }

  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dist(other: Vector2): number {
    return this.sub(other).len();
  }

  norm(): Vector2 {
    return this.div(this.sub(new Vector2(0, 0)));
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  rotate(angle: number): Vector2 {
    return new Vector2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle),
    );
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  project(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    return o.mul(this.dot(o) / o.dot(o));
  }

  reflect(...other: Vector2SupportedParams): Vector2 {
    const o = new Vector2(...other);
    return this.sub(this.project(o).mul(2));
  }

  toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  toArray(): [x: number, y: number] {
    return [this.x, this.y];
  }
}

export const vector2 = classToFn(Vector2);
