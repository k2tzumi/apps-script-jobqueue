import { JobBroker, JobFunction, Parameter } from "./JobBroker";
import { DelayedJobBroker } from "./DelayedJobBroker";

declare const global: {
  [x: string]: unknown;
};

/**
 * Register for asynchronous processing.
 * @param {JobFunction} callback call back funtion
 * @param {Parameter} parameter Specify parameters to be passed to the callback function
 */
global.enqueueAsyncJob = (
  callback: JobFunction<object>,
  parameter: Parameter
): void => {
  new JobBroker<object>().enqueue(callback, parameter);
};

/**
 * Consume asynchronous processing.
 * @param {JobFunction} closure The main processing function of the callback
 * @param {string} handler Function name of the callback function
 */
global.consumeAsyncJob = (
  closure: JobFunction<object>,
  handler: string
): void => {
  new JobBroker<object>().consumeJob(closure, handler);
};

/**
 * Create a delayed job
 * @param {Date} scheduled_at Scheduled time
 * @return {DelayedJobBroker} - delayed job
 */
global.createDelaydJob = (scheduled_at: Date): DelayedJobBroker<object> => {
  return DelayedJobBroker.createJob<object>(scheduled_at);
};

/**
 * Perform a scheduled job.
 * @param {JobFunction} closure The main processing function of the callback
 * @param {string} handler Function name of the callback function
 */
global.perform = (closure: JobFunction<object>, handler: string): void => {
  DelayedJobBroker.perform<object>(closure, handler);
};
