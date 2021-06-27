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
 * @param {string} handler Function name of the callback function
 */
global.consumeAsyncJob = (closure: JobFunction, handler: string): void => {
  new JobBroker().consumeJob(closure, handler);
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
 * @param {string} handler Function name of the callback function
 */
global.perform = function (closure: JobFunction, handler: string): void {
  DelayedJobBroker.perform(closure, handler);
};
