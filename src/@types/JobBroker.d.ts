declare module JobBroker {
    interface JobBroker {
        enqueueAsyncJob(callback: JobFunction, parameter: Record<string, any>): void;
        consumeAsyncJob(closure: JobFunction, handler: string | null): void;
        createDelaydJob(scheduled_at: Date): DelayedJobBroker;
        perform(closure: JobFunction): void;
    }

    interface DelayedJobBroker {
        performLater(callback: JobFunction, arameter: Record<string, any>): void;
    }

    type JobFunction = (parameter: Record<string, any>) => void;
}

declare module "k2tzumi/apps-script-jobqueue" {
    export = JobBroker;
}
