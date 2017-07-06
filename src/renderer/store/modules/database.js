import { map, zipObj } from 'ramda';

import { loadTable } from '../../utils/datastore';

const TABLES = ['user', 'accounts'];

const state = { tables: {} };

const mutations = {
  loadTables(state, tables) {
    state.tables = tables;
  },
};

const actions = {
  initializeDatabase: ({ commit }) =>
    commit('loadTables', zipObj(TABLES, map(loadTable, TABLES))),
};

export default { state, actions, mutations };
