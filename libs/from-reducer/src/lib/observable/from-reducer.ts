import { BehaviorSubject, merge, Subject } from 'rxjs';
import { retry, scan, share, tap } from 'rxjs/operators';
import { Epic, FromReducerReturnType, Reducer } from '../types';

/**
 * Given a reducer function and an initial state creates a tuple which values will be:
 * 1. A observable with the form of ```Observable<S>``` that will emit a value every time is notified that a
 * new event happened with the result of the reduction between the current state and the value of an event,
 * this result will become the current state.
 *
 * 2. A function with the form of ```(event: T) => void``` to notify the previous observable that an event has occur.
 *
 * 3. A function that given an array of functions with the form of `(events$: Observable<T>, state$?: Observable<S>) => Observable<T>`
 * will merge the result of applying them to the event stream and the observable of state.
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

  const dispatch = (value: T) => events$.next(value);

  const combineEpics = (...epics: Epic<T, S>[]) => {
    const epicObs = epics.map((fn) => fn(events$, state$));
    return merge(...epicObs).pipe(tap(dispatch), retry());
  };

  return [state$, dispatch, combineEpics];
}
