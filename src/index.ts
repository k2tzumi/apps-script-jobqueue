import { JobBroker, JobFunction, Parameter, TimeBasedEvent } from "./JobBroker";
import { DelayedJobBroker } from "./DelayedJobBroker";

declare const global: {
  [x: string]: unknown;
};

const jobEventHandler = (event: TimeBasedEvent): void => {
  new JobBroker<object>(jobEventHandler).consumeJob(event);
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
  new JobBroker<object>(jobEventHandler).enqueue(callback, parameter);
};

/**
 * Create a delayed job
 * @param {Date} scheduled_at Scheduled time
 * @return {DelayedJobBroker} - delayed job
 */
global.createDelaydJob = (scheduled_at: Date): DelayedJobBroker<object> => {
  return DelayedJobBroker.createJob<object>(jobEventHandler, scheduled_at);
};
