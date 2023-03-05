// type CacheService = GoogleAppsScript.Cache.CacheService;
// type ScriptApp = GoogleAppsScript.Script.ScriptApp;
// type LockService = GoogleAppsScript.Lock.LockService;
type Cache = GoogleAppsScript.Cache.Cache;
type Trigger = GoogleAppsScript.Script.Trigger;
type AuthMode = GoogleAppsScript.Script.AuthMode;

type Parameter =
  | Record<string | number | symbol, object | string | number | boolean | null>
  | object[]
  | object;

type JobFunction<T> = (parameter: T) => boolean;

interface JobParameter {
  id: string;
  state: string;
  scheduled_at?: number;
  start_at?: number;
  end_at?: number;
  created_at: number;
  handler: string;
  parameter: string;
}

/**
 * @see https://developers.google.com/apps-script/guides/triggers/events#time-driven_events
 */
interface TimeBasedEvent {
  authMode: AuthMode;
  "day-of-month": number;
  "day-of-week": number;
  hour: number;
  minute: number;
  month: number;
  second: number;
  timezone: string;
  triggerUid: string;
  "week-of-year": number;
  year: number;
}

type Job = { parameter: JobParameter; trigger: Trigger };

const MAX_SLOT = 10;
const DELAY_DURATION = 150;
// 1 Hour
const JOB_EXECUTE_TIME_OUT = 3600;
/**
 * 15 min
 * @see https://developers.google.com/apps-script/reference/script/clock-trigger-builder#atdateyear,-month,-day
 */
const JOB_STARTING_TIME_OUT = 900;

class JobBroker<T extends Parameter> {
  private queue: Cache;
  private triggers: Trigger[];

  public constructor(protected eventHandler: (event: TimeBasedEvent) => void) {
    this.queue = CacheService.getScriptCache();
    this.triggers = ScriptApp.getProjectTriggers();
  }

  public enqueue(callback: JobFunction<T>, parameter: Parameter): void {
    if (callback.name === "anonymous") {
      throw new Error("Unsupport anonymous callback function.");
    }
    if (this.triggers.length > MAX_SLOT) {
      throw new Error("Busy.");
    }

    this.saveJob(this.createJob(callback, parameter));
  }

  public consumeJob(event: TimeBasedEvent): void {
    console.info(`consumeJob called. event: ${JSON.stringify(event)}`);

    const scriptLock = LockService.getScriptLock();

    if (scriptLock.tryLock(500)) {
      const popJob = this.dequeue(event.triggerUid);

      if (popJob) {
        const { parameter } = popJob;
        parameter.state = "starting";
        parameter.start_at = this.now;
        this.saveJob(popJob);

        scriptLock.releaseLock();

        console.info(
          `job starting. id: ${parameter.id}, created_at: ${parameter.created_at}, start_at: ${parameter.start_at}, parameter: ${parameter.parameter}`
        );

        try {
          const result = this[parameter.handler](
            JSON.parse(parameter.parameter)
          );
          if (!result) {
            throw new Error("Job function failed.");
          }

          parameter.state = "end";
          parameter.end_at = this.now;
          this.saveJob(popJob);
          console.info(
            `job success. id: ${parameter.id}, created_at: ${parameter.created_at}, start_at: ${parameter.start_at}, start_at: ${parameter.end_at}, parameter: ${parameter.parameter}`
          );
        } catch (e) {
          parameter.state = "failed";
          parameter.end_at = this.now;
          this.saveJob(popJob);
          console.warn(
            `job failed. message: ${e.message}, stack: ${e.stack}, id: ${parameter.id}, created_at: ${parameter.created_at}, start_at: ${parameter.start_at}, start_at: ${parameter.end_at}, parameter: ${parameter.parameter}`
          );

          this.purgeTimeoutQueue();
          scriptLock.releaseLock();
          throw e;
        }
      } else {
        console.info(`Nothing active job. triggerUid: ${event.triggerUid}`);
      }

      this.purgeTimeoutQueue();
      scriptLock.releaseLock();
    }
  }

