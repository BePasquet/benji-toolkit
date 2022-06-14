import { ofType } from 'from-reducer';
import { map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { addRecipient } from '../operators';
import { createEvent } from '../util';
import { Actor } from './actor.model';

const startEvent = createEvent('START');
const pauseEvent = createEvent('PAUSE');
describe('Actor Model', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('Should create a new instance of an actor with an address', () => {
    const address = 'unknown';
    const actor = new Actor(address);

    expect(actor).toBeDefined();
    expect(actor.address).toBe(address);
  });

  it('Should receive a message when someone sends one to it', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const event = startEvent(null);
      const expected = '-a';

      cold(expected).subscribe(() => actor.send(event));
      expectObservable((actor as any).messages$).toBe(expected, { a: event });
    });
  });

  it('Should receive multiple messages one after another', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const firstEvent = startEvent(null);
      const secondEvent = pauseEvent(null);
      const thirdEvent = startEvent(null);

      const firstEventTime = '-a';
      const secondEventTime = '--b';
      const thirdEventTime = '---c';

      cold(firstEventTime).subscribe(() => actor.send(firstEvent));

      cold(secondEventTime).subscribe(() => actor.send(secondEvent));

      cold(thirdEventTime).subscribe(() => actor.send(thirdEvent));

      expectObservable((actor as any).messages$).toBe('-abc', {
        a: firstEvent,
        b: secondEvent,
        c: thirdEvent,
      });
    });
  });

  it('Should send messages to itself', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const firstEvent = startEvent(null);
      const expectedEvent = pauseEvent(null);
      const expected = '-b';
      const message$ = (actor as any)?.messages$.pipe(
        ofType(startEvent),
        map(() => expectedEvent)
      );

      (actor as any).answer(message$);

      cold('-a').subscribe(() => actor.send(firstEvent));

      expectObservable(message$).toBe(expected, { b: expectedEvent });
    });
  });

  it('Should send messages to others', () => {
    testScheduler.run(({ expectObservable, cold, flush }) => {
      const actorSender = new Actor('a');
      const actorRecipient = new Actor('b');

      jest.spyOn(actorRecipient, 'send');

      const firstEvent = startEvent(null);
      const expected = '-a';

      const message$ = (actorSender as any)?.messages$.pipe(
        ofType(startEvent),
        addRecipient(actorRecipient)
      );

      (actorSender as any).answer(message$);

      cold('-a').subscribe(() => actorSender.send(firstEvent));

      expectObservable(message$).toBe(expected, {
        a: { ...firstEvent, recipient: actorRecipient },
      });

      flush();

      expect(actorRecipient.send).toHaveBeenCalled();
    });
  });
});
