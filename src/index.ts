import { JobBroker, JobFunction, Parameter, TimeBasedEvent } from "./JobBroker";
import { DelayedJobBroker } from "./DelayedJobBroker";

declare global {
  function jobEventHandler(event: TimeBasedEvent): void;
  function enqueueAsyncJob<T extends Parameter>(
    callback: JobFunction<T>,
    parameter: Parameter
  ): void;
  function createDelaydJob<T extends Parameter>(scheduled_at: Date): DelayedJobBroker<T>;
  function consumeJob(event: TimeBasedEvent, appGlobalThis: typeof globalThis): void;
}

/**
 * handler to execute the job.
 * @param {TimeBasedEvent} event Time-based event
 */
function jobEventHandler(event: TimeBasedEvent): void {
  // In practice, this process is not called. It needs to be implemented on the application side
  (globalThis as any).consumeJob(event, globalThis);
}
(globalThis as any).jobEventHandler = jobEventHandler;

/**
 * Register for asynchronous processing.
 * @param {JobFunction} callback call back funtion
 * @param {Parameter} parameter Specify parameters to be passed to the callback function
 */
(globalThis as any).enqueueAsyncJob = (
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
(globalThis as any).createDelaydJob = (scheduled_at: Date): DelayedJobBroker<object> => {
  return DelayedJobBroker.createJob<object>(jobEventHandler, scheduled_at);
};

/**
 * Consume job
 * @param {TimeBasedEvent} event Time-based event
 * @param {GlobalThis} appGlobalThis globalThis
 */
(globalThis as any).consumeJob = (
  event: TimeBasedEvent,
  appGlobalThis: typeof globalThis
): void => {
  new JobBroker<object>(jobEventHandler).consumeJob(event, appGlobalThis);
};
