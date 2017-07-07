import test from 'ava';
import { last } from 'ramda';

import { getEtherAddress, getEtherAddresses, parseBIP44Path } from '../../src/renderer/utils/wallet';

const sessionStub = {
  getEthereumAddress: path => new Promise(resolve => resolve({ address: `123-${last(path)}` })),
};

const deviceStub = {
  run: cb => new Promise(resolve => resolve(cb(sessionStub))),
};

test('correctly parses BIP44 path string', t => {
  const [purpose, coinType, account, change] = parseBIP44Path("m/44'/60'/0'/0");
  t.true(purpose === 2147483692);
  t.true(coinType === 2147483708);
  t.true(account === 2147483648);
  t.true(change === 0);
});

test('returns array of ETH address objects', async t => {
  const [first, second] = await getEtherAddresses(deviceStub, { indexes: [0, 1] });
  t.true(first.address === '123-0');
  t.true(second.address === '123-1');
});

test('returns single ETH address', async t => {
  const { address } = await getEtherAddress(deviceStub);
  t.true(address === '123-0');
});
