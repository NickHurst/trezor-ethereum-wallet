import { __, append, call, converge, curryN, drop, equals, flip, head, identity, ifElse, last, map, nthArg, once, pair, pipe, prop, split, unapply, unless } from 'ramda';

import { bitOr, bitZeroFillRight, chomp, isArray, lchomp, parseInteger, reduceP } from './functions';

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
  pipe(chomp, parseInteger, bitOr(0x80000000), bitZeroFillRight(0));

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
const parseBIP44PathLevel: (pathLevel: string) => number =
  ifElse(pipe(last, equals("'")), applyDerivationMask, parseInteger);

/**
 * Parses a BIP44 path string into a BIP32 path array.
 *
 * @param pathString {String} BIP44 path string e.g. "m/44'/60'/0'/0"
 *
 * @return {Array<Number>}
 */
export const parseBIP44Path: (pathString: string) => number[] =
  pipe(drop(2), split('/'), map(parseBIP44PathLevel));

interface EtherAddressOptions { index?: number; indexes?: number[]; path?: string; }

/**
 * Gets Ethereum wallet addresses on the passed device
 * at the specifed path indexes.
 *
 * The default path used for Ether wallets is m/40'/60'/0'/0/addressIndex.
 *
 * @see github.com/ethereum/EIPs/issues/84
 * @see github.com/satoshilabs/slips/blob/master/slip-0044.md
 *
 * @param device {Object} Trezor Device object
 * @param options {Object}
 *   @option path {String} path to wallet - default is BIP44 path ("m/40'/60'/0'/0/addressIndex")
 *   @option indexes {Array<Number>} wallet address indexes - default is [0]
 *
 * @return {Promise}
 */
export const getEtherAddresses: (device: Trezor.Device, options?: EtherAddressOptions) => Promise<Trezor.EtherAddress[]> =
  async (device, { path: pathStr = 'm/40\'/60\'/0\'/0', indexes = [0] } = {}) => {
    const path = parseBIP44Path(pathStr);
    const getAddresses: (session: Trezor.Session) => Promise<Trezor.EtherAddress[]> =
      pipe(prop('getEthereumAddress'), map(__, map(append(__, path), indexes)), reduceP);

    return await device.run<Trezor.EtherAddress[]>(getAddresses);
  };

/**
 * Gets a single ethereum wallet address at the specified path and index.
 *
 * @param device {Object} Trezor Device object
 * @param options {Object}
 *   @option path {String} path to wallet - default is BIP44 path ("m/40'/60'/0'/0/addressIndex")
 *   @option index {Number} wallet address index - default is 0
 *
 * @return {Promise}
 */
export const getEtherAddress: (device: Trezor.Device, options?: EtherAddressOptions) => Promise<Trezor.EtherAddress> =
  async (device, { path = 'm/40\'/60\'/0\'/0', index = 0 } = {}) =>
    last(await getEtherAddresses(device, { path, indexes: [index] }));
