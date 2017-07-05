import R from 'ramda';

import { DeviceList } from 'trezor.js-node';

const state = {
  devicesList: undefined,
  currentDevice: undefined,
  deviceFlowEvent: undefined,
  deviceFlowCallback: undefined,
  connectedDevices: [],
};

const getters = {
};

const mutations = {
  setDevicesList(state, devicesList) {
    state.devicesList = devicesList;
  },
  setCurrentDevice(state, device) {
    state.currentDevice = device;
  },
  setDeviceFlowEvent(state, event, callback) {
    state.deviceFlowEvent = event;
    state.deviceFlowCallback = callback;
  },
  addConnectedDevice(state, device) {
    state.connectedDevices = R.concat(state.connectedDevices, device);
  },
};

const actions = {
  initializeWallet({ dispatch, commit }) {
    const list = new DeviceList();

    list.on('connect', R.curry(dispatch)('initializeDevice'));

    commit('setDevicesList', list);
  },
  initializeDevice({ commit, state: { currentDevice } }, device) {
    device.on('pin', (type, cb) => commit('setDeviceFlowEvent', 'pin', R.curry(cb)(null)));

    commit('addConnectedDevice', device);

    if (!currentDevice) { commit('setCurrentDevice', device); }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
