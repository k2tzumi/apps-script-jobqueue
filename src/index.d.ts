/// <reference types="google-apps-script" />

declare namespace AppsScriptJobqueue {
    interface JobBroker {
        enqueueAsyncJob(callback: JobFunction<any>, parameter: Parameter): void;
        consumeAsyncJob(closure: JobFunction<any>, handler: string): void;
        createDelaydJob(scheduled_at: Date): DelayedJobBroker;
        perform(closure: JobFunction<any>, handler: string): void;
    }

    interface _JobBroker {
        enqueue(callback: JobFunction<any>, parameter: Parameter): void;
        dequeue(handler: string): Job | null;
        consumeJob(closure: JobFunction<any>, handler?: string): void;
    }
    interface DelayedJobBroker extends _JobBroker {
        perform(closure: JobFunction<any>, handler?: string): void;
        performLater(callback: JobFunction<any>, parameter: Parameter): void
    }
    export type Trigger = GoogleAppsScript.Script.Trigger;
    export type Parameter = Record<string | number | symbol, object | string | number | boolean | null>|{}[]|object;
    export type JobFunction<T extends Parameter> = (parameter: T) => void;
    export type Job = { parameter: JobParameter; trigger: Trigger };

    export var JobParameter: JobParameter;
    export var DelayedJobBroker: DelayedJobBroker;


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