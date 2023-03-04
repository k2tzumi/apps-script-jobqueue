/// <reference types="google-apps-script" />

declare namespace AppsScriptJobqueue {
    interface JobBroker {
        enqueueAsyncJob(callback: JobFunction, parameter: JSONSerializable): void;
        consumeAsyncJob(closure: JobFunction, handler: string): void;
        createDelaydJob(scheduled_at: Date): DelayedJobBroker;
        perform(closure: JobFunction, handler: string): void;
    }

    interface _JobBroker {
        enqueue(callback: JobFunction, parameter: JSONSerializable): void;
        dequeue(handler: string): Job | null;
        consumeJob(closure: JobFunction, handler?: string): void;
    }
    interface DelayedJobBroker extends _JobBroker {
        perform(closure: JobFunction, handler?: string): void;
        performLater(callback: JobFunction, parameter: JSONSerializable): void
    }

    type EmptyObject = { [K in string | number]: never };
    type JSONSerializablePrimitive = null | boolean | string | number;
    type JSONSerializableObject = Partial<{ [key: string]: JSONSerializable }>;
    type JSONSerializableArray = JSONSerializable[];
    export type JSONSerializable =
        | JSONSerializablePrimitive
        | JSONSerializableArray
        | JSONSerializableObject
        | EmptyObject;
    export type Trigger = GoogleAppsScript.Script.Trigger;
    export type JobFunction = (parameter: JSONSerializable) => void;
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