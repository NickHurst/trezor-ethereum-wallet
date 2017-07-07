import * as Vuex from 'vuex';

import { drop, omit } from 'ramda';

import { Job, JobFunction, JobPriority, JobsState } from './state';

type Store = Vuex.Store<JobsState>;
type Mutation = Vuex.Mutation<JobsState>;
type MutationTree = Vuex.MutationTree<JobsState>;

export interface JobsMutations extends MutationTree {
  createJob: (state: State, payload: { job: Job }) => void;
  updateJob: (state: State, payload: { jid: number, update: object }) => void;
  removeJob: (state: State, payload: { jid: number }) => void;
  enqueue: (jid: number) => void;
  dequeue: (priority: string) => void;
  incrementWorkers: () => void;
  decrementWorkers: () => void;
  pause: () => void;
  unpause: () => void;
}

export const mutations: JobsMutations = {
  createJob(state, { job }) {
    const jid = state.jobCounter;
    state.jobs = { ...state.jobs, [jid]: { ...job, jid } };
    state.jobCounter++;
  },
  updateJob(state, { jid, update }) {
    state.jobs[jid] = { ...state.jobs[jid], ...update };
  },
  removeJob(state, { jid }) {
    state.jobs = omit([jid], state.jobs);
  },
  enqueue(state, { jid }) {
    const { priority } = state.jobs[jid];
    state.queue = { ...state.queue, [priority]: state.queue[priority].concat(jid) };
  },
  dequeue(state, { priority }) {
    state.queue = { ...state.queue, [priority]: drop(1, state.queue[priority]) };
  },
  incrementWorkers(state) {
    state.workers++;
  },
  decrementWorkers(state) {
    state.workers--;
  },
  pause(state) {
    state.paused = true;
  },
  unpause(state) {
    state.paused = false;
  },
};
