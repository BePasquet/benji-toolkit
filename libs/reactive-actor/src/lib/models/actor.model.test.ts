import { ofType } from 'from-reducer';
import { map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { addRecipient } from '../operators';
import { createEvent } from '../util';
import { Actor, stop } from './actor.model';

const startEvent = createEvent('START');
const pauseEvent = createEvent('PAUSE');
const replayEvent = createEvent('REPLAY');

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

      const start = startEvent(null);
      const pause = pauseEvent(null);
      const replay = replayEvent(null);

      const firstEventTime = '-a';
      const secondEventTime = '--b';
      const thirdEventTime = '---c';
      const expected = '-abc';

      cold(firstEventTime).subscribe(() => actor.send(start));

      cold(secondEventTime).subscribe(() => actor.send(pause));

      cold(thirdEventTime).subscribe(() => actor.send(replay));

      expectObservable((actor as any).messages$).toBe(expected, {
        a: start,
        b: pause,
        c: replay,
      });
    });
  });

  it('Should send messages to itself', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const start = startEvent(null);
      const pause = pauseEvent(null);
      const expected = '-(ba)';

      const message$ = (actor as any)?.messages$.pipe(
        ofType(startEvent),
        map(() => pause)
      );

      (actor as any).answer(message$);

      cold('-a').subscribe(() => actor.send(start));

      expectObservable((actor as any).messages$).toBe(expected, {
        a: start,
        b: pause,
      });
    });
  });

  it('Should send messages to others', () => {
    testScheduler.run(({ expectObservable, cold, flush }) => {
      const actorSender = new Actor('unknownSender');
      const actorRecipient = new Actor('unknownReceiver');

      jest.spyOn(actorRecipient, 'send');

      const start = startEvent(null);
      const expected = '-a';

      const message$ = (actorSender as any)?.messages$.pipe(
        ofType(startEvent),
        addRecipient(actorRecipient)
      );

      (actorSender as any).answer(message$);

      cold('-a').subscribe(() => actorSender.send(start));

      expectObservable(message$).toBe(expected, {
        a: { ...start, recipient: actorRecipient },
      });

      flush();

      expect(actorRecipient.send).toHaveBeenCalled();
    });
  });

  it('Should execute behavior every time matches a particular message', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const start = startEvent(null);
      const pause = pauseEvent(null);

      cold('-a').subscribe(() => actor.send(start));
      cold('------b').subscribe(() => actor.send(start));

      const message$ = (actor as any)?.messages$.pipe(
        ofType(startEvent),
        map(() => pause)
      );

      (actor as any)?.answer(message$);

      expectObservable((actor as any).messages$).toBe('-(ba)-(ba)', {
        a: start,
        b: pause,
      });
    });
  });

  it('Should not execute behavior after stop message has been sent', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const actor = new Actor('unknown');

      const start = startEvent(null);
      const pause = pauseEvent(null);
      const stopEv = stop(null);
      const expected = '-(ba)-saa';

      cold('-a').subscribe(() => actor.send(start));
      cold('------s').subscribe(() => actor.send(stopEv));
      cold('-------a').subscribe(() => actor.send(start));
      cold('--------a').subscribe(() => actor.send(start));

      const message$ = (actor as any)?.messages$.pipe(
        ofType(startEvent),
        map(() => pause)
      );

      (actor as any)?.answer(message$);

      expectObservable((actor as any).messages$).toBe(expected, {
        a: start,
        b: pause,
        s: stopEv,
      });
    });
  });
});
