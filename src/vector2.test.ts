import { Vector2 } from './vector2';
import { describe, expect, it } from 'bun:test';

describe('Vector2', () => {
  it('should create a vector2 from x and y', () => {
    const v = new Vector2(1, 2);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  it('should create a vector2 from one number', () => {
    const v = new Vector2(1);
    expect(v.x).toBe(1);
    expect(v.y).toBe(1);
  });

  it('should create a vector2 from an object', () => {
    const v = new Vector2({ x: 1, y: 2 });
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  it('should create a vector2 from an array', () => {
    const v = new Vector2([1, 2]);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  it('should create a vector2 from an angle', () => {
    const v = Vector2.fromAngle(Math.PI / 2);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(1);
  });

  it('should create a vector2 from a string', () => {
    const v = Vector2.fromString('1,2');
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  it('should add two vectors', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    const v3 = v1.add(v2);
    expect(v3.x).toBe(4);
    expect(v3.y).toBe(6);
  });

  it('should subtract two vectors', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    const v3 = v1.sub(v2);
    expect(v3.x).toBe(-2);
    expect(v3.y).toBe(-2);
  });

  it('should multiply two vectors', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    const v3 = v1.mul(v2);
    expect(v3.x).toBe(3);
    expect(v3.y).toBe(8);
  });

  it('should divide two vectors', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    const v3 = v1.div(v2);
    expect(v3.x).toBe(1 / 3);
    expect(v3.y).toBe(2 / 4);
  });

  it('should negate a vector', () => {
    const v1 = new Vector2(1, 2);
    const v2 = v1.neg();
    expect(v2.x).toBe(-1);
    expect(v2.y).toBe(-2);
  });

  it('should get the absolute value of a vector', () => {
    const v1 = new Vector2(-1, -2);
    const v2 = v1.abs();
    expect(v2.x).toBe(1);
    expect(v2.y).toBe(2);
  });

  it('should get the length of a vector', () => {
    const v1 = new Vector2(3, 4);
    const len = v1.len();
    expect(len).toBe(5);
  });

  it('should get the distance between two vectors', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(3, 4);
    const dist = v1.dist(v2);
    expect(dist).toBeCloseTo(2.828);
  });
});
