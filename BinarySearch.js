// node_modules/.pnpm/
class BinarySearch {
  array;
  constructor(array, options = {}) {
    if (array.length < 2)
      throw new Error("Array must be of at least length 2.");
    this.array = array;
    this.comparator = options.comparator || this.comparator;
  }
  has(element) {
    return this.indexOf(element) !== -1;
  }
  indexOf(element) {
    const { found, index } = this.search(element);
    return found ? index : -1;
  }
  closestIndexOf(element) {
    const { found, index } = this.search(element);
    if (found)
      return index;
    let closestIndex = 0;
    let closestDiff = null;
    for (let i = index - 1;i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length)
        continue;
      const diff = Math.abs(this.comparator(element, this.array[i]));
      if (!closestDiff || diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }
  at(index) {
    return this.array[index];
  }
  comparator = (a, b) => a - b;
  search(element) {
    let left = 0;
    let right = this.array.length - 1;
    let index;
    do {
      index = Math.floor((left + right) / 2);
      const diff = this.comparator(element, this.array[index]);
      if (diff > 0) {
        left = index + 1;
      } else if (diff < 0) {
        right = index - 1;
      } else {
        return { found: true, index };
      }
    } while (left <= right);
    return { found: false, index };
  }
}
var BinarySearch_default = BinarySearch;
export {
  BinarySearch_default as default,
  BinarySearch
};
