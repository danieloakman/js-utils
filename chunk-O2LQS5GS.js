// src/BinarySearch.ts
var BinarySearch = class {
  array;
  /**
   * Binary search through an array of numbers, or with a custom comparator and any type.
   */
  // constructor(array: number[], options?: { comparator?: Comparator<number> }); // For T numbers it's optional, otherwise required.
  // constructor(array: T[], options: { comparator: Comparator<T> });
  constructor(array, options = {}) {
    if (array.length < 2)
      throw new Error("Array must be of at least length 2.");
    this.array = array, this.comparator = options.comparator || this.comparator;
  }
  /**
   * @param element The element to search for.
   * @returns True if element is found in the array, false if not.
   */
  has(element) {
    return this.indexOf(element) !== -1;
  }
  /**
   * @param element The element to search for.
   * @returns The index of the element in the input array. If unfound, will return -1.
   */
  indexOf(element) {
    let { found, index } = this.search(element);
    return found ? index : -1;
  }
  /**
   * Similar to `indexOf`, except when the exact element isn't found, it will find the closest element nearby. This will
   * never return -1;
   */
  closestIndexOf(element) {
    let { found, index } = this.search(element);
    if (found)
      return index;
    let closestIndex = 0, closestDiff = null;
    for (let i = index - 1; i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length)
        continue;
      let diff = Math.abs(this.comparator(element, this.array[i]));
      (!closestDiff || diff < closestDiff) && (closestDiff = diff, closestIndex = i);
    }
    return closestIndex;
  }
  /**
   * @param index corresponding index in the input array.
   * @returns The element at index.
   */
  at(index) {
    return this.array[index];
  }
  comparator = (a, b) => a - b;
  /** Applies the binary search algorithm and returns the index  */
  search(element) {
    let left = 0, right = this.array.length - 1, index;
    do {
      index = Math.floor((left + right) / 2);
      let diff = this.comparator(element, this.array[index]);
      if (diff > 0)
        left = index + 1;
      else if (diff < 0)
        right = index - 1;
      else
        return { found: !0, index };
    } while (left <= right);
    return { found: !1, index };
  }
}, BinarySearch_default = BinarySearch;

export {
  BinarySearch,
  BinarySearch_default
};
//# sourceMappingURL=chunk-O2LQS5GS.js.map
