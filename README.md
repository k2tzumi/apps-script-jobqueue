[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
![ci](https://github.com/k2tzumi/apps-script-jobqueue/workflows/ci/badge.svg)

# A simple job-queue for Apps Script

JobBroker is a library for Google Apps Script that provides asynchronous processing functions using Triggers.

## Setup

This library is published as Apps Script, so you can integrate it into your project.
To add it to your script, do the following in the Apps Script code editor:

1. Click on the menu item "Resources > Libraries..."  
In the "Find a Library" text box, enter the script ID `11cz2CGI2m3W1_JS7PwnxL2_6hkvtj47ynFuxKDDAAUwh3jP04sYnigg8` and click the "Select" button.
1. Choose a version in the dropdown box (usually best to pick the latest version).
1. Click the "Save" button.

## Usage

Using the library to asynchronous processing has the following steps.

### 1. Register a job (enqueue)

Register a function object for asynchronous processing, including its parameters.  
Internally, a trigger for immediate execution will be generated.

```ts
const asyncFunction = (): void = {
    // Details will be described below.
};

const parameter = { foo: "bar" };
JobBroker.enqueueAsyncJob(asyncFunction, parameter);
```

### 2. Run a job (consume job)

Registered functions will be executed via triggers.  
Specify the callback function that consumes the job and the name of the function that was triggered.   
The specified callback function will be the body of the asynchronous process.  
The callback function can receive the parameters specified at the time of job registration.  
Internally, the trigger will be removed after the callback process is completed.

```ts
const asyncFunction = (): void => {
  JobBroker.consumeAsyncJob((parameter: Record<string, any>) => {
    console.info(JSON.stringify(parameter));
  }, "asyncFunction");
};
```

### Timed asynchronous processing

The usage steps are the same as for normal asynchronous processing.  
The difference is in specifying the time to delay execution and the function to call it.

```ts
const delayFunction = (): void = {
  JobBroker.perform((parameter: Record<string, any>) => {
    console.info(JSON.stringify(parameter));
  }, "delayFunction");
};

const parameter = { foo: "bar" };
const startTIme = new Date();
// 3 minutes later
startTime.setMinutes(startTIme.getMinutes() + 3);

JobBroker.createDelaydJob(countDownTime).performLater(delayFunction, parameter);
```

## Document

see.
https://script.google.com/macros/library/d/11cz2CGI2m3W1_JS7PwnxL2_6hkvtj47ynFuxKDDAAUwh3jP04sYnigg8/GS:a098de2b998324d4