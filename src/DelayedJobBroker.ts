import {
  JobBroker,
  JobFunction,
  Job,
  JobParameter,
  Parameter,
  TimeBasedEvent,
} from "./JobBroker";

class DelayedJobBroker<T extends Parameter> extends JobBroker<T> {
  private constructor(
    eventHandler: (event: TimeBasedEvent) => void,
    private scheduled_at: Date
  ) {
    super(eventHandler);
  }

  static createJob<T extends Parameter>(
    eventHandler: (event: TimeBasedEvent) => void,
    scheduled_at: Date
  ): DelayedJobBroker<T> {
    return new this(eventHandler, scheduled_at);
  }

  public performLater(callback: JobFunction<T>, parameter: Parameter): void {
    this.enqueue(callback, parameter);
  }

  protected createJob(callback: JobFunction<T>, parameter: Parameter): Job {
    const trigger = ScriptApp.newTrigger(this.eventHandler.name)
      .timeBased()
      .at(this.scheduled_at)
      .create();
    const jobParameter: JobParameter = {
      created_at: this.now,
      handler: callback.name,
      id: trigger.getUniqueId(),
      parameter: JSON.stringify(parameter),
      state: "waiting",
      scheduled_at: this.scheduled_at.getTime(),
    };

    return {
      trigger,
      parameter: jobParameter,
    };
  }
}

export { DelayedJobBroker };
