import { filter, Observable, OperatorFunction } from 'rxjs';
import { Event, EventCreator, SyntheticEvent } from '../interfaces';

/**
 * Filter a stream of events by a event creator type
 * @param eventCreator we want to filter by
 * import { ofType, createEvent } from "reactive-actor";
 * import { tap, ignoreElements, takeUntil } from "rxjs";
 *
 * const logUser = createEvent<{ id: string }>('Log User');
 *
 * class UserActor extends Actor {
 *   private readonly logUser$ = this.messages$.pipe(
 *     ofType(logUser),
 *     tap(({ payload }) => console.log(payload)),
 *     ignoreElements(),
 *     takeUntil(this.stop$)
 *   );
 *
 *   constructor() {
 *     super('userActor');
 *     this.logUser$.subscribe();
 *   }
 * }
 *
 */
export function ofType<T>(
  eventCreator: EventCreator<T>
): OperatorFunction<Event, SyntheticEvent<T>> {
  return (source$: Observable<Event>) =>
    source$.pipe(
      filter(({ type }) => type === eventCreator.type)
    ) as Observable<SyntheticEvent<T>>;
}
