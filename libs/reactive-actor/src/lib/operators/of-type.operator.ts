import { filter, Observable, OperatorFunction } from 'rxjs';
import { Event, EventCreator } from '../interfaces';

export function ofType<T>(
  actionCreator: EventCreator<T>
): OperatorFunction<Event, ReturnType<EventCreator<T>>> {
  return (source$: Observable<Event>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<ReturnType<EventCreator<T>>>;
}
