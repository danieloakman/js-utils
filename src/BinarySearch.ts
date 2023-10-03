// function determineOrder<T>(array: T[]) {
//   for (let i = 1; i < array.length; i++) {
//     if (array[i - 1] < array[i]) return 'asc';
//     else if (array[i - 1] > array[i]) return 'desc';
//   }

//   throw new Error(
//     `Could not determine order of array input into BinarySearchService: ${JSON.stringify(array, null, 2)}`,
//   );
// }

// function getDifference<T>(a: T, b: T) {
//   if (typeof a === 'string' && typeof b === 'string') return Levenshtein.dist(a, b).steps;
//   else if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b);
// }

export interface Comparator<T> {
  (a: T, b: T): number;
  // (a: string, b: string): number;
}

export class BinarySearch<T> {
  private array: T[];

  /**
   * Binary search through an array of numbers, or with a custom comparator and any type.
   */
  // constructor(array: number[], options?: { comparator?: Comparator<number> }); // For T numbers it's optional, otherwise required.
  // constructor(array: T[], options: { comparator: Comparator<T> });
  constructor(array: T[], options: { comparator?: Comparator<T> } = {}) {
    if (array.length < 2) throw new Error('Array must be of at least length 2.');

    this.array = array;
    this.comparator = options.comparator || this.comparator;
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
   * @param options Optional parameters:
   *  - closest: If true and when the element isn't found, the most similar element's
   * index will be returned instead of -1 (default: false)
   * @returns The index of the element in the input array. If unfound, will return -1.
   */
  indexOf(element: T, options: { closest?: boolean } = {}): number {
    const { closest } = options;

    // Binary search through this.array to find element's index:
    let left = 0;
    let right = this.array.length - 1;
    let index: number;
    do {
      index = Math.floor((left + right) / 2);
      const diff = this.comparator(element, this.array[index]);
      if (diff > 0) {
        left = index + 1;
      } else if (diff < 0) {
        right = index - 1;
      } else {
        // Found element:
        return index;
      }
    } while (left <= right);

    // Could not find element:
    if (!closest) return -1;

    // Find and return closest index from around the current index:
    let closestIndex = -1;
    let closestDiff: number | null = null;
    for (let i = index - 1; i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length) continue;
      const diff = this.comparator(element, this.array[i]);
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
  at(index: number): T {
    return this.array[index];
  }

  private comparator: (a: T, b: T) => number = (a, b) => (a as number) - (b as number);
}

export default BinarySearch;
