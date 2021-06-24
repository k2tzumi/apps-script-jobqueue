import { JobBroker, JobFunction } from "./JobBroker";
import { DelayedJobBroker } from "./DelayedJobBroker";

declare const global: {
  [x: string]: unknown;
};

/**
 * Register for asynchronous processing.
 * @param {JobFunction} callback call back funtion
 * @param {Record<string, any>} parameter Specify parameters to be passed to the callback function
 */
global.enqueueAsyncJob = (
  callback: JobFunction,
  parameter: Record<string, any>
): void => {
  new JobBroker().enqueue(callback, parameter);
};

/**
 * Consume asynchronous processing.
 * @param {JobFunction} closure The main processing function of the callback
 * @param {?string} [handler] Function name of the callback function
 */
global.consumeAsyncJob = (closure: JobFunction, handler?: string): void => {
  let callerName = handler;
  if (!handler) {
    try {
      throw new Error();
    } catch (e) {
      const re = /(\w+)@|at (\w+) \(/g,
        st = e.stack;
      let m;
      callerName = "NONE";
      while ((m = re.exec(st))) {
        callerName = m != null ? m[1] || m[2] : "NONE";
      }
    }
  }

  new JobBroker().consumeJob(closure, callerName);
};

/**
 * Create a delayed job
 * @param {Date} scheduled_at Scheduled time
 * @return {DelayedJobBroker} - delayed job
 */
global.createDelaydJob = (scheduled_at: Date): DelayedJobBroker => {
  return DelayedJobBroker.createJob(scheduled_at);
};

/**
 * Perform a scheduled job.
 * @param {JobFunction} closure The main processing function of the callback
 * @param {?string} [handler] Function name of the callback function
 */
global.perform = (closure: JobFunction, handler?: string): void => {
  let callerName = handler;
  if (!handler) {
    try {
      throw new Error();
    } catch (e) {
      const re = /(\w+)@|at (\w+) \(/g,
        st = e.stack;
      let m;
      callerName = "NONE";
      while ((m = re.exec(st))) {
        callerName = m != null ? m[1] || m[2] : "NONE";
      }
    }
  }
  DelayedJobBroker.perform(closure, callerName);
};
