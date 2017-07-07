export type JobFunction = (args: any[]) => Promise<any>;
export type JobPriority = 'high' | 'medium' | 'low';

export interface Job {
  jid: number;
  job: (args: any[]) => Promise<any>;
  jobArgs: any[];
  priority: JobPriority;
  running: boolean;
  runCount: number;
  retry?: { timeout?: number; attempts?: number; priority?: JobPriority; };
  requeue?: { timeout?: number; priority?: JobPriority, stop?: { after?: number } };
}

export interface JobQueue { high: number[]; medium: number[]; low: number[]; }

export interface JobsState {
  queue: JobQueue;
  jobs: { [jid: number]: Job };
  jobCounter: number;
  workers: number;
  paused: boolean;
}

export const state: JobsState = {
  queue: { high: [], medium: [], low: [] },
  jobs: {},
  jobCounter: 0,
  workers: 0,
  paused: false,
};
