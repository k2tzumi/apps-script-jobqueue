/// <reference types="google-apps-script" />

declare namespace AppsScriptJobqueue {
    interface JobBroker {
        enqueueAsyncJob<T extends Parameter>(callback: JobFunction<T>, parameter: Parameter): void;
        consumeAsyncJob<T extends Parameter>(closure: JobFunction<T>, handler: string): void;
        createDelaydJob<T extends Parameter>(scheduled_at: Date): DelayedJobBroker<T>;
        perform<T extends Parameter>(closure: JobFunction<T>, handler: string): void;
    }

    interface _JobBroker<T extends Parameter> {
        enqueue(callback: JobFunction<T>, parameter: Parameter): void;
        dequeue(handler: string): Job | null;
        consumeJob(closure: JobFunction<T>, handler?: string): void;
    }
    interface DelayedJobBroker<T extends Parameter> extends _JobBroker<T> {
        perform(closure: JobFunction<T>, handler?: string): void;
        performLater(callback: JobFunction<T>, parameter: Parameter): void
    }
    export type Trigger = GoogleAppsScript.Script.Trigger;
    export type Parameter = Record<string | number | symbol, object | string | number | boolean | null>|object[]|object;
    export type JobFunction<T> = (parameter: T) => void;
    export type Job = { parameter: JobParameter; trigger: Trigger };

    export var JobParameter: JobParameter;
    export var DelayedJobBroker: DelayedJobBroker<Parameter>;


    export interface JobParameter {
        id: string;
        state: string;
        scheduled_at?: number;
        start_at?: number;
        end_at?: number;
        created_at: number;
        handler: string;
        parameter: string;
    }
}


declare var JobBroker: AppsScriptJobqueue.JobBroker;