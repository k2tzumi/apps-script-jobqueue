declare module "apps-script-jobqueue" {
    export function enqueueAsyncJob(callback: JobFunction, parameter: Record<string, any>): void;
    export function consumeAsyncJob(closure: JobFunction, handler: string | null): void;
    export function createDelaydJob(scheduled_at: Date): DelayedJobBroker;
    export function perform(closure: JobFunction): void;

    export interface JobBroker {
        enqueue(callback: JobFunction, parameter: Record<string, any>): void;
        dequeue(handler: string): Job | null;
        perform(closure: JobFunction): void;
        consumeJob(closure: JobFunction, handler: string | null): void;
    }

    export interface DelayedJobBroker extends JobBroker {
        performLater(callback: JobFunction,parameter: Record<string, any>): void
    }

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

    export type Trigger = GoogleAppsScript.Script.Trigger;
    export type JobFunction = (parameter: Record<string, any>) => void;
    export type Job = { parameter: JobParameter; trigger: Trigger }
