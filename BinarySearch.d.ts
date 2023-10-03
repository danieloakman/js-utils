import { Comparator } from './types';
export declare class BinarySearch<T> {
    protected array: T[];
    /**
     * Binary search through an array of numbers, or with a custom comparator and any type.
     */
    constructor(array: T[], options?: {
        comparator?: Comparator<T>;
    });
    /**
     * @param element The element to search for.
     * @returns True if element is found in the array, false if not.
     */
    has(element: T): boolean;
    /**
     * @param element The element to search for.
     * @returns The index of the element in the input array. If unfound, will return -1.
     */
    indexOf(element: T): number;
    /**
     * Similar to `indexOf`, except when the exact element isn't found, it will find the closest element nearby. This will
     * never return -1;
     */
    closestIndexOf(element: T): number;
    /**
     * @param index corresponding index in the input array.
     * @returns The element at index.
     */
    at(index: number): T;
    protected comparator: (a: T, b: T) => number;
    /** Applies the binary search algorithm and returns the index  */
    private search;
}
export default BinarySearch;
