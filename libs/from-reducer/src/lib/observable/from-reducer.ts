import { BehaviorSubject, merge, Subject } from 'rxjs';
import { retry, scan, share, tap } from 'rxjs/operators';
import { Epic, FromReducerReturnType, Reducer } from '../types';

/**
 * Given a reducer function and an initial state creates a tuple which values will be:
 * 1. An observable with the form of ```Observable<S>``` that will emit a value resulting from the applying the reducer function to
 * the current state and the event
 *
 * 2. A function with the form of ```(event: T) => void``` to notify the previous observable that an event has occur.
 *
 * 3. A function that accepts arguments with the form of `(events$: Observable<T>, state$?: Observable<S>) => Observable<T>`
 * that once applied will produce an observable that merges all functions to the events stream
 * This will come helpful when we want to intercept events to perform a side effect.
 *
 * @param reducer a reducer function that will be call every time an event happen
 * @param initialState an initial state for the reducer
 */
export function fromReducer<S, T>(
  reducer: Reducer<S, T>,
  initialState: S
): FromReducerReturnType<T, S> {
  const events$ = new Subject<T>();

  const state$ = events$.pipe(
    scan(reducer, initialState),
    share({ connector: () => new BehaviorSubject(initialState) })
  );

  const dispatch = (event: T) => events$.next(event);

  const combineEpics = (...epics: Epic<T, S>[]) => {
    const epicObs = epics.map((fn) => fn(events$, state$));
    return merge(...epicObs).pipe(tap(dispatch), retry());
  };

  return [state$, dispatch, combineEpics];
}
