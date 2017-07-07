import { curry, drop, dropLast, equals, pipe, type } from 'ramda';

/**
 * Calls Promise.all with passed argument
 *
 * @param promises {Array}
 *
 * @return {Promise}
 */
export const allP: (promises: Array<Promise<any>>) => Promise<any[]> = arr => Promise.all(arr);

/**
 * Removes the last character/item from a string/array.
 *
 * @param item {String|Array}
 *
 * @return {String|Array}
 */
export const chomp: (item: string | any[]) => string | any[] = dropLast(1);

/**
 * Removes the first character/item from a string/array.
 *
 * @param item {String|Array}
 *
 * @return {String|Array}
 */
export const lchomp: (item: string | any[]) => string | any[] = drop(1);

/**
 * Returns boolean of whether or not item passed is an array.
 *
 * @param item
 *
 * @return {Boolean}
 */
export const isArray: (item: any) => boolean = pipe(type, equals('Array'));

/**
 * Curried parseInt function that reverses the original function's
 * parameters. If both params are supplied a Number is returned, if
 * only the radix is supplied a function that takes a string and returns
 * a number is returned.
 *
 * @param r {Number} radix
 * @param s {String}
 *
 * @return {Number|Function}
 */
const curriedParseInt: (r: number, s?: string) => (s?: string) => number | number =
  curry((r, s) => parseInt(s, r));

/**
 * Parse binary string into Integer.
 *
 * @param s {String} binary string (e.g. '0b010101')
 *
 * @return {Number}
 */
export const parseBinary: (s: string) => number = curriedParseInt(2);

/**
 * Parse base 10 integer string into Integer.
 *
 * @param s {String} base 10 integer string (e.g. '10')
 *
 * @return {Number}
 */
export const parseInteger: (s: string) => number = curriedParseInt(10);

/**
 * Curried bitwise OR function. If one parameter is supplied a function that
 * expects the right side of equation and returns the result of the bitwise
 * or is returned, if both are supplied the result of the bitwise or is
 * returned.
 *
 * @param x {Number}
 * @param y {Number}
 *
 * @return {Number}
 */
export const bitOr: (x: number, y?: number) => (y: number) => number | number =
  curry((x, y) => x | y);

/**
 * Curried bitwise zero fill right function. The first parameter is the fill
 * or the right side of the equation, the second is the number to fill. If
 * only one parameter is supplied a function that takes a number and returns
 * the zero fill of the previously supplied paramter. If both are supplied
 * the zero fill right result is returned.
 *
 * @param fill {Number} the fill to apply (e.g. x >>> 0 // 0 is the fill)
 * @param n {Number} the number to be filled (e.g. n >>> fill)
 *
 * @return {Number|Function}
 */
export const bitZeroFillRight: (fill: number, n?: number) => (n: number) => number | number =
  curry((fill, n) => n >>> fill);
