import { __, concat, equals, ifElse, insert, last, map, once, pipe, split, unless } from 'ramda';

import { bitOr, bitZFillRight0, chomp, isArray, lchomp, parseInteger } from './functions';

/**
 * Applies 0x80000000 bitmask to passed BIP44 path level
 * to mark that the path level requires hardened derviation.
 *
 * @see github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 * @see github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 *
 * @param level {String} BIP44 path level
 *
 * @return {Number}
 */
const applyDerivationMask: (pathLevel: string) => number =
  pipe(chomp, parseInteger, bitOr(0x80000000), bitZFillRight0);

/**
 * Parses BIP44 path level string into BIP32 path integer. If
 * the path level is marked with an apostrophe the parsed int
 * gets a bitmask applied to mark that it requires hardened derivation,
 * else the path level is just parsed into an integer.
 *
 * @param level {String} BIP44 path level string (e.g. "40'" or "40")
 *
 * @return {Array<Number>}
 */
const parseBip44PathLevel: (pathLevel: string) => number =
  ifElse(pipe(last, equals("'")), applyDerivationMask, parseInteger);

/**
 * Parses a BIP44 path string into a BIP32 path array.
 *
 * @param pathString {String} BIP44 path string e.g. "m/44'/60'/0'/0"
 *
 * @return {Array<Number>}
 */
export const parseBIP44Path: (pathString: string) => number[] =
  pipe(lchomp, split('/'), map(parseBip44PathLevel));

interface ETHWalletOptions { index?: number | number[]; path?: string; }

/**
 * Gets Ethereum wallet address(es) on the passed device
 * at the specifed path index(es).
 *
 * The default path used for Ether wallets is m/40'/60'/0'/0/address_index.
 *
 * @see github.com/ethereum/EIPs/issues/84
 * @see github.com/satoshilabs/slips/blob/master/slip-0044.md
 *
 * @param device {Object} Trezor Device object
 *
 * @return {Promise}
 */
export const getEthereumAddress: (device: any, options: ETHWalletOptions) => Promise<any[]> =
  (device, { index = 0, path = 'm/40\'/60\'/0\'/0' }) => {
    const indexes = unless(isArray, insert(0, __, []), index);
    const toPath: (i: number) => number[] = insert(-1, __, once(parseBIP44Path(path)));

    return device.run(async session =>
      await Promise.all(map(pipe(toPath, session.getEthereumAddress), indexes)),
    );
  };
