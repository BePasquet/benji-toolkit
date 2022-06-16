import { concatMap, of } from 'rxjs';
import { Actor } from '../../models';
import { addRecipient, ofType } from '../../operators';
import { createEvent } from '../create-event';

export const startEvent = createEvent('START');
export const pauseEvent = createEvent('PAUSE');
export const replayEvent = createEvent('REPLAY');

export class MockActor extends Actor {
  private readonly start$ = this.messages$.pipe(
    ofType(startEvent),
    concatMap(({ sender }) => of(pauseEvent(null)).pipe(addRecipient(sender)))
  );

  constructor(address: string) {
    super(address);

    this.answer(this.start$);
  }
}