  protected dequeue(triggerUid: string): Job | null {
    for (const trigger of this.triggers) {
      if (trigger.getTriggerSource() !== ScriptApp.TriggerSource.CLOCK) {
        continue;
      }

      if (trigger.getUniqueId() !== triggerUid) {
        continue;
      }

      const parameter = this.getJobParameter(trigger);
      if (parameter) {
        return {
          parameter,
          trigger,
        };
      } else {
        return null;
      }
    }

    return null;
  }

  public purgeTimeoutQueue() {
    for (const trigger of this.triggers) {
      if (trigger.getTriggerSource() !== ScriptApp.TriggerSource.CLOCK) {
        continue;
      }

      const parameter = this.getJobParameter(trigger);
      if (parameter) {
        if (this.isExpire(parameter)) {
          const { state, start_at, id, created_at, end_at } = parameter;

          if (state === "end" || state === "failed") {
            console.info(
              `job clear. id: ${id}, handler: ${trigger.getHandlerFunction()}, status: ${state}, created_at: ${created_at}, start_at: ${start_at}, end_at: ${end_at}`
            );
          } else {
            console.info(
              `job time out. id: ${id}, handler: ${trigger.getHandlerFunction()}, status: ${state}, parameter: ${
                parameter.parameter
              }, created_at: ${created_at}, start_at: ${start_at}`
            );
          }
          ScriptApp.deleteTrigger(trigger);
          this.deleteJob(trigger);
        }
      } else {
        console.info(
          `Delete cached out trigger. id: ${trigger.getUniqueId()}, handler: ${trigger.getHandlerFunction()}`
        );
        ScriptApp.deleteTrigger(trigger);
      }
    }
  }

  protected createJob(callback: JobFunction<T>, parameter: Parameter): Job {
    const trigger = ScriptApp.newTrigger(this.eventHandler.name)
      .timeBased()
      .after(DELAY_DURATION)
      .create();
    const jobParameter: JobParameter = {
      created_at: this.now,
      handler: callback.name,
      id: trigger.getUniqueId(),
      parameter: JSON.stringify(parameter),
      state: "waiting",
    };

    return {
      parameter: jobParameter,
      trigger,
    };
  }

  private getJobParameter(trigger: Trigger): JobParameter | null {
    const job = this.queue.get(trigger.getUniqueId());

    if (job) {
      return JSON.parse(job);
    } else {
      return null;
    }
  }

  private saveJob(job: Job): void {
    const expirationInSeconds = this.getCacheExpirationInSeconds(job.parameter);

    if (expirationInSeconds) {
      this.queue.put(
        job.trigger.getUniqueId(),
        JSON.stringify(job.parameter),
        expirationInSeconds
      );
    } else {
      this.queue.put(job.trigger.getUniqueId(), JSON.stringify(job.parameter));
    }
  }

  private getCacheExpirationInSeconds(
    jobParameter: JobParameter
  ): number | null {
    switch (jobParameter.state) {
      case "waiting":
        if (jobParameter.scheduled_at) {
          return (
            JOB_STARTING_TIME_OUT +
            Math.round((jobParameter.scheduled_at - this.now) / 1000)
          );
        } else {
          // JOB_STARTING_TIME_OUT + DELAY_DURATION(round up milliseconds)
          return JOB_STARTING_TIME_OUT + 1;
        }
      case "starting":
        return JOB_EXECUTE_TIME_OUT;
      case "end":
      case "failed":
        // expire
        return 0;
      default:
        // 6 hour
        return null;
    }
  }

  private isExpire(parameter: JobParameter): boolean {
    switch (parameter.state) {
      case "waiting":
        if (parameter.scheduled_at) {
          return (
            Math.ceil((this.now - parameter.scheduled_at) / 1000) >=
            JOB_STARTING_TIME_OUT
          );
        } else {
          return (
            Math.ceil((this.now - parameter.created_at) / 1000) >=
            JOB_STARTING_TIME_OUT
          );
        }
      case "starting":
        if (parameter.start_at) {
          return (
            Math.ceil((this.now - parameter.start_at) / 1000) >=
            JOB_STARTING_TIME_OUT
          );
        }
        return true;
      case "end":
      case "failed":
      default:
        return true;
    }
  }

  private deleteJob(trigger: Trigger): void {
    this.queue.remove(trigger.getUniqueId());
  }

  protected get now(): number {
    return new Date().getTime();
  }
}

export { JobBroker, JobFunction, JobParameter, Job, Parameter, TimeBasedEvent };
