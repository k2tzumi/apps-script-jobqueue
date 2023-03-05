/// <reference types="google-apps-script" />

declare namespace AppsScriptJobqueue {
    interface JobBroker {
        enqueueAsyncJob<T extends Parameter>(callback: JobFunction<T>, parameter: Parameter): void;
        createDelaydJob<T extends Parameter>(scheduled_at: Date): DelayedJobBroker<T>;
        /**
         * Set the following function objects globally in your application that uses JobBroker
         * ex)
         * const jobEventHandler = JobBroker.consumeJob;
         */
        consumeJob: (event: TimeBasedEvent) => void;
    }

    interface _JobBroker<T extends Parameter> {
        enqueue(callback: JobFunction<T>, parameter: Parameter): void;
        dequeue(handler: string): Job | null;
        consumeJob(closure: JobFunction<T>, handler?: string): void;
    }
    interface DelayedJobBroker<T extends Parameter> extends _JobBroker<T> {
        performLater(callback: JobFunction<T>, parameter: Parameter): void
    }
    export type Trigger = GoogleAppsScript.Script.Trigger;
    export type Parameter = Record<string | number | symbol, object | string | number | boolean | null> | object[] | object;
    export type JobFunction<T> = (parameter: T) => boolean;
    export type Job = { parameter: JobParameter; trigger: Trigger };

    type AuthMode = GoogleAppsScript.Script.AuthMode;

    /**
     * @see https://developers.google.com/apps-script/guides/triggers/events#time-driven_events
     */
    export interface TimeBasedEvent {
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