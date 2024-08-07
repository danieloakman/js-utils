import { Comparator } from './types';

export class BinarySearch<T> {
  protected array: T[];

  /**
   * Binary search through an array of numbers, or with a custom comparator and any type.
   */
  constructor(array: T[], options: { comparator?: Comparator<T, number> } = {}) {
    if (array.length < 2) throw new Error('Array must be of at least length 2.');

    this.array = array;
    this.comparator = options.comparator || this.comparator;
  }

  get length() {
    return this.array.length;
  }

  /**
   * @param element The element to search for.
   * @returns True if element is found in the array, false if not.
   */
  has(element: T): boolean {
    return this.indexOf(element) !== -1;
  }

  /**
   * @param element The element to search for.
   * @returns The index of the element in the input array. If unfound, will return -1.
   */
  indexOf(element: T): number {
    const { found, index } = this.search(element);
    return found ? index : -1;
  }

  /**
   * Similar to `indexOf`, except when the exact element isn't found, it will find the closest element nearby. This will
   * never return -1;
   */
  closestIndexOf(element: T): number {
    const { found, index } = this.search(element);
    if (found) return index;

    // Find and return closest index from around the current index:
    let closestIndex = 0;
    let closestDiff: number | null = null;
    for (let i = index - 1; i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length) continue;
      const other = this.array[i];
      if (!other) continue;
      const diff = Math.abs(this.comparator(element, other));
      if (!closestDiff || diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  /**
   * @param index corresponding index in the input array.
   * @returns The element at index.
   */
  at(index: number): T | undefined {
    return this.array[index];
  }

  protected comparator: (a: T, b: T) => number = (a, b) => (a as number) - (b as number);

  /** Applies the binary search algorithm and returns the index  */
  private search(element: T) {
    let left = 0;
    let right = this.array.length - 1;
    let index: number;
    do {
      index = Math.floor((left + right) / 2);
      const other = this.array[index];
      if (!other) break;
      const diff = this.comparator(element, other);
      if (diff > 0) {
        left = index + 1;
      } else if (diff < 0) {
        right = index - 1;
      } else {
        // Found element:
        return { found: true, index };
      }
    } while (left <= right);

    // Didn't find exact element, so just return what it landed on at the end.
    return { found: false, index };
  }
}

export default BinarySearch;
