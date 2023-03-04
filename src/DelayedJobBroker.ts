import {
  JobBroker,
  JobFunction,
  Job,
  JobParameter,
  Parameter,
} from "./JobBroker";

class DelayedJobBroker<T extends Parameter> extends JobBroker<T> {
  private constructor(private scheduled_at: Date) {
    super();
  }

  static createJob<T extends Parameter>(
    scheduled_at: Date
  ): DelayedJobBroker<T> {
    return new this(scheduled_at);
  }

  public performLater(callback: JobFunction<T>, parameter: Parameter): void {
    this.enqueue(callback, parameter);
  }

  static perform<T extends Parameter>(
    closure: JobFunction<T>,
    handler?: string
  ): void {
    new this(new Date()).consumeJob(
      closure,
      handler ? handler : this.perform.caller.name
    );
  }

  protected createJob(callback: JobFunction<T>, parameter: Parameter): Job {
    const trigger = ScriptApp.newTrigger(callback.name)
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
