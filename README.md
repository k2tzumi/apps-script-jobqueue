[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
![ci](https://github.com/k2tzumi/apps-script-jobqueue/workflows/ci/badge.svg)

# A simple job-queue for Apps Script

JobBroker is a library for Google Apps Script that provides asynchronous processing functions using Triggers.


>　[!WARNING]
>　Migration to V8 Runtime
> 
> This library has been migrated to support the V8 runtime, as the Rhino runtime for Google Apps Script will reach End of Life (EOL) at the end of January 2026.
> 
> **From February 2026, to use this library (version 58 or later), your application must enable the V8 runtime.**
> 
> Rhino runtime will no longer be supported. For details on enabling or > migrating to the V8 runtime, please refer to the official Google guide below:
> 
> 👉 [V8 Runtime Migration Guide (Google Official)](https://developers.google.com/apps-script/guides/v8-runtime/migration?hl=en)

## Setup

This library is published as Apps Script, so you can integrate it into your project.
To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."  
In the "Find a Library" text box, enter the script ID `11cz2CGI2m3W1_JS7PwnxL2_6hkvtj47ynFuxKDDAAUwh3jP04sYnigg8` and click the "Select" button.
1. Choose a version in the dropdown box (usually best to pick the latest version).
1. Click the "Save" button.

## Usage

The procedure for asynchronous processing using the library when writing google apps script in typescript is as follows.

### 1. Setup

If you use JobBroker type definitions, please do the following.

```console
$ npm install --save-dev github:k2tzumi/apps-script-jobqueue
```

JobBroker handles time-based trigger events internally. Time-based trigger events are a feature of Apps Script that allows you to run a function at a specified time or interval. JobBroker uses this feature to perform asynchronous processing by scheduling and executing jobs in the background. You don’t need to set up the trigger events manually, as JobBroker does it for you automatically.

https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers

Put the above code in your google apps script where you want asynchronous processing.

```ts
import "apps-script-jobqueue";
type Parameter = AppsScriptJobqueue.Parameter;
type TimeBasedEvent = AppsScriptJobqueue.TimeBasedEvent;

function jobEventHandler(event: TimeBasedEvent): void {
  JobBroker.consumeJob(event, globalThis);
}
```

JobBroker.consumeJob method receives the time-based trigger event and executes the job registered in the job queue.

### 2. Register a job (enqueue)

Register a function object for asynchronous processing, including its parameters.  
Internally, a trigger for immediate execution will be generated.

```ts
// Type definition of arguments passed to asynchronous processing
interface JobParameter {
  type: string;
  message: string;
}

// Define the body of the asynchronous processing as a global function
function asyncFunction(parameter: JobParameter): boolean = {
  // Describe the contents of the asynchronous processing

  // The following is an example of asynchronous console output
  console.log(`Asynchronous output. message ${parameter.message}`);

  // If the job execution status is success, specify true
  return true;
};

const parameter = { type: "async", message: "message" } as JobParameter;

// Register a job in the job queue. Parameters are specified in generic to be type safe.
JobBroker.enqueueAsyncJob<JobParameter>(asyncFunction, parameter);
```

### Timed asynchronous processing

The usage steps are the same as for normal asynchronous processing.  
The difference is in specifying the time to delay execution and the function to call it.

```ts
function delayFunction(parameter: JobParameter): boolean = {
  // Describe the process to be executed on a delayed basis

  // The following is an example of asynchronous console output
  console.log(`Delayed execution output. message ${parameter.message}`);

  // If the job execution status is success, specify true
  return true;
};

const parameter = { type: "delay", message: "message" } as JobParameter;

const startTIme = new Date();
// 3 minutes later
startTime.setMinutes(startTIme.getMinutes() + 3);

// Let the job register after specifying the time for delayed execution.
JobBroker.createDelaydJob<JobParameter>(startTime).performLater(delayFunction, parameter);
```

## Document

see.
https://script.google.com/macros/library/d/11cz2CGI2m3W1_JS7PwnxL2_6hkvtj47ynFuxKDDAAUwh3jP04sYnigg8/58