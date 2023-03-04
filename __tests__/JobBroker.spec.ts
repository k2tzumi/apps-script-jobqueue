import { JobBroker, Parameter } from "../src/JobBroker";

const scriptCache = {
    get: jest.fn(function () {
        return null;
    }),
    put: jest.fn(),
    getAll: jest.fn(),
    putAll: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn()
};

const trigger = {
    getEventType: jest.fn(),
    getHandlerFunction: jest.fn(),
    getTriggerSource: jest.fn(),
    getTriggerSourceId: jest.fn(),
    getUniqueId: jest.fn(),
};

const triggerBuilder = {
    timeBased: jest.fn(() => clockTriggerBuilder),
    create: jest.fn(() => trigger)
}
const clockTriggerBuilder = {
    after: jest.fn(() => triggerBuilder)
}
const lock = {
    hasLock: jest.fn(),
    releaseLock: jest.fn(),
    tryLock: jest.fn(),
    waitLock: jest.fn(),
}
const triggerSource = {
    SPREADSHEETS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.SPREADSHEETS),
    CLOCK: jest.fn(() => GoogleAppsScript.Script.TriggerSource.CLOCK),
    FORMS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.FORMS),
    DOCUMENTS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.DOCUMENTS),
    CALENDAR: jest.fn(() => GoogleAppsScript.Script.TriggerSource.CALENDAR),
}

CacheService['getScriptCache'] = jest.fn(() => scriptCache);
ScriptApp['getProjectTriggers'] = jest.fn(() => [trigger]);
ScriptApp['newTrigger'] = jest.fn(() => triggerBuilder);
ScriptApp['deleteTrigger'] = jest.fn();
ScriptApp['TriggerSource'] = jest.fn(() => triggerSource);
LockService['getScriptLock'] = jest.fn(() => lock);

describe('JobBroker', () => {
    describe('enqueue', () => {
        it('success', () => {
            const jobBroker = new JobBroker();
            interface HOGE {
                foo: string;
            }

            const hoge: HOGE = { foo: "sss" };

            jobBroker.enqueue(jest.fn(), {});
            jobBroker.enqueue(jest.fn(), { foo: "1" });
            jobBroker.enqueue(jest.fn(), { "bar": 1 });
            jobBroker.enqueue(jest.fn(), { baz: true });
            jobBroker.enqueue(jest.fn(), { 1: null });
            jobBroker.enqueue(jest.fn(), { empty: {} });
            jobBroker.enqueue(jest.fn(), { nest: { foo: 1 } });
            jobBroker.enqueue(jest.fn(), [{ nest: { foo: 1 } }]);
            jobBroker.enqueue(jest.fn(), hoge as {});
        });
    });
    describe('dequeue', () => {
        it('success', () => {
            const jobBroker = new JobBroker();

            jobBroker.enqueue(jest.fn(), {});
            jobBroker.dequeue('dummy');
        });
    });
    describe('consumeJob', () => {
        it('success', () => {
            const jobBroker = new JobBroker();
            const callBack = (): void => {
                const jobBroker = new JobBroker();
                jobBroker.consumeJob((parameter: Parameter) => {
                    const cast = parameter as { foo: string; };
                    console.info(JSON.stringify(cast.foo));
                }, "callBack");
            };

            jobBroker.enqueue(callBack, { foo: "bar" });
        });
    });
});

