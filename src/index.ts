import { JobBroker, JobFunction, Parameter, TimeBasedEvent } from "./JobBroker";
import { DelayedJobBroker } from "./DelayedJobBroker";

declare const global: {
  [x: string]: unknown;
};

/**
 * handler to execute the job.
 * @param {TimeBasedEvent} event Time-based event
 */
const jobEventHandler = (event: TimeBasedEvent): void => {
  // In practice, this process is not called. It needs to be implemented on the application side
  globalThis.consumeJob(event, this);
};

global.jobEventHandler = jobEventHandler;

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

/**
 * Consume job
 * @param {TimeBasedEvent} event Time-based event
 * @param {GlobalThis} appGlobalThis globalThis
 */
global.consumeJob = (
  event: TimeBasedEvent,
  appGlobalThis: typeof globalThis
): void => {
  new JobBroker<object>(jobEventHandler).consumeJob(event, appGlobalThis);
};
