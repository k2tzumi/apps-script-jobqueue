import { DelayedJobBroker } from "../src/DelayedJobBroker";
import { Parameter, TimeBasedEvent } from "../src/JobBroker";

const scriptCache = {
  get: jest.fn(function () {
    return null;
  }),
  put: jest.fn(),
  getAll: jest.fn(),
  putAll: jest.fn(),
  remove: jest.fn(),
  removeAll: jest.fn(),
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
  create: jest.fn(() => trigger),
};
const clockTriggerBuilder = {
  after: jest.fn(() => triggerBuilder),
  at: jest.fn(() => triggerBuilder),
};
const lock = {
  hasLock: jest.fn(),
  releaseLock: jest.fn(),
  tryLock: jest.fn(),
  waitLock: jest.fn(),
};
const triggerSource = {
  SPREADSHEETS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.SPREADSHEETS),
  CLOCK: jest.fn(() => GoogleAppsScript.Script.TriggerSource.CLOCK),
  FORMS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.FORMS),
  DOCUMENTS: jest.fn(() => GoogleAppsScript.Script.TriggerSource.DOCUMENTS),
  CALENDAR: jest.fn(() => GoogleAppsScript.Script.TriggerSource.CALENDAR),
};

CacheService["getScriptCache"] = jest.fn(() => scriptCache);
ScriptApp["getProjectTriggers"] = jest.fn(() => [trigger]);
ScriptApp["newTrigger"] = jest.fn(() => triggerBuilder);
ScriptApp["deleteTrigger"] = jest.fn();
ScriptApp["TriggerSource"] = jest.fn(() => triggerSource);
LockService["getScriptLock"] = jest.fn(() => lock);

const jobEventHandler = (event: TimeBasedEvent): void => {
  console.log(JSON.stringify(event));
};

describe("DelayedJobBroker", () => {
  describe("createJob", () => {
    it("success", () => {
      const broker = DelayedJobBroker.createJob<Parameter>(jobEventHandler, new Date());
      expect(broker).toBeDefined();
    });
  });
  describe("performLater", () => {
    it("success", () => {
      const broker = DelayedJobBroker.createJob<Parameter>(jobEventHandler, new Date());

      interface HOGE {
        foo: string;
      }

      const hoge: HOGE = { foo: "sss" };

      broker.performLater(jest.fn(), {});
      broker.performLater(jest.fn(), { foo: "1" });
      broker.performLater(jest.fn(), { bar: 1 });
      broker.performLater(jest.fn(), { baz: true });
      broker.performLater(jest.fn(), { 1: null });
      broker.performLater(jest.fn(), { empty: {} });
      broker.performLater(jest.fn(), { nest: { foo: 1 } });
      broker.performLater(jest.fn(), [{ nest: { foo: 1 } }]);
      broker.performLater(jest.fn(), hoge);
    });
  });
});
