import R from 'ramda';

import { DeviceList } from 'trezor.js-node';

import { parsePath } from './wallet';

export const getTrezorDevices: () => any[] = () => new DeviceList().devices;

export const getEthereumWallet = async (device, { index = 0, path = 'm/40\'/60\'/0\'/0' } = {}) => {
  // console.log(getTrezorDevices())
  // window['devices'] = getTrezorDevices();
  // console.log(Object.keys(new DeviceList))
  // const device = R.last(getTrezorDevices());
  // console.log(device);
  // // if (!device) { throw Error; }

  // const wallet = await device.run(session => session.ethereumGetAddress([...parsePath(path), index]));
  // return wallet;

  console.log(device);
  return await device.run(session => session.ethereumGetAddress([...parsePath(path), index], true));
};
