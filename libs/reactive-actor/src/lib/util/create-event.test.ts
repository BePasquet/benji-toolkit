import { Actor } from '../models';
import { createEvent } from './create-event';

describe('createEvent', () => {
  it('Should create a function with type as a property', () => {
    const type = 'TEST_EVENT';
    const eventCreator = createEvent(type);
    expect(eventCreator.type).toBe(type);
  });

  it('Should create a function that once applied with an argument for payload returns an event object with the same payload specified as parameter', () => {
    const testWNPType = 'TEST_EVENT_WITH_NO_PAYLOAD';
    const test = createEvent(testWNPType);

    const eventWithNoPayloadExpected = {
      type: testWNPType,
      payload: null,
    };

    expect(test(null)).toEqual(eventWithNoPayloadExpected);

    const testWPType = 'TEST_EVENT_WITH_PAYLOAD';
    const payload = 'testPayload';
    const otherTest = createEvent<string>(testWPType);

    const eventWithPayloadExpected = {
      type: testWPType,
      payload,
    };

    expect(otherTest(payload)).toEqual(eventWithPayloadExpected);
  });

  it('Should create a function that once applied with an argument for sender returns an event object with a sender specified as parameter', () => {
    const actor = new Actor('testActor');
    const type = 'TEST_EVENT';
    const test = createEvent(type);
    const expected = { type, payload: null, sender: actor };

    expect(test(null, actor)).toEqual(expected);
  });
});
