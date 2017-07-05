import { map, pipe, last, split, equals, ifElse } from 'ramda';

import { chomp, lchomp, toInt } from './functions';

/**
 * Hardening derivation function, applies a bitmask to
 * integer n, and zero-fills trailing zeroes.
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 *
 * @param n integer to apply hardening derivation to
 *
 * @return {Integer}
 */
const harden: (n: number) => number = n => (n | 0x80000000) >>> 0;

/**
 * Predicate that returns if path level needs hardened
 * derivation applied e.g. it has apostrophe "40'"
 *
 * @param level {String} BIP32 path level
 *
 * @return {Boolean}
 */
const derivedInt: (l: string) => boolean = pipe(last, equals('\''));

/**
 * Applies hardened derivation to the path level by
 * by stripping the trailing apostrophe, parsing the
 * integer, then applying the derivation function
 *
 * @param level {String} BIP32 path level
 *
 * @return {Integer}
 */
const deriveInt: (l: string) => number = pipe(chomp, toInt, harden);

/**
 * Parses a BIP32 path level, applying hardened derivation if
 * necessary, otherwise returning the parsed integer.
 *
 * @param level {String} BIP32 path level string (e.g. "40'" or "40")
 *
 * @return {Array<Integer>}
 */
const toPathInt: (l: string) => number = ifElse(derivedInt, deriveInt, toInt);

/**
 * Parses a BIP32 path string into the equivalent BIP32 path array
 * of integers.
 *
 * @param path {String} BIP32 path string e.g. "m/44'/60'/0'/0"
 *
 * @return {Array<Integer>}
 */
export const parsePath: (p: string) => number[] = pipe(lchomp, split('/'), map(toPathInt));
