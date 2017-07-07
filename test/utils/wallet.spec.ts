import test from 'ava';

import { getEtherAddress, getEtherAddresses, parseBIP44Path } from '../../src/renderer/utils/wallet';

const sessionStub = {
  getEthereumAddress: path => new Promise(resolve => resolve({ address: '123' })),
};

const deviceStub = {
  run: cb => new Promise(resolve => resolve(cb(sessionStub))),
};

test('correctly parses BIP44 path string', t => {
  const path = parseBIP44Path("m/44'/60'/0'/0");
  t.true(path[0] === 2147483692);
  t.true(path[1] === 2147483708);
  t.true(path[2] === 2147483648);
  t.true(path[3] === 0);
});

test('returns array of ETH address objects', async t => {
  const addresses = await getEtherAddresses(deviceStub, { indexes: [0, 1] });
  t.true(addresses.length === 2);
  t.true(addresses[0].address === '123');
});

test('returns single ETH address', async t => {
  const { address } = await getEtherAddress(deviceStub);
  t.true(address === '123');
});
