import { enqueueAsyncJob, consumeAsyncJob } from "./JobBroker";
import { createDelaydJob, perform } from "./DelayedJobBroker";

declare const global: {
  [x: string]: unknown;
};

/**
 * Register for asynchronous processing.
 * @param {JobFunction} callback call back funtion
 * @param {Record<string, any>} parameter Specify parameters to be passed to the callback function
 */
global.enqueueAsyncJob = enqueueAsyncJob;

/**
 * Consume asynchronous processing.
 * @param {JobFunction} closure The main processing function of the callback
 * @param {?string} [handler=null] Function name of the callback function
 */
global.consumeAsyncJob = consumeAsyncJob;

/**
 * Create a delayed job
 * @param {Date} scheduled_at Scheduled time
 * @returns {DelayedJobBroker} - delayed job
 */
global.createDelaydJob = createDelaydJob;

/**
 * Perform a scheduled job.
 * @param {JobFunction} closure The main processing function of the callback
 */
global.perform = perform;
