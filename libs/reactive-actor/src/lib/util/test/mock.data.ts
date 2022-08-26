import { concatMap, of } from 'rxjs';
import { Actor } from '../../models';
import { addRecipient, ofType } from '../../operators';
import { createEvent } from '../create-event';
import { createReducer } from '../create-reducer';

export const startEvent = createEvent('START');
export const pauseEvent = createEvent('PAUSE');
export const replayEvent = createEvent('REPLAY');
export const changeSong = createEvent<string>('CHANGE_SONG');

export const mockPlayerReducer = createReducer({ playing: false }, (builder) =>
  builder.addCase(startEvent, (state) => ({ ...state, playing: true }))
);

export const mockMusicReducer = createReducer({ song: '' }, (builder) =>
  builder.addCase(changeSong, (state, { payload }) => ({
    ...state,
    song: payload,
  }))
);

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
