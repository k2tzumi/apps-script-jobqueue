import {
  JobBroker,
  JobFunction,
  Job,
  JobParameter,
  Parameter,
} from "./JobBroker";

class DelayedJobBroker extends JobBroker {
  private constructor(private scheduled_at: Date) {
    super();
  }

  static createJob(scheduled_at: Date): DelayedJobBroker {
    return new this(scheduled_at);
  }

  public performLater(callback: JobFunction<any>, parameter: Parameter): void {
    this.enqueue(callback, parameter);
  }

  static perform(closure: JobFunction<any>, handler?: string): void {
    new this(new Date()).consumeJob(
      closure,
      handler ? handler : this.perform.caller.name
    );
  }

  protected createJob(callback: JobFunction<any>, parameter: Parameter): Job {
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
