import { TestScheduler } from 'rxjs/testing';
import { Actor } from '../models';
import { MockActor, pauseEvent, startEvent } from '../util/test/mock.data';

let testScheduler: TestScheduler;

beforeAll(() => {
  testScheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
  );
});

describe('addRecipient', () => {
  it('Should add a recipient to an existing event', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new MockActor('mock');
      const receiver = new Actor('receiver');
      const event = { ...startEvent, sender: receiver };

      cold('-a').subscribe(() => actor.send(event));

      expectObservable((actor as any).start$).toBe('-a', {
        a: { ...pauseEvent(null), recipient: receiver },
      });
    });
  });
});
