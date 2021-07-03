/// <reference types="google-apps-script" />

declare module "apps-script-jobqueue" {
    export namespace JobBroker {
        export function enqueueAsyncJob(callback: JobFunction, parameter: Record<string, any>): void;
        export function consumeAsyncJob(closure: JobFunction, handler: string): void;
        export function createDelaydJob(scheduled_at: Date): DelayedJobBroker;
        export function perform(closure: JobFunction, handler: string): void;

        interface JobBroker {
            enqueue(callback: JobFunction, parameter: Record<string, any>): void;
            dequeue(handler: string): Job | null;
            consumeJob(closure: JobFunction, handler?: string): void;
        }
        export interface DelayedJobBroker extends JobBroker {
            perform(closure: JobFunction, handler?: string): void;
            performLater(callback: JobFunction, parameter: Record<string, any>): void
        }
        
        export type Trigger = GoogleAppsScript.Script.Trigger;
        export type JobFunction = (parameter: Record<string, any>) => void;
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
}
